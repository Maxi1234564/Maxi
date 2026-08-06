<?php
/**
 * NSBB – Formular-Endpunkt für Kontakt- und Karriereformular
 * ---------------------------------------------------------------------------
 * Nimmt JSON per POST entgegen, prüft es, verschickt zwei Mails
 * (Anfrage an die Kanzlei, Eingangsbestätigung an den Absender) und
 * antwortet mit JSON: {"success":true|false,"message":"..."}
 *
 * Getestet gegen PHP 8. Läuft ohne Zusatzbibliotheken auf All-Inkl.
 *
 * ── Vor dem Livegang prüfen ────────────────────────────────────────────────
 *  1. ABSENDER unten muss ein im KAS wirklich existierendes Postfach oder
 *     ein eingerichteter Alias der Domain sein. Fremde Absender werden von
 *     Empfängerservern als Spam eingestuft (SPF/DKIM).
 *  2. Im KAS eine aktuelle PHP-Version einstellen (8.1+).
 *  3. Verzeichnis für die Sperrdatei muss beschreibbar sein (siehe RATE_DIR).
 */

declare(strict_types=1);

// ─── Einstellungen ──────────────────────────────────────────────────────────

/** Absender aller Mails. MUSS zur Domain gehören, sonst Spam-Verdacht. */
const ABSENDER       = 'mail@nsbb.de';
const ABSENDER_NAME  = 'NSBB Website';

/** Empfänger je Formularart. */
const EMPFAENGER = [
    'karriere' => 'karriere@nsbb.de',   // Bewerbungen
    'standard' => 'mandant@nsbb.de',    // allgemeines Kontaktformular (Mandanten-Anfragen)
];

/** Höchstens so viele Absendungen pro IP und Zeitfenster. */
const RATE_MAX      = 5;
const RATE_FENSTER  = 3600;             // Sekunden
const RATE_DIR      = __DIR__ . '/.formlimit';

/** Grenzen, um Missbrauch und Riesen-Mails zu verhindern. */
const MAX_BODY      = 20000;            // Zeichen im Nachrichtentext
const MAX_FELD      = 200;              // Zeichen in Kurzfeldern

/** Datei-Anhang (Lebenslauf im Bewerbungsformular). */
const MAX_UPLOAD    = 5 * 1024 * 1024;  // 5 MB
const UPLOAD_TYPEN  = [                  // erlaubte Endung => MIME für den Anhang
    'pdf'  => 'application/pdf',
    'doc'  => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'jpg'  => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png'  => 'image/png',
];

/** Fortlaufende Anfragenummer – serverseitig, damit sie eindeutig ist. */
const NR_DATEI      = RATE_DIR . '/anfrage-nr';

/**
 * Nächste fortlaufende Nummer (kanzleiweit, nicht pro Browser). Gibt 0 zurück,
 * wenn die Datei nicht geschrieben werden kann – dann steht eben keine Nummer
 * im Betreff, was unkritisch ist.
 */
function naechste_nummer(): int
{
    if (!is_dir(RATE_DIR)) {
        @mkdir(RATE_DIR, 0700, true);
    }
    $fp = @fopen(NR_DATEI, 'c+');
    if (!$fp) {
        return 0;
    }
    @flock($fp, LOCK_EX);
    $n = (int)stream_get_contents($fp) + 1;
    @rewind($fp);
    @ftruncate($fp, 0);
    @fwrite($fp, (string)$n);
    @fflush($fp);
    @flock($fp, LOCK_UN);
    @fclose($fp);
    return $n;
}

// ─── Antwort-Hilfsfunktionen ────────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

// Kein "never"-Rückgabetyp: den gibt es erst ab PHP 8.1. So läuft die Datei
// auch, wenn im KAS versehentlich eine ältere PHP-Version eingestellt ist.
function antwort(bool $ok, string $text, int $status = 200)
{
    http_response_code($status);
    echo json_encode(['success' => $ok, 'message' => $text], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Entfernt Zeilenumbrüche. Ohne das könnte jemand über ein Eingabefeld
 * zusätzliche Mail-Header einschleusen (Header-Injection) und den Server
 * als Spam-Schleuder missbrauchen.
 */
function eine_zeile(string $s, int $max = MAX_FELD): string
{
    $s = str_replace(["\r", "\n", "\0"], ' ', $s);
    $s = trim(preg_replace('/\s+/u', ' ', $s) ?? '');
    return mb_substr($s, 0, $max);
}

/** Betreffzeilen mit Umlauten müssen MIME-kodiert werden. */
function betreff_kodiert(string $s): string
{
    return '=?UTF-8?B?' . base64_encode($s) . '?=';
}

// ─── Nur POST ───────────────────────────────────────────────────────────────

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    antwort(false, 'Nur POST erlaubt.', 405);
}

// ─── Rate-Limit ─────────────────────────────────────────────────────────────
// Einfacher dateibasierter Zähler pro IP. Hält Skript-Kiddies und
// fehlgeleitete Wiederholungen ab; kein Schutz gegen verteilte Angriffe.

$ip        = (string)($_SERVER['REMOTE_ADDR'] ?? 'unbekannt');
$rateDatei = RATE_DIR . '/' . hash('sha256', $ip);   // IP nicht im Klartext ablegen (DSGVO)

if (!is_dir(RATE_DIR)) {
    @mkdir(RATE_DIR, 0700, true);
}

/** Bisherige Sendungen dieser IP im Zeitfenster. */
function rate_zeiten(string $datei): array
{
    if (!is_file($datei)) {
        return [];
    }
    $grenze = time() - RATE_FENSTER;
    $zeiten = [];
    foreach (explode(',', (string)@file_get_contents($datei)) as $t) {
        if ((int)$t > $grenze) {
            $zeiten[] = (int)$t;
        }
    }
    return $zeiten;
}

/**
 * Zählt eine Sendung. Wird bewusst ERST nach erfolgreichem Versand
 * aufgerufen – sonst würde ein Besucher, der sich bei der E-Mail-Adresse
 * vertippt, sein Kontingent mit Fehlversuchen aufbrauchen.
 */
function rate_zaehlen(string $datei): void
{
    if (!is_dir(RATE_DIR) || !is_writable(RATE_DIR)) {
        return;
    }
    $zeiten   = rate_zeiten($datei);
    $zeiten[] = time();
    @file_put_contents($datei, implode(',', $zeiten), LOCK_EX);

    // Gelegentlich alte Dateien aufräumen
    if (random_int(1, 50) === 1) {
        foreach ((array)glob(RATE_DIR . '/*') as $f) {
            if (is_file($f) && filemtime($f) < time() - RATE_FENSTER * 2) {
                @unlink($f);
            }
        }
    }
}

if (count(rate_zeiten($rateDatei)) >= RATE_MAX) {
    antwort(false, 'Zu viele Anfragen. Bitte versuchen Sie es später erneut oder schreiben Sie an ' . EMPFAENGER['standard'] . '.', 429);
}

// ─── Eingabe lesen (JSON ODER multipart mit Datei-Anhang) ───────────────────
// Das Kontaktformular sendet JSON. Das Bewerbungsformular sendet multipart/
// form-data, damit ein Lebenslauf angehängt werden kann – dann füllt PHP
// $_POST und $_FILES.

$istMultipart = stripos((string)($_SERVER['CONTENT_TYPE'] ?? ''), 'multipart/form-data') !== false;

if ($istMultipart) {
    // Größer als in der PHP-Konfiguration erlaubt? Dann kommt PHP mit leeren
    // $_POST/$_FILES an – das als „zu groß" behandeln.
    if (empty($_POST) && empty($_FILES)) {
        antwort(false, 'Die Übermittlung war zu groß oder unvollständig. Bitte Datei verkleinern (max. 5 MB).', 413);
    }
    $daten = $_POST;
} else {
    $roh = file_get_contents('php://input');
    if ($roh === false || $roh === '' || strlen($roh) > 100000) {
        antwort(false, 'Ungültige Anfrage.', 400);
    }
    $daten = json_decode($roh, true);
    if (!is_array($daten)) {
        antwort(false, 'Ungültige Anfrage.', 400);
    }
}

// ─── Honeypot ───────────────────────────────────────────────────────────────
// Ein für Menschen unsichtbares Feld. Nur Bots füllen es aus.
// Wir melden bewusst Erfolg, damit der Bot nichts dazulernt.

if (!empty($daten['website']) || !empty($daten['url'])) {
    antwort(true, 'Vielen Dank für Ihre Nachricht.');
}

// ─── Felder prüfen ──────────────────────────────────────────────────────────

$email = eine_zeile((string)($daten['email'] ?? ''));
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254) {
    antwort(false, 'Bitte geben Sie eine gültige E-Mail-Adresse an.', 422);
}

$body = (string)($daten['body'] ?? '');
$body = str_replace("\0", '', $body);
$body = mb_substr(trim($body), 0, MAX_BODY);
if ($body === '') {
    antwort(false, 'Es wurde keine Nachricht übermittelt.', 422);
}

$typ = eine_zeile((string)($daten['type'] ?? 'Anfrage'), 60);
if ($typ === '') {
    $typ = 'Anfrage';
}

// Bewerbung oder normale Anfrage? Bestimmt Empfänger und Textbausteine.
$istKarriere = (bool)preg_match('/karriere|career|bewerb/i', $typ);
$empfaenger  = $istKarriere ? EMPFAENGER['karriere'] : EMPFAENGER['standard'];
$istEnglisch = (bool)preg_match('/career|inquiry/i', $typ);

// ─── Datei-Anhang prüfen (nur Bewerbungsformular) ───────────────────────────
$anhang = null;   // ['name' => …, 'mime' => …, 'inhalt' => …]
if (!empty($_FILES['datei']) && (($_FILES['datei']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE)) {
    $f = $_FILES['datei'];
    if (($f['error'] ?? 1) !== UPLOAD_ERR_OK) {
        antwort(false, 'Die Datei konnte nicht hochgeladen werden.', 422);
    }
    if ((int)($f['size'] ?? 0) > MAX_UPLOAD || (int)($f['size'] ?? 0) <= 0) {
        antwort(false, 'Die Datei ist zu groß (max. 5 MB) oder leer.', 422);
    }
    if (!is_uploaded_file((string)($f['tmp_name'] ?? ''))) {
        antwort(false, 'Ungültiger Upload.', 422);
    }
    $ext = strtolower(pathinfo((string)($f['name'] ?? ''), PATHINFO_EXTENSION));
    if (!array_key_exists($ext, UPLOAD_TYPEN)) {
        antwort(false, 'Dateiformat nicht erlaubt. Bitte PDF, DOC, DOCX, JPG oder PNG.', 422);
    }
    $inhalt = @file_get_contents((string)$f['tmp_name']);
    if ($inhalt === false || $inhalt === '') {
        antwort(false, 'Die Datei konnte nicht gelesen werden.', 422);
    }
    // Dateinamen säubern – keine Pfade/Steuerzeichen im Mail-Header.
    $name = eine_zeile((string)($f['name'] ?? 'anhang'), 120);
    $name = preg_replace('/[^\w .\-()]+/u', '_', $name) ?: ('anhang.' . $ext);
    $anhang = ['name' => $name, 'mime' => UPLOAD_TYPEN[$ext], 'inhalt' => $inhalt];
}

// ─── Mail an die Kanzlei ────────────────────────────────────────────────────

$nr      = naechste_nummer();
$nrText  = $nr > 0 ? '#' . $nr . ' ' : '';
$betreff = betreff_kodiert(sprintf('[Website] %s%s – %s', $nrText, $typ, $email));

$textteil = ($nr > 0 ? "Anfrage-Nr.: $nr\n\n" : '')
    . $body
    . "\n\n"
    . "-- \n"
    . "Gesendet über das Formular auf nsbb.de\n"
    . 'Zeitpunkt: ' . date('d.m.Y H:i:s') . "\n"
    . 'Antwort geht an: ' . $email . "\n";

if ($anhang) {
    // Mit Anhang: multipart/mixed (Text + Datei).
    $grenze    = '=_NSBB_' . bin2hex(random_bytes(12));
    $nachricht = "--$grenze\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $textteil . "\r\n"
        . "--$grenze\r\n"
        . 'Content-Type: ' . $anhang['mime'] . "; name=\"" . $anhang['name'] . "\"\r\n"
        . "Content-Transfer-Encoding: base64\r\n"
        . 'Content-Disposition: attachment; filename="' . $anhang['name'] . "\"\r\n\r\n"
        . chunk_split(base64_encode($anhang['inhalt'])) . "\r\n"
        . "--$grenze--\r\n";
    $kopf = [
        'From: ' . ABSENDER_NAME . ' <' . ABSENDER . '>',
        'Reply-To: ' . $email,
        'MIME-Version: 1.0',
        'Content-Type: multipart/mixed; boundary="' . $grenze . '"',
        'X-Mailer: NSBB-Website',
        'Auto-Submitted: auto-generated',
    ];
} else {
    $nachricht = $textteil;
    $kopf = [
        'From: ' . ABSENDER_NAME . ' <' . ABSENDER . '>',
        'Reply-To: ' . $email,               // Antworten gehen direkt an den Absender
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'MIME-Version: 1.0',
        'X-Mailer: NSBB-Website',
        'Auto-Submitted: auto-generated',
    ];
}

// -f setzt den Envelope-Sender. Ohne das verwendet der Server seinen
// Standardabsender, was regelmäßig zu Spam-Einstufung führt.
$gesendet = @mail(
    $empfaenger,
    $betreff,
    $nachricht,
    implode("\r\n", $kopf),
    '-f' . ABSENDER
);

if (!$gesendet) {
    // Details bleiben im Serverlog, nicht in der Antwort an den Browser.
    error_log('[NSBB] mail() fehlgeschlagen. Empfaenger: ' . $empfaenger);
    antwort(
        false,
        $istEnglisch
            ? 'Sending failed. Please email us directly at ' . $empfaenger . '.'
            : 'Der Versand ist fehlgeschlagen. Bitte schreiben Sie uns direkt an ' . $empfaenger . '.',
        500
    );
}

// Erst jetzt zählen – Fehlversuche sollen das Kontingent nicht aufbrauchen.
rate_zaehlen($rateDatei);

// ─── Eingangsbestätigung an den Absender ────────────────────────────────────
// Schlägt sie fehl, ist das kein Grund, dem Nutzer einen Fehler zu zeigen –
// seine Anfrage ist ja angekommen.

$bestBetreff = $istEnglisch
    ? 'We received your enquiry – NSBB'
    : 'Ihre Anfrage ist bei uns eingegangen – NSBB';

$bestText = $istEnglisch
    ? "Dear Sir or Madam,\n\nthank you for your message.\n\n"
      . "We have received your enquiry and will get back to you as soon as possible.\n\n"
      . "This is an automated confirmation – please do not reply to this email.\n\n"
      . "Your message:\n"
      . "----------------------------------------\n"
      . $body . "\n"
      . "----------------------------------------\n\n"
      . "NSBB Steuerberatungsgesellschaft mbH\n"
      . "Berlin: +49 30 8158093-0 | Köln: +49 221 973064-0\n"
      . "nsbb.de\n"
    : "Guten Tag,\n\nvielen Dank für Ihre Nachricht.\n\n"
      . "Ihre Anfrage ist bei uns eingegangen. Wir melden uns schnellstmöglich bei Ihnen.\n\n"
      . "Dies ist eine automatische Bestätigung – bitte antworten Sie nicht auf diese E-Mail.\n\n"
      . "Ihre Nachricht:\n"
      . "----------------------------------------\n"
      . $body . "\n"
      . "----------------------------------------\n\n"
      . "NSBB Steuerberatungsgesellschaft mbH\n"
      . "Berlin: +49 30 8158093-0 | Köln: +49 221 973064-0\n"
      . "nsbb.de\n";

$bestKopf = [
    'From: ' . ABSENDER_NAME . ' <' . ABSENDER . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'MIME-Version: 1.0',
    'X-Mailer: NSBB-Website',
    'Auto-Submitted: auto-replied',      // verhindert Abwesenheits-Pingpong
    'Precedence: bulk',
];

@mail($email, betreff_kodiert($bestBetreff), $bestText, implode("\r\n", $bestKopf), '-f' . ABSENDER);

// ─── Fertig ─────────────────────────────────────────────────────────────────

antwort(
    true,
    $istEnglisch
        ? 'Thank you – we have received your enquiry.'
        : 'Vielen Dank – Ihre Anfrage ist bei uns eingegangen.'
);
