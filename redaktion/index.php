<?php
declare(strict_types=1);
/**
 * NSBB Redaktionsbereich – Beiträge und Mandanteninformationen pflegen.
 *
 * SICHERHEITSMODELL (siehe dokumente/Redaktionsbereich-Konzept.md, "Weg 1"):
 *   · Der ZUGANG wird vom SERVER geprüft (Basic Auth über redaktion/.htaccess),
 *     nicht von dieser Datei. Hier steht deshalb bewusst KEIN Passwortvergleich.
 *   · Diese Datei prüft nur die EINGABEN (Uploads, Felder) und schreibt die
 *     Inhalte nach ../daten/ – atomar, mit Sperre und Sicherungskopien.
 *   · Jeder schreibende Aufruf verlangt zusätzlich ein CSRF-Token, weil der
 *     Browser gemerkte Basic-Auth-Zugangsdaten auch an untergeschobene
 *     Formulare anhängen würde.
 *
 * Ablage (öffentlich lesbar, von der Seite /aktuelles zur Laufzeit geladen):
 *   daten/beitraege.json       Beiträge (neueste zuerst)
 *   daten/bilder/              Beitragsbilder (Dateiname = Beitrags-Nr.)
 *   daten/beitragsseiten/      je Beitrag eine eigene, crawlbare Seite
 *                              (/beitrag/<adresse>) mit dem richtigen
 *                              Vorschaubild – siehe Abschnitt 9
 *   daten/beitraege-sitemap.xml  eigene Sitemap nur für Beiträge (die
 *                              Haupt-Sitemap gehört dem Node-Werkzeug und
 *                              wird bei jedem Deploy überschrieben)
 *   daten/mandanteninfo.json   Ausgaben-Verzeichnis (neueste zuerst)
 *   daten/mandanteninfo/       die PDF-Dateien
 *   daten/backup/              Sicherungskopien der JSONs (nicht abrufbar)
 *
 * Getestet gegen PHP 8.1+. Keine Fremdbibliotheken.
 */

// ── 1 · Konfiguration ──────────────────────────────────────────────────────
define('WURZEL',  dirname(__DIR__));
define('DATEN',   WURZEL . '/daten');
define('BILDER',  DATEN . '/bilder');
define('MI_DIR',  DATEN . '/mandanteninfo');
define('BACKUP',  DATEN . '/backup');
define('BEITRAGSSEITEN', DATEN . '/beitragsseiten');

const MAX_BILD          = 5  * 1024 * 1024;   // 5 MB
const MAX_PDF           = 15 * 1024 * 1024;   // 15 MB
const BACKUPS_BEHALTEN  = 20;                 // Sicherungskopien je Manifest
const BILD_MAX_BREITE   = 1600;               // px – größere Bilder werden verkleinert (falls GD da ist)
const BILD_OG_BREITE    = 1200;               // px – Vorschaubild beim Teilen (WhatsApp/LinkedIn), wie assets/images/og-image.jpg
const BILD_OG_HOEHE     = 630;

const KATEGORIEN = ['GmbH','Holdingstrukturen','E-Commerce','International','Unternehmer','Immobilien','Digitalisierung'];
const MONATE     = [1=>'Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

// Erlaubte Bildformate: Endung wird aus dem ECHTEN Inhalt (finfo) abgeleitet,
// nie aus dem Dateinamen des Browsers.
const BILD_TYPEN = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

// ── 2 · Fail-closed-Wächter ────────────────────────────────────────────────
// Gürtel zu den Hosenträgern: Ist der Verzeichnisschutz nicht aktiv (KAS-
// Verzeichnisschutz noch nicht gesetzt, Modul aus, o. Ä.), verweigert diese
// Datei selbst den Dienst (403), statt ungeschützt zu laufen.
// WICHTIG: NUR die von Apache nach ERFOLGREICHER Passwortprüfung gesetzten
// Variablen zählen (REMOTE_USER / PHP_AUTH_USER, plus die REDIRECT_-Variante
// hinter FastCGI). Der rohe Authorization-Header darf NICHT geprüft werden –
// den kann jeder ungeprüft mitschicken, das wäre kein Schutz.
// Einzige Ausnahme: der lokale Testserver `php -S` (kennt kein Basic Auth).
$hinterBasicAuth = !empty($_SERVER['REMOTE_USER'])
  || !empty($_SERVER['PHP_AUTH_USER'])
  || !empty($_SERVER['REDIRECT_REMOTE_USER']);
$lokalerTest     = (php_sapi_name() === 'cli-server');
if (!$hinterBasicAuth && !$lokalerTest) {
  http_response_code(403);
  header('Content-Type: text/plain; charset=utf-8');
  exit("Zugriff verweigert.\n\nDieser Bereich muss hinter dem Verzeichnisschutz (Basic Auth) liegen.\nDie redaktion/.htaccess scheint nicht zu greifen – bitte Projektleitung informieren.");
}

// ── 3 · Sitzung + CSRF ─────────────────────────────────────────────────────
$cookiePfad = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? '/redaktion/index.php'), '/') . '/';
session_set_cookie_params([
  'path'     => $cookiePfad,
  'secure'   => !empty($_SERVER['HTTPS']),
  'httponly' => true,
  'samesite' => 'Strict',
]);
session_start();
if (empty($_SESSION['csrf'])) { $_SESSION['csrf'] = bin2hex(random_bytes(32)); }

function csrf_feld(): string {
  return '<input type="hidden" name="csrf" value="' . esc($_SESSION['csrf']) . '">';
}
function csrf_pruefen(): void {
  $t = (string)($_POST['csrf'] ?? '');
  if ($t === '' || !hash_equals($_SESSION['csrf'], $t)) {
    http_response_code(403);
    exit('Sitzung abgelaufen oder ungültige Anfrage. Bitte zurückgehen, die Seite neu laden und erneut versuchen.');
  }
}

// ── 4 · Kleine Helfer ──────────────────────────────────────────────────────
function esc(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

function flash_setzen(string $typ, string $text): void { $_SESSION['flash'] = ['typ' => $typ, 'text' => $text]; }
function flash_holen(): ?array { $f = $_SESSION['flash'] ?? null; unset($_SESSION['flash']); return $f; }

function zurueck(string $anhang = ''): never {
  header('Location: ' . ($_SERVER['SCRIPT_NAME'] ?? 'index.php') . $anhang);
  exit;
}

function verzeichnisse_anlegen(): void {
  foreach ([DATEN, BILDER, MI_DIR, BACKUP, BEITRAGSSEITEN] as $d) {
    if (!is_dir($d)) { @mkdir($d, 0755, true); }
  }
}

/**
 * Macht aus einem Titel (oder einer von Hand eingegebenen Adresse) eine
 * saubere, eindeutige URL-Adresse: kleingeschrieben, Umlaute übertragen,
 * alles außer a–z/0–9 wird zum Bindestrich. Bei einer Kollision mit einer
 * schon vorhandenen Adresse wird "-2", "-3" … angehängt.
 * $vorhandeneSlugs sind die Adressen der ANDEREN Beiträge (der eigene, gerade
 * bearbeitete Beitrag ist darin nicht enthalten – das entscheidet die
 * aufrufende Stelle).
 */
function slug_erzeugen(string $text, array $vorhandeneSlugs): string {
  $s = mb_strtolower($text, 'UTF-8');
  $s = strtr($s, ['ä' => 'ae', 'ö' => 'oe', 'ü' => 'ue', 'ß' => 'ss']);
  $s = preg_replace('/[^a-z0-9]+/u', '-', $s) ?? '';
  $s = trim($s, '-');
  if ($s === '') { $s = 'beitrag'; }
  $basis = $s;
  $i = 2;
  while (in_array($s, $vorhandeneSlugs, true)) { $s = $basis . '-' . $i; $i++; }
  return $s;
}

/** Löscht eine im Manifest vermerkte Datei – aber nur innerhalb von daten/. */
function datei_loeschen_sicher(?string $relativ): void {
  if (!$relativ) { return; }
  if (!str_starts_with($relativ, 'daten/') || str_contains($relativ, '..')) { return; }
  $abs = WURZEL . '/' . $relativ;
  if (is_file($abs)) { @unlink($abs); }
}

// ── 5 · Manifeste lesen und schreiben ──────────────────────────────────────
/**
 * Liest ein Manifest tolerant: fehlende oder kaputte Datei ergibt das leere
 * Grundgerüst (die öffentliche Seite zeigt dann schlicht den Leerzustand).
 */
function manifest_lesen(string $pfad, string $listenschluessel): array {
  $leer = ['stand' => null, $listenschluessel => []];
  if (!is_file($pfad)) { return $leer; }
  $fh = @fopen($pfad, 'r');
  if (!$fh) { return $leer; }
  @flock($fh, LOCK_SH);
  $roh = stream_get_contents($fh) ?: '';
  @flock($fh, LOCK_UN);
  fclose($fh);
  $d = json_decode($roh, true);
  if (!is_array($d) || !isset($d[$listenschluessel]) || !is_array($d[$listenschluessel])) { return $leer; }
  return $d;
}

/**
 * Ändert ein Manifest atomar: EINE Exklusiv-Sperre um den gesamten
 * Lese-Ändern-Schreib-Zyklus (verhindert verlorene Änderungen bei
 * gleichzeitigem Arbeiten), Sicherungskopie des alten Stands, dann
 * Temporärdatei + rename() – ein Abbruch mittendrin hinterlässt nie
 * eine halb geschriebene Datei.
 */
function manifest_aendern(string $pfad, string $listenschluessel, callable $aenderung): void {
  verzeichnisse_anlegen();
  $sperre = fopen(DATEN . '/.sperre', 'c');
  if (!$sperre || !flock($sperre, LOCK_EX)) {
    throw new RuntimeException('Interne Sperre nicht verfügbar – bitte erneut versuchen.');
  }
  try {
    $daten = manifest_lesen($pfad, $listenschluessel);
    $daten = $aenderung($daten);
    if (!is_array($daten)) { throw new RuntimeException('Interner Fehler beim Ändern.'); }

    // Sicherungskopie des bisherigen Stands + Rotation
    if (is_file($pfad)) {
      $basis = pathinfo($pfad, PATHINFO_FILENAME);
      @copy($pfad, BACKUP . '/' . $basis . '-' . date('Ymd-His') . '-' . substr(bin2hex(random_bytes(2)), 0, 4) . '.json');
      $alte = glob(BACKUP . '/' . $basis . '-*.json') ?: [];
      sort($alte);
      foreach (array_slice($alte, 0, max(0, count($alte) - BACKUPS_BEHALTEN)) as $alt) { @unlink($alt); }
    }

    $daten['stand'] = date('c');
    $json = json_encode($daten, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) { throw new RuntimeException('Inhalt ließ sich nicht als JSON speichern.'); }
    $tmp = $pfad . '.tmp';
    if (file_put_contents($tmp, $json) === false || !rename($tmp, $pfad)) {
      @unlink($tmp);
      throw new RuntimeException('Speichern fehlgeschlagen – sind die Schreibrechte in daten/ gesetzt?');
    }
    @chmod($pfad, 0644);
  } finally {
    flock($sperre, LOCK_UN);
    fclose($sperre);
  }
}

// ── 6 · Upload-Pipeline ────────────────────────────────────────────────────
/** Gemeinsame Grundprüfung eines Uploads; wirft bei Problemen. */
function upload_grundpruefung(array $f, int $maxBytes, string $was): void {
  if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    throw new RuntimeException($was . ': Upload fehlgeschlagen (Code ' . (int)($f['error'] ?? -1) . ').');
  }
  $groesse = (int)($f['size'] ?? 0);
  if ($groesse <= 0 || $groesse > $maxBytes) {
    throw new RuntimeException($was . ': Datei ist leer oder größer als ' . round($maxBytes / 1048576) . ' MB.');
  }
  if (!is_uploaded_file($f['tmp_name'] ?? '')) {
    throw new RuntimeException($was . ': Ungültiger Upload.');
  }
}

/**
 * Lädt ein Bild aus einer Datei und dreht es – falls nötig – nach dem
 * EXIF-Wert gerade (Handy-Fotos liegen sonst auf der Seite). Gemeinsamer
 * Baustein für bild_verarbeiten() und bild_og_erzeugen(), damit die
 * Dreh-Logik nicht zweimal gepflegt werden muss und nicht auseinanderläuft.
 * Rückgabe: GD-Bild oder null.
 */
function bild_laden_gedreht(string $pfad, string $mime) {
  $img = match ($mime) {
    'image/jpeg' => @imagecreatefromjpeg($pfad),
    'image/png'  => @imagecreatefrompng($pfad),
    'image/webp' => @imagecreatefromwebp($pfad),
    default => null,
  };
  if (!$img) { return null; }
  if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
    $exif = @exif_read_data($pfad);
    $ori  = (int)($exif['Orientation'] ?? 1);
    if     ($ori === 3) { $img = imagerotate($img, 180, 0); }
    elseif ($ori === 6) { $img = imagerotate($img, -90, 0); }
    elseif ($ori === 8) { $img = imagerotate($img,  90, 0); }
  }
  return $img;
}

/**
 * Prüft und speichert ein Beitragsbild. Endung kommt aus dem echten Inhalt.
 * Mit GD wird das Bild auf max. 1600 px verkleinert und als WebP neu kodiert
 * (das entfernt zugleich alle Metadaten wie EXIF-Ortsangaben). Ohne GD wird
 * das streng geprüfte Original unverändert übernommen.
 * Rückgabe: ['datei' => relativer Pfad, 'breite' => int, 'hoehe' => int]
 */
function bild_verarbeiten(array $f, string $beitragId, string $token = ''): array {
  upload_grundpruefung($f, MAX_BILD, 'Bild');
  $namensbasis = $beitragId . ($token !== '' ? '-' . $token : '');

  $finfo = new finfo(FILEINFO_MIME_TYPE);
  $mime  = (string)$finfo->file($f['tmp_name']);
  if (!isset(BILD_TYPEN[$mime])) {
    throw new RuntimeException('Bild: Nur JPG, PNG oder WebP sind möglich (erkannt: ' . $mime . ').');
  }
  $info = @getimagesize($f['tmp_name']);
  if (!$info || $info[0] < 1 || $info[1] < 1 || $info[0] > 10000 || $info[1] > 10000) {
    throw new RuntimeException('Bild: Datei ist kein lesbares Bild.');
  }
  [$breite, $hoehe] = [$info[0], $info[1]];

  $kannGd = function_exists('imagewebp')
    && (($mime === 'image/jpeg' && function_exists('imagecreatefromjpeg'))
     || ($mime === 'image/png'  && function_exists('imagecreatefrompng'))
     || ($mime === 'image/webp' && function_exists('imagecreatefromwebp')));

  verzeichnisse_anlegen();

  if ($kannGd) {
    $img = bild_laden_gedreht($f['tmp_name'], $mime);
    if (!$img) { throw new RuntimeException('Bild ließ sich nicht verarbeiten.'); }
    [$breite, $hoehe] = [imagesx($img), imagesy($img)];   // nach evtl. EXIF-Drehung neu bestimmen

    if ($breite > BILD_MAX_BREITE) {
      $img = imagescale($img, BILD_MAX_BREITE);
      if (!$img) { throw new RuntimeException('Bild ließ sich nicht verkleinern.'); }
      [$breite, $hoehe] = [imagesx($img), imagesy($img)];
    }

    $relativ = 'daten/bilder/' . $namensbasis . '.webp';
    imagepalettetotruecolor($img);
    if (!imagewebp($img, WURZEL . '/' . $relativ, 82)) {
      throw new RuntimeException('Bild ließ sich nicht speichern – Schreibrechte in daten/bilder/ prüfen.');
    }
    imagedestroy($img);
  } else {
    // Ohne GD: streng geprüftes Original übernehmen (Endung aus finfo-MIME).
    $relativ = 'daten/bilder/' . $namensbasis . '.' . BILD_TYPEN[$mime];
    if (!move_uploaded_file($f['tmp_name'], WURZEL . '/' . $relativ)) {
      throw new RuntimeException('Bild ließ sich nicht speichern – Schreibrechte in daten/bilder/ prüfen.');
    }
  }
  @chmod(WURZEL . '/' . $relativ, 0644);
  return ['datei' => $relativ, 'breite' => $breite, 'hoehe' => $hoehe];
}

/**
 * Erzeugt aus einer hochgeladenen Bilddatei einen mittig zugeschnittenen
 * JPG-Ausschnitt in exakt 1200×630 Pixeln – für die Vorschau beim Teilen
 * (WhatsApp/LinkedIn lesen "og:image"). Bewusst JPG statt WebP: einige
 * Plattformen stellen WebP als Vorschaubild nicht zuverlässig dar (siehe
 * tools/og-image-bauen.py). Liest die Datei nur – verändert/verschiebt sie
 * NICHT –, damit bild_verarbeiten() sie danach noch normal verarbeiten kann.
 * Bricht NIE hart ab: Ohne GD oder bei einem Fehler wird null zurückgegeben;
 * die Beitragsseite lässt "og:image" dann einfach weg (Rückfall auf das
 * allgemeine Vorschaubild der Website).
 * Rückgabe: ['datei' => relativer Pfad, 'breite' => 1200, 'hoehe' => 630] oder null.
 */
function bild_og_erzeugen(string $tmpPfad, string $beitragId, string $token = ''): ?array {
  try {
    if ($tmpPfad === '' || !is_file($tmpPfad)) { return null; }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = (string)$finfo->file($tmpPfad);
    if (!isset(BILD_TYPEN[$mime])) { return null; }

    $kannGd = function_exists('imagejpeg')
      && (($mime === 'image/jpeg' && function_exists('imagecreatefromjpeg'))
       || ($mime === 'image/png'  && function_exists('imagecreatefrompng'))
       || ($mime === 'image/webp' && function_exists('imagecreatefromwebp')));
    if (!$kannGd) { return null; }

    $img = bild_laden_gedreht($tmpPfad, $mime);
    if (!$img) { return null; }
    $breite = imagesx($img); $hoehe = imagesy($img);
    if ($breite < 1 || $hoehe < 1) { imagedestroy($img); return null; }

    // Mittig auf das Zielverhältnis zuschneiden (überstehende Seiten kappen),
    // erst danach auf die Zielgröße skalieren – vermeidet Verzerrung.
    $zielVerhaeltnis = BILD_OG_BREITE / BILD_OG_HOEHE;
    if (($breite / $hoehe) > $zielVerhaeltnis) {
      $ausschnittBreite = (int)round($hoehe * $zielVerhaeltnis);
      $ausschnitt = ['x' => (int)round(($breite - $ausschnittBreite) / 2), 'y' => 0, 'width' => $ausschnittBreite, 'height' => $hoehe];
    } else {
      $ausschnittHoehe = (int)round($breite / $zielVerhaeltnis);
      $ausschnitt = ['x' => 0, 'y' => (int)round(($hoehe - $ausschnittHoehe) / 2), 'width' => $breite, 'height' => $ausschnittHoehe];
    }
    $zugeschnitten = function_exists('imagecrop') ? @imagecrop($img, $ausschnitt) : false;
    if (!$zugeschnitten) {
      // Fallback ohne imagecrop(): von Hand auf eine neue Leinwand kopieren.
      $zugeschnitten = imagecreatetruecolor($ausschnitt['width'], $ausschnitt['height']);
      imagecopy($zugeschnitten, $img, 0, 0, $ausschnitt['x'], $ausschnitt['y'], $ausschnitt['width'], $ausschnitt['height']);
    }
    imagedestroy($img);
    if (!$zugeschnitten) { return null; }

    $fertig = imagescale($zugeschnitten, BILD_OG_BREITE, BILD_OG_HOEHE);
    imagedestroy($zugeschnitten);
    if (!$fertig) { return null; }

    verzeichnisse_anlegen();
    $relativ = 'daten/bilder/' . $beitragId . ($token !== '' ? '-' . $token : '') . '-og.jpg';
    $ok = imagejpeg($fertig, WURZEL . '/' . $relativ, 88);
    imagedestroy($fertig);
    if (!$ok) { return null; }
    @chmod(WURZEL . '/' . $relativ, 0644);
    return ['datei' => $relativ, 'breite' => BILD_OG_BREITE, 'hoehe' => BILD_OG_HOEHE];
  } catch (Throwable $e) {
    return null;
  }
}

/** Prüft ein Mandanteninformation-PDF; wirft bei Problemen. */
function pdf_pruefen(array $f): void {
  upload_grundpruefung($f, MAX_PDF, 'PDF');
  $finfo = new finfo(FILEINFO_MIME_TYPE);
  if ($finfo->file($f['tmp_name']) !== 'application/pdf') {
    throw new RuntimeException('Bitte eine PDF-Datei hochladen.');
  }
  $fh = fopen($f['tmp_name'], 'rb');
  $kopf = $fh ? (string)fread($fh, 5) : '';
  if ($fh) { fclose($fh); }
  if ($kopf !== '%PDF-') {
    throw new RuntimeException('Die Datei ist kein gültiges PDF.');
  }
}

/**
 * Erkennt einen Abschnitt "Häufige Fragen"/"FAQ" im Beitragstext und liest
 * daraus Frage/Antwort-Paare der Form "**Frage?**\nAntwort …" (ein Absatz je
 * Paar, durch je eine Leerzeile getrennt). Eigene, bewusst einfache PHP-
 * Fassung – dieselbe Erkennung existiert nochmal in JS (assets/js/app.js),
 * weil PHP kein JS aufrufen kann; beide müssen unabhängig funktionieren.
 * Rückgabe: Liste von ['frage'=>string, 'antwort'=>string], ggf. leer.
 */
function php_faq_extrahieren(string $text): array {
  $bloecke = preg_split('/\n{2,}/', $text) ?: [];
  $inFaq = false;
  $ergebnis = [];
  foreach ($bloecke as $block) {
    $block = trim($block);
    if ($block === '') { continue; }
    if (preg_match('/^#{2,3}\s+(.*?)\s*(?:\{#[a-z0-9-]+\}\s*)?$/u', $block, $m)) {
      $inFaq = (bool)preg_match('/^(h[äa]ufige\s+fragen|faq)s?:?$/iu', trim($m[1]));
      continue;
    }
    if (!$inFaq) { continue; }
    if (preg_match('/^\*\*(.+?)\*\*\s*\n([\s\S]+)$/u', $block, $m)) {
      $ergebnis[] = ['frage' => trim($m[1]), 'antwort' => trim($m[2])];
    }
  }
  return $ergebnis;
}

/** JSON-LD sicher als <script>-Inhalt: verhindert, dass "</script>" im Text den Block vorzeitig beendet. */
function json_ld_sicher(array $daten): string {
  $json = json_encode($daten, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
  return str_replace('</', '<\/', $json !== false ? $json : '{}');
}

/**
 * Erzeugt/aktualisiert die eigene, crawlbare Seite eines Beitrags unter
 * daten/beitragsseiten/<slug>.html. Liest die Wurzel-index.html frisch als
 * eigene Vorlage (das Node-Werkzeug tools/seiten-generator.js läuft nur bei
 * einem Deploy, nicht wenn hier live gespeichert wird) und ersetzt dieselben
 * <head>-Stellen wie jenes Werkzeug: Title, Beschreibung, Canonical+Hreflang,
 * og:type/url/title/description sowie – NUR wenn ein eigenes Vorschaubild
 * vorhanden ist – den kompletten og:image-Block. Fügt davor zwei eigene
 * <script type="application/ld+json">-Blöcke ein (BlogPosting, bei erkannten
 * "Häufigen Fragen" zusätzlich FAQPage) – eigenständige Blöcke, nicht in den
 * Organisations-Graph gemischt (Konvention dieser Website). Der übrige
 * Seiteninhalt (Ladebildschirm) bleibt unverändert; die Darstellung übernimmt
 * wie bei jeder Adresse React im Browser – Crawler lesen ohnehin nur die
 * <head>-Metadaten aus, bevor JavaScript läuft.
 * Bricht nie hart ab: Schlägt das Schreiben fehl, bleibt der Beitrag trotzdem
 * ganz normal über /aktuelles erreichbar (nur ohne eigene Vorschau-Adresse).
 */
function beitragsseite_schreiben(array $eintrag): void {
  $slug = (string)($eintrag['slug'] ?? '');
  if ($slug === '' || !preg_match('/^[a-z0-9-]+$/', $slug)) { return; }

  $vorlage = @file_get_contents(WURZEL . '/index.html');
  if ($vorlage === false) { return; }

  $titel        = (string)($eintrag['titel'] ?? '');
  $titelSeite   = $titel !== '' ? $titel . ' | NSBB' : 'NSBB';
  $beschreibung = trim((string)($eintrag['teaser'] ?? ''));
  if ($beschreibung === '') {
    $beschreibung = trim(preg_replace('/\s+/u', ' ', (string)($eintrag['text'] ?? '')) ?? '');
    $beschreibung = mb_substr($beschreibung, 0, 155);
  }
  $adresse = 'https://nsbb.de/beitrag/' . $slug;
  $autor   = trim((string)($eintrag['autor'] ?? ''));

  $html = $vorlage;

  $html = str_replace(
    '<title>NSBB – Steuerberatung Berlin &amp; Köln | Modern. Digital. Persönlich.</title>',
    '<title>' . esc($titelSeite) . '</title>',
    $html
  );
  $html = str_replace(
    '<meta name="description" content="Wir begleiten Unternehmer, Unternehmen und Privatpersonen bei Wachstum, Strukturierung und steuerlichen Entscheidungen – von der laufenden Beratung bis zu komplexen nationalen und internationalen Fragestellungen."/>',
    '<meta name="description" content="' . esc($beschreibung) . '"/>',
    $html
  );
  $html = str_replace(
    '<link rel="canonical" href="https://nsbb.de/"/><link rel="alternate" hreflang="de" href="https://nsbb.de/"/><link rel="alternate" hreflang="en" href="https://nsbb.de/?lang=en"/><link rel="alternate" hreflang="x-default" href="https://nsbb.de/"/>',
    '<link rel="canonical" href="' . esc($adresse) . '"/><link rel="alternate" hreflang="de" href="' . esc($adresse) . '"/><link rel="alternate" hreflang="x-default" href="' . esc($adresse) . '"/>',
    $html
  );
  $html = str_replace(
    '<meta property="og:type" content="website"/><meta property="og:url" content="https://nsbb.de/"/><meta property="og:title" content="NSBB – Steuerberatung Berlin &amp; Köln | Modern. Digital. Persönlich."/>',
    '<meta property="og:type" content="article"/><meta property="og:url" content="' . esc($adresse) . '"/><meta property="og:title" content="' . esc($titel) . '"/>',
    $html
  );
  $html = str_replace(
    '<meta property="og:description" content="Wir begleiten Unternehmer, Unternehmen und Privatpersonen bei Wachstum, Strukturierung und steuerlichen Entscheidungen – von der laufenden Beratung bis zu komplexen nationalen und internationalen Fragestellungen."/>',
    '<meta property="og:description" content="' . esc($beschreibung) . '"/>',
    $html
  );

  $bildOg = $eintrag['bildOg'] ?? null;
  if (is_array($bildOg) && !empty($bildOg['datei'])) {
    $bildUrl = 'https://nsbb.de/' . ltrim((string)$bildOg['datei'], '/');
    $bildAlt = trim((string)($eintrag['bild']['alt'] ?? $titel));
    $html = str_replace(
      "<meta property=\"og:image\" content=\"https://nsbb.de/assets/images/og-image.jpg\"/>\n<meta property=\"og:image:width\" content=\"1200\"/>\n<meta property=\"og:image:height\" content=\"630\"/>\n<meta property=\"og:image:alt\" content=\"NSBB – Die Steuerberaterkanzlei · Berlin & Köln\"/>\n<meta name=\"twitter:image\" content=\"https://nsbb.de/assets/images/og-image.jpg\"/>",
      '<meta property="og:image" content="' . esc($bildUrl) . '"/>' . "\n" .
        '<meta property="og:image:width" content="' . (int)($bildOg['breite'] ?? BILD_OG_BREITE) . '"/>' . "\n" .
        '<meta property="og:image:height" content="' . (int)($bildOg['hoehe'] ?? BILD_OG_HOEHE) . '"/>' . "\n" .
        '<meta property="og:image:alt" content="' . esc($bildAlt) . '"/>' . "\n" .
        '<meta name="twitter:image" content="' . esc($bildUrl) . '"/>',
      $html
    );
  }

  // Eigene Strukturdaten: BlogPosting, referenziert die Kanzlei als Verlag;
  // Autor entweder eine Person (falls angegeben) oder ebenfalls die Kanzlei.
  $blogPosting = [
    '@context' => 'https://schema.org',
    '@type' => 'BlogPosting',
    'headline' => $titel,
    'description' => $beschreibung,
    'datePublished' => (string)($eintrag['datum'] ?? ''),
    'dateModified' => (string)($eintrag['datum'] ?? ''),
    'author' => $autor !== ''
      ? ['@type' => 'Person', 'name' => $autor, 'worksFor' => ['@id' => 'https://nsbb.de/#kanzlei']]
      : ['@id' => 'https://nsbb.de/#kanzlei'],
    'publisher' => ['@id' => 'https://nsbb.de/#kanzlei'],
    'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $adresse],
  ];
  if (is_array($bildOg) && !empty($bildOg['datei'])) {
    $blogPosting['image'] = 'https://nsbb.de/' . ltrim((string)$bildOg['datei'], '/');
  }
  $skripte = '<script type="application/ld+json">' . json_ld_sicher($blogPosting) . '</script>' . "\n";

  $faqs = php_faq_extrahieren((string)($eintrag['text'] ?? ''));
  if ($faqs) {
    $faqPage = [
      '@context' => 'https://schema.org',
      '@type' => 'FAQPage',
      'mainEntity' => array_map(fn($f) => [
        '@type' => 'Question',
        'name' => $f['frage'],
        'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['antwort']],
      ], $faqs),
    ];
    $skripte .= '<script type="application/ld+json">' . json_ld_sicher($faqPage) . '</script>' . "\n";
  }

  $html = str_replace('<link rel="icon"', $skripte . '<link rel="icon"', $html);

  verzeichnisse_anlegen();
  $pfad = BEITRAGSSEITEN . '/' . $slug . '.html';
  $tmp  = $pfad . '.tmp';
  if (file_put_contents($tmp, $html) !== false) {
    @rename($tmp, $pfad);
    @chmod($pfad, 0644);
  } else {
    @unlink($tmp);
  }
}

/**
 * Schreibt daten/beitraege-sitemap.xml komplett neu – eine eigene, kleine
 * Sitemap NUR für Beiträge. Bewusst getrennt von der Haupt-sitemap.xml: die
 * gehört dem Node-Werkzeug (tools/seiten-generator.js) und wird bei jedem
 * Deploy vollständig überschrieben – hier eingetragene Beiträge gingen darin
 * sonst verloren.
 */
function beitraege_sitemap_schreiben(array $alleBeitraege): void {
  verzeichnisse_anlegen();
  $zeilen = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  foreach ($alleBeitraege as $b) {
    $slug = (string)($b['slug'] ?? '');
    if ($slug === '') { continue; }
    $datum = (string)($b['datum'] ?? '');
    $zeilen[] = '  <url>';
    $zeilen[] = '    <loc>https://nsbb.de/beitrag/' . esc($slug) . '</loc>';
    if ($datum !== '') { $zeilen[] = '    <lastmod>' . esc($datum) . '</lastmod>'; }
    $zeilen[] = '  </url>';
  }
  $zeilen[] = '</urlset>';
  $xml = implode("\n", $zeilen) . "\n";

  $pfad = DATEN . '/beitraege-sitemap.xml';
  $tmp  = $pfad . '.tmp';
  if (file_put_contents($tmp, $xml) !== false) {
    @rename($tmp, $pfad);
    @chmod($pfad, 0644);
  } else {
    @unlink($tmp);
  }
}

// ── 7 · Aktionen (POST → Weiterleitung, damit F5 nichts doppelt sendet) ────
verzeichnisse_anlegen();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {

  // Upload größer als post_max_size: PHP liefert dann LEERE $_POST/$_FILES.
  if (empty($_POST) && empty($_FILES)) {
    flash_setzen('fehler', 'Die Datei ist größer, als der Server annimmt (post_max_size = ' . ini_get('post_max_size') . '). Bitte eine kleinere Datei wählen.');
    zurueck();
  }
  csrf_pruefen();

  $aktion = (string)($_POST['aktion'] ?? '');
  try {
    switch ($aktion) {

      case 'beitrag_speichern': {
        $id      = trim((string)($_POST['id'] ?? ''));
        $neu     = ($id === '');
        if ($neu) { $id = 'b-' . date('Ymd-His') . '-' . substr(bin2hex(random_bytes(2)), 0, 4); }
        if (!preg_match('/^b-[\w-]+$/', $id)) { throw new RuntimeException('Ungültige Beitragsnummer.'); }

        $titel          = trim((string)($_POST['titel'] ?? ''));
        $kategorie      = trim((string)($_POST['kategorie'] ?? ''));
        $teaser         = trim((string)($_POST['teaser'] ?? ''));
        $text           = trim(str_replace("\r\n", "\n", (string)($_POST['text'] ?? '')));
        $datum          = trim((string)($_POST['datum'] ?? ''));
        $alt            = trim((string)($_POST['bild_alt'] ?? ''));
        $entfernen      = !empty($_POST['bild_entfernen']);
        $autor          = trim((string)($_POST['autor'] ?? ''));
        $adresseEingabe = trim((string)($_POST['adresse'] ?? ''));

        if ($titel === '' || mb_strlen($titel) > 200)  { throw new RuntimeException('Bitte einen Titel angeben (max. 200 Zeichen).'); }
        if ($text  === '' || mb_strlen($text) > 20000) { throw new RuntimeException('Bitte einen Beitragstext angeben (max. 20.000 Zeichen).'); }
        if (mb_strlen($teaser) > 500)                  { throw new RuntimeException('Der Teaser ist zu lang (max. 500 Zeichen).'); }
        if (mb_strlen($alt) > 300)                     { throw new RuntimeException('Die Bildbeschreibung ist zu lang (max. 300 Zeichen).'); }
        if (mb_strlen($autor) > 120)                   { throw new RuntimeException('Der Autorenname ist zu lang (max. 120 Zeichen).'); }
        if (mb_strlen($adresseEingabe) > 200)          { throw new RuntimeException('Die Adresse ist zu lang (max. 200 Zeichen).'); }
        if (!in_array($kategorie, KATEGORIEN, true))   { $kategorie = ''; }
        $d = $datum !== '' ? $datum : date('Y-m-d');
        if (!preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $d, $t) || !checkdate((int)$t[2], (int)$t[3], (int)$t[1])) {
          throw new RuntimeException('Das Datum ist ungültig (Format JJJJ-MM-TT).');
        }

        // Neues Bild? (UPLOAD_ERR_NO_FILE = Feld leer gelassen). Das eigene
        // Vorschaubild fürs Teilen zuerst erzeugen (liest die Datei nur, ohne
        // sie zu verschieben) – bild_verarbeiten() darf danach noch normal
        // darauf zugreifen (dessen GD-lose Rückfallebene verschiebt die Datei).
        $neuesBild   = null;
        $neuesBildOg = null;
        if (isset($_FILES['bild']) && ($_FILES['bild']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
          if ($alt === '') { throw new RuntimeException('Bitte eine kurze Bildbeschreibung angeben (für Vorlesesoftware und wenn das Bild nicht lädt).'); }
          // Eindeutiges Kürzel je Upload: Ein ersetztes Bild bekommt einen NEUEN
          // Dateinamen – so zeigt kein Browser und kein Social-Media-Cache mehr
          // das alte Bild (analog zu den Mandanteninfo-PDFs, die auch pro Upload
          // einen neuen Dateinamen erhalten).
          $bildToken   = date('ymdHis') . substr(bin2hex(random_bytes(2)), 0, 4);
          $neuesBildOg = bild_og_erzeugen((string)($_FILES['bild']['tmp_name'] ?? ''), $id, $bildToken);
          $neuesBild   = bild_verarbeiten($_FILES['bild'], $id, $bildToken);
          $neuesBild['alt'] = $alt;
        }

        // Von der Sperre umschlossene Änderung liefert nur $daten zurück –
        // die zusätzlich benötigten Werte (Slug, fertiger Eintrag, Gesamtliste
        // für die Sitemap) holen wir per Referenz aus der Closure heraus.
        $slugNeu = '';
        $slugAlt = '';
        $eintragFuerSeite  = null;
        $alleNachSpeichern = [];

        manifest_aendern(DATEN . '/beitraege.json', 'beitraege', function (array $daten) use (
          $id, $neu, $titel, $kategorie, $teaser, $text, $d, $alt, $entfernen, $neuesBild,
          $autor, $adresseEingabe, $neuesBildOg,
          &$slugNeu, &$slugAlt, &$eintragFuerSeite, &$alleNachSpeichern
        ) {
          $liste = $daten['beitraege'];
          $alter = null;
          foreach ($liste as $i => $b) { if (($b['id'] ?? '') === $id) { $alter = $i; break; } }
          if ($neu && $alter !== null) { throw new RuntimeException('Nummernkonflikt – bitte erneut speichern.'); }
          if (!$neu && $alter === null) { throw new RuntimeException('Der Beitrag wurde nicht gefunden (zwischenzeitlich gelöscht?).'); }

          $bild   = (!$neu && isset($liste[$alter]['bild']))   ? $liste[$alter]['bild']   : null;
          $bildOg = (!$neu && isset($liste[$alter]['bildOg'])) ? $liste[$alter]['bildOg'] : null;
          if ($entfernen && $bild) {
            datei_loeschen_sicher($bild['datei'] ?? null);
            datei_loeschen_sicher($bildOg['datei'] ?? null);
            $bild = null; $bildOg = null;
          }
          if ($neuesBild) {
            if ($bild   && ($bild['datei'] ?? '')   !== $neuesBild['datei'])                  { datei_loeschen_sicher($bild['datei'] ?? null); }
            if ($bildOg && (!$neuesBildOg || ($bildOg['datei'] ?? '') !== $neuesBildOg['datei'])) { datei_loeschen_sicher($bildOg['datei'] ?? null); }
            $bild   = $neuesBild;
            $bildOg = $neuesBildOg;
          } elseif ($bild && $alt !== '') {
            $bild['alt'] = $alt;    // Nur die Beschreibung eines vorhandenen Bildes ändern
          }

          $slugAlt = (string)($liste[$alter]['slug'] ?? '');
          $andereSlugs = [];
          foreach ($liste as $i => $b) { if ($i !== $alter) { $andereSlugs[] = (string)($b['slug'] ?? ''); } }
          $slug = slug_erzeugen($adresseEingabe !== '' ? $adresseEingabe : $titel, $andereSlugs);

          $eintrag = ['id' => $id, 'titel' => $titel, 'kategorie' => $kategorie, 'teaser' => $teaser,
                      'text' => $text, 'datum' => $d, 'bild' => $bild, 'bildOg' => $bildOg,
                      'slug' => $slug, 'autor' => $autor];
          if ($neu) { array_unshift($liste, $eintrag); } else { $liste[$alter] = $eintrag; }
          usort($liste, fn($a, $b) => strcmp((string)($b['datum'] ?? ''), (string)($a['datum'] ?? '')));
          $daten['beitraege'] = $liste;

          $slugNeu = $slug;
          $eintragFuerSeite = $eintrag;
          $alleNachSpeichern = $liste;
          return $daten;
        });

        // Beitragsseite + eigene Sitemap AUSSERHALB der Sperre schreiben:
        // reine Bild-/Datei-Operationen, die die Sperrdatei (die sich auch
        // Mandanteninfo-Speichervorgänge teilen) nicht unnötig blockieren
        // sollen. JSON ist zu diesem Zeitpunkt bereits konsistent gespeichert.
        if ($slugAlt !== '' && $slugAlt !== $slugNeu) {
          datei_loeschen_sicher('daten/beitragsseiten/' . $slugAlt . '.html');
        }
        if ($eintragFuerSeite) { beitragsseite_schreiben($eintragFuerSeite); }
        beitraege_sitemap_schreiben($alleNachSpeichern);

        flash_setzen('ok', $neu ? 'Der Beitrag ist angelegt und sofort online.' : 'Der Beitrag ist aktualisiert.');
        zurueck();
      }

      case 'beitrag_loeschen': {
        $id = trim((string)($_POST['id'] ?? ''));
        $slugGeloescht    = '';
        $alleNachLoeschen = [];
        manifest_aendern(DATEN . '/beitraege.json', 'beitraege', function (array $daten) use ($id, &$slugGeloescht, &$alleNachLoeschen) {
          $daten['beitraege'] = array_values(array_filter($daten['beitraege'], function ($b) use ($id, &$slugGeloescht) {
            if (($b['id'] ?? '') === $id) {
              datei_loeschen_sicher($b['bild']['datei'] ?? null);
              datei_loeschen_sicher($b['bildOg']['datei'] ?? null);
              $slugGeloescht = (string)($b['slug'] ?? '');
              return false;
            }
            return true;
          }));
          $alleNachLoeschen = $daten['beitraege'];
          return $daten;
        });
        if ($slugGeloescht !== '') { datei_loeschen_sicher('daten/beitragsseiten/' . $slugGeloescht . '.html'); }
        beitraege_sitemap_schreiben($alleNachLoeschen);
        flash_setzen('ok', 'Der Beitrag ist gelöscht.');
        zurueck();
      }

      case 'mi_hochladen': {
        $monat = (int)($_POST['monat'] ?? 0);
        $jahr  = (int)($_POST['jahr'] ?? 0);
        $titel = trim((string)($_POST['titel'] ?? ''));
        if ($monat < 1 || $monat > 12 || $jahr < 2020 || $jahr > 2100) { throw new RuntimeException('Bitte Monat und Jahr wählen.'); }
        if (mb_strlen($titel) > 200) { throw new RuntimeException('Der Titel ist zu lang (max. 200 Zeichen).'); }
        if (!isset($_FILES['pdf'])) { throw new RuntimeException('Bitte eine PDF-Datei auswählen.'); }
        pdf_pruefen($_FILES['pdf']);
        if ($titel === '') { $titel = 'Mandanteninformation ' . MONATE[$monat] . ' ' . $jahr; }

        // Eindeutiger Dateiname (Zeitstempel): Ein erneuter Upload desselben
        // Monats bekommt eine NEUE Adresse – kein Browser zeigt alte Inhalte.
        $relativ = sprintf('daten/mandanteninfo/mandanteninformation-%04d-%02d-%d.pdf', $jahr, $monat, time());
        if (!move_uploaded_file($_FILES['pdf']['tmp_name'], WURZEL . '/' . $relativ)) {
          throw new RuntimeException('PDF ließ sich nicht speichern – Schreibrechte in daten/mandanteninfo/ prüfen.');
        }
        @chmod(WURZEL . '/' . $relativ, 0644);
        $groesse = (int)filesize(WURZEL . '/' . $relativ);

        try {
          manifest_aendern(DATEN . '/mandanteninfo.json', 'ausgaben', function (array $daten) use ($monat, $jahr, $titel, $relativ, $groesse) {
            $liste = array_values(array_filter($daten['ausgaben'], function ($a) use ($monat, $jahr) {
              if ((int)($a['jahr'] ?? 0) === $jahr && (int)($a['monat'] ?? 0) === $monat) {
                datei_loeschen_sicher($a['datei'] ?? null);   // alte Datei desselben Monats ersetzen
                return false;
              }
              return true;
            }));
            $liste[] = ['id' => sprintf('mi-%04d-%02d', $jahr, $monat), 'jahr' => $jahr, 'monat' => $monat,
                        'titel' => $titel, 'datei' => $relativ, 'groesseBytes' => $groesse, 'hochgeladen' => date('c')];
            usort($liste, fn($a, $b) => (($b['jahr'] <=> $a['jahr']) ?: ($b['monat'] <=> $a['monat'])));
            $daten['ausgaben'] = $liste;
            return $daten;
          });
        } catch (Throwable $t) {
          datei_loeschen_sicher($relativ);   // Manifest scheiterte → keine Datei-Leiche
          throw $t;
        }
        flash_setzen('ok', $titel . ' ist online.');
        zurueck();
      }

      case 'mi_loeschen': {
        $id = trim((string)($_POST['id'] ?? ''));
        manifest_aendern(DATEN . '/mandanteninfo.json', 'ausgaben', function (array $daten) use ($id) {
          $daten['ausgaben'] = array_values(array_filter($daten['ausgaben'], function ($a) use ($id) {
            if (($a['id'] ?? '') === $id) { datei_loeschen_sicher($a['datei'] ?? null); return false; }
            return true;
          }));
          return $daten;
        });
        flash_setzen('ok', 'Die Ausgabe ist gelöscht.');
        zurueck();
      }

      default:
        throw new RuntimeException('Unbekannte Aktion.');
    }
  } catch (RuntimeException $ex) {
    flash_setzen('fehler', $ex->getMessage());
    zurueck();
  } catch (Throwable $ex) {
    flash_setzen('fehler', 'Unerwarteter Fehler. Bitte erneut versuchen; besteht das Problem, die Projektleitung informieren.');
    zurueck();
  }
}

// ── 8 · Ansichten (GET) ────────────────────────────────────────────────────
$beitraege = manifest_lesen(DATEN . '/beitraege.json', 'beitraege')['beitraege'];
$ausgaben  = manifest_lesen(DATEN . '/mandanteninfo.json', 'ausgaben')['ausgaben'];
$ansicht   = (string)($_GET['ansicht'] ?? 'uebersicht');
$flash     = flash_holen();

$bearbeiten = null;
if ($ansicht === 'beitrag') {
  $gesucht = (string)($_GET['id'] ?? '');
  foreach ($beitraege as $b) { if (($b['id'] ?? '') === $gesucht) { $bearbeiten = $b; break; } }
}

function datum_anzeige(string $iso): string {
  if (!preg_match('/^(\d{4})-(\d{2})-(\d{2})/', $iso, $m)) { return $iso; }
  return (int)$m[3] . '. ' . MONATE[(int)$m[2]] . ' ' . $m[1];
}

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
?><!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>NSBB Redaktion</title>
<!-- Nur für die Titelbild-Vorschau (Canvas) – die Bedienoberfläche selbst
     bleibt in der System-Schrift. Die relativen Pfade in fonts.css lösen von
     /redaktion/ aus korrekt nach ../assets/fonts/ auf. -->
<link rel="stylesheet" href="../assets/css/fonts.css?v=20260724d">
<style>
  :root { --gruen:#4A7C59; --papier:#F7F6F3; --rand:#E2DDD8; --tinte:#1A1917; --grau:#6B6358; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--papier); color:var(--tinte); font:15px/1.6 -apple-system, system-ui, 'Segoe UI', sans-serif; }
  .kopf { background:#fff; border-bottom:1px solid var(--rand); padding:14px 20px; display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; }
  .kopf strong { font-family:Georgia, serif; font-size:20px; color:var(--gruen); letter-spacing:.02em; }
  .kopf span { font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:var(--grau); }
  .kopf a { margin-left:auto; font-size:13px; color:var(--gruen); }
  main { max-width:860px; margin:0 auto; padding:24px 20px 60px; }
  h2 { font-family:Georgia, serif; font-weight:500; font-size:24px; margin:34px 0 6px; }
  h2:first-child { margin-top:6px; }
  .hinweis { font-size:13px; color:var(--grau); margin:0 0 16px; }
  .karte { background:#fff; border:1px solid var(--rand); border-radius:14px; padding:20px; margin-bottom:14px; }
  .meldung { border-radius:12px; padding:12px 16px; margin:0 0 18px; font-size:14px; }
  .meldung.ok { background:#E6EFE9; border:1px solid #BCD4C5; color:#2C4A38; }
  .meldung.fehler { background:#F7E8E4; border:1px solid #E0BBB0; color:#7A3B2A; }
  label { display:block; font-size:12px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--grau); margin:14px 0 4px; }
  input[type=text], input[type=date], input[type=number], select, textarea {
    width:100%; padding:10px 12px; border:1.5px solid var(--rand); border-radius:10px;
    font:inherit; background:#fff; }
  textarea { resize:vertical; }
  input[type=file] { font-size:13px; margin-top:4px; }
  .zeile { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media (max-width:640px){ .zeile { grid-template-columns:1fr; } }
  .knopf { display:inline-block; background:var(--gruen); color:#fff; border:none; border-radius:999px;
    padding:10px 22px; font:inherit; font-size:14px; font-weight:600; cursor:pointer; text-decoration:none; }
  .knopf.leise { background:#fff; color:var(--grau); border:1.5px solid var(--rand); font-weight:500; }
  .knopf.klein { padding:6px 14px; font-size:13px; }
  .knopf.rot { background:#fff; color:#A04030; border:1.5px solid #E0BBB0; }
  .werkzeugleiste { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:6px; }
  .werkzeugleiste button { border:1.5px solid var(--rand); background:#fff; border-radius:8px; padding:6px 10px; font:inherit; font-size:13px; cursor:pointer; color:var(--tinte); }
  .werkzeugleiste button:hover { border-color:var(--gruen); color:var(--gruen); }
  .bildgen { margin:6px 0 4px; }
  .bildgen .schalter { display:inline-flex; align-items:center; gap:8px; text-transform:none; letter-spacing:0; font-weight:400; margin:0; cursor:pointer; }
  #bg-canvas { max-width:520px; }
  .liste { list-style:none; margin:0; padding:0; }
  .liste li { display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:12px 0; border-top:1px solid var(--rand); }
  .liste li:first-child { border-top:none; }
  .liste .titel { flex:1 1 260px; min-width:200px; }
  .liste .meta { font-size:12px; color:var(--grau); }
  .fuss { max-width:860px; margin:0 auto; padding:0 20px 40px; font-size:12px; color:var(--grau); }
  form.inline { display:inline; }
  .bildvorschau { height:64px; border-radius:8px; display:block; margin-top:6px; }
</style>
</head>
<body>
<div class="kopf">
  <strong>NSBB</strong> <span>Redaktion</span>
  <a href="../aktuelles" target="_blank" rel="noopener">Seite „Aktuelles" ansehen ↗</a>
</div>
<main>
<?php if ($flash): ?>
  <div class="meldung <?= esc($flash['typ']) ?>"><?= esc($flash['text']) ?></div>
<?php endif; ?>

<?php if ($ansicht === 'beitrag'): /* ── Formular: Beitrag neu / bearbeiten ── */ ?>

  <h2><?= $bearbeiten ? 'Beitrag bearbeiten' : 'Neuen Beitrag anlegen' ?></h2>
  <p class="hinweis">Pflichtfelder: Titel und Text. Der Beitragstext versteht Markdown-Formatierung (Symbolleiste unten). Der Beitrag ist nach dem Speichern sofort online.</p>
  <div class="karte">
    <form method="post" enctype="multipart/form-data">
      <?= csrf_feld() ?>
      <input type="hidden" name="aktion" value="beitrag_speichern">
      <input type="hidden" name="id" value="<?= esc($bearbeiten['id'] ?? '') ?>">
      <div class="zeile">
        <div>
          <label for="f-titel">Titel *</label>
          <input id="f-titel" type="text" name="titel" required maxlength="200" value="<?= esc($bearbeiten['titel'] ?? '') ?>">
        </div>
        <div>
          <label for="f-kat">Kategorie</label>
          <select id="f-kat" name="kategorie">
            <option value="">– keine –</option>
            <?php foreach (KATEGORIEN as $k): ?>
              <option value="<?= esc($k) ?>" <?= (($bearbeiten['kategorie'] ?? '') === $k) ? 'selected' : '' ?>><?= esc($k) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>
      <div class="zeile">
        <div>
          <label for="f-adresse">Adresse (URL)</label>
          <input id="f-adresse" type="text" name="adresse" maxlength="200"
                 placeholder="wird automatisch aus dem Titel gebildet"
                 value="<?= esc($bearbeiten['slug'] ?? '') ?>">
          <p class="hinweis" style="margin:4px 0 0;">Ändert sich die Adresse, funktionieren zuvor geteilte Links auf die alte Adresse nicht mehr.</p>
        </div>
        <div>
          <label for="f-autor">Autor (optional)</label>
          <input id="f-autor" type="text" name="autor" maxlength="120"
                 placeholder="z. B. Maximilian Siebert, M.Sc."
                 value="<?= esc($bearbeiten['autor'] ?? '') ?>">
        </div>
      </div>
      <div class="zeile">
        <div>
          <label for="f-datum">Datum</label>
          <input id="f-datum" type="date" name="datum" value="<?= esc($bearbeiten['datum'] ?? date('Y-m-d')) ?>">
        </div>
        <div>
          <label for="f-bild">Bild (JPG/PNG/WebP, max. 5 MB<?= $bearbeiten && !empty($bearbeiten['bild']) ? ', ersetzt das vorhandene' : '' ?>)</label>
          <input id="f-bild" type="file" name="bild" accept="image/jpeg,image/png,image/webp">
          <?php if ($bearbeiten && !empty($bearbeiten['bild']['datei'])): ?>
            <img class="bildvorschau" src="../<?= esc($bearbeiten['bild']['datei']) ?>" alt="Aktuelles Beitragsbild">
            <label style="display:inline-flex;align-items:center;gap:6px;text-transform:none;letter-spacing:0;font-weight:400;">
              <input type="checkbox" name="bild_entfernen" value="1" style="width:auto;"> Bild entfernen
            </label>
          <?php endif; ?>
        </div>
      </div>
      <div class="bildgen">
        <label class="schalter">
          <input type="checkbox" id="bg-an" style="width:auto;"> Titelbild automatisch aus Titel + Kategorie erzeugen
        </label>
        <div id="bg-box" hidden>
          <p class="hinweis" style="margin:8px 0 6px;">Live-Vorschau – wird beim Speichern als Beitragsbild übernommen (ein separat gewähltes Bild wird dann ignoriert). Format 1200×630, passend fürs Teilen.</p>
          <label for="bg-unter">Untertitel fürs Bild (optional)</label>
          <input id="bg-unter" type="text" maxlength="80" placeholder="z. B. Was Unternehmen jetzt wissen müssen">
          <canvas id="bg-canvas" width="2400" height="1260" style="width:100%;height:auto;border:1px solid var(--rand);border-radius:10px;margin-top:8px;display:block;background:#eef3f1;"></canvas>
        </div>
      </div>
      <label for="f-alt">Bildbeschreibung <?= $bearbeiten && !empty($bearbeiten['bild']) ? '' : '(Pflicht, sobald ein Bild gewählt ist)' ?></label>
      <input id="f-alt" type="text" name="bild_alt" maxlength="300" placeholder="Was ist auf dem Bild zu sehen? Ein kurzer Satz."
             value="<?= esc($bearbeiten['bild']['alt'] ?? '') ?>">
      <label for="f-teaser">Teaser (Kurztext für die Übersicht, 1–3 Sätze)</label>
      <textarea id="f-teaser" name="teaser" rows="2" maxlength="500"><?= esc($bearbeiten['teaser'] ?? '') ?></textarea>
      <label for="f-text">Beitragstext *</label>
      <p class="hinweis" style="margin:0 0 6px;">Formatierung mit Markdown: Überschriften, Listen, <strong>fett</strong>/<em>kursiv</em>, Links und Tabellen. Ein Inhaltsverzeichnis entsteht automatisch aus den Überschriften. Ein Abschnitt „Häufige Fragen" mit <code>**Frage?**</code> je Absatz erzeugt automatisch FAQ-Daten für Suchmaschinen.</p>
      <div class="werkzeugleiste">
        <button type="button" onclick="mdUeberschrift(2)">H2</button>
        <button type="button" onclick="mdUeberschrift(3)">H3</button>
        <button type="button" onclick="mdFett()"><strong>F</strong></button>
        <button type="button" onclick="mdKursiv()"><em>K</em></button>
        <button type="button" onclick="mdListe(false)">Liste</button>
        <button type="button" onclick="mdListe(true)">1. Liste</button>
        <button type="button" onclick="mdLink()">Link</button>
        <button type="button" onclick="mdTabelle()">Tabelle</button>
        <button type="button" onclick="mdTrennlinie()">—</button>
      </div>
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:6px;">
        <input type="file" id="md-datei" accept=".md,.markdown,.txt,text/markdown,text/plain" style="display:none;">
        <button type="button" class="knopf leise klein" onclick="document.getElementById('md-datei').click()">Markdown-Datei laden …</button>
        <span class="hinweis" style="margin:0;">Lädt den Inhalt einer <code>.md</code>-Datei ins Textfeld. Ein SEO-Kommentarkopf und ein manuelles Inhaltsverzeichnis werden entfernt; die erste Überschrift wird als Titel übernommen.</span>
      </div>
      <textarea id="f-text" name="text" rows="14" required><?= esc($bearbeiten['text'] ?? '') ?></textarea>
      <p style="margin:18px 0 0; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="knopf" type="submit"><?= $bearbeiten ? 'Änderungen speichern' : 'Beitrag veröffentlichen' ?></button>
        <a class="knopf leise" href="<?= esc($_SERVER['SCRIPT_NAME']) ?>">Abbrechen</a>
      </p>
    </form>
  </div>

<?php else: /* ── Übersicht ── */ ?>

  <h2>Mandanteninformationen</h2>
  <p class="hinweis">Die neueste Ausgabe erscheint auf der Website oben als Button, ältere wandern automatisch ins Archiv. Ein erneuter Upload desselben Monats ersetzt die bisherige Datei.</p>
  <div class="karte">
    <form method="post" enctype="multipart/form-data">
      <?= csrf_feld() ?>
      <input type="hidden" name="aktion" value="mi_hochladen">
      <div class="zeile">
        <div>
          <label for="m-monat">Monat</label>
          <select id="m-monat" name="monat">
            <?php foreach (MONATE as $nr => $name): ?>
              <option value="<?= $nr ?>" <?= $nr === (int)date('n') ? 'selected' : '' ?>><?= esc($name) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div>
          <label for="m-jahr">Jahr</label>
          <input id="m-jahr" type="number" name="jahr" min="2020" max="2100" step="1" value="<?= (int)date('Y') ?>">
        </div>
      </div>
      <label for="m-titel">Titel (leer lassen für „Mandanteninformation Monat Jahr")</label>
      <input id="m-titel" type="text" name="titel" maxlength="200" placeholder="Mandanteninformation <?= esc(MONATE[(int)date('n')]) ?> <?= (int)date('Y') ?>">
      <label for="m-pdf">PDF-Datei (max. 15 MB)</label>
      <input id="m-pdf" type="file" name="pdf" accept="application/pdf" required>
      <p style="margin:18px 0 0;"><button class="knopf" type="submit">Hochladen &amp; veröffentlichen</button></p>
    </form>
  </div>
  <?php if ($ausgaben): ?>
  <div class="karte">
    <ul class="liste">
      <?php foreach ($ausgaben as $a): ?>
      <li>
        <span class="titel"><?= esc($a['titel'] ?? '') ?><br>
          <span class="meta"><?= esc(sprintf('%s %d · %.1f MB', MONATE[(int)($a['monat'] ?? 1)] ?? '', (int)($a['jahr'] ?? 0), max(((int)($a['groesseBytes'] ?? 0)) / 1048576, 0.1))) ?></span>
        </span>
        <a class="knopf leise klein" href="../<?= esc($a['datei'] ?? '') ?>" target="_blank" rel="noopener">Ansehen</a>
        <form class="inline" method="post" onsubmit="return confirm('Diese Ausgabe wirklich löschen?');">
          <?= csrf_feld() ?>
          <input type="hidden" name="aktion" value="mi_loeschen">
          <input type="hidden" name="id" value="<?= esc($a['id'] ?? '') ?>">
          <button class="knopf rot klein" type="submit">Löschen</button>
        </form>
      </li>
      <?php endforeach; ?>
    </ul>
  </div>
  <?php endif; ?>

  <h2>Beiträge</h2>
  <p class="hinweis">Beiträge erscheinen auf der Website unter „Aktuelles", neueste zuerst. Bitte nicht zu zweit gleichzeitig arbeiten – es gilt der zuletzt gespeicherte Stand.</p>
  <p><a class="knopf" href="?ansicht=beitrag">+ Neuer Beitrag</a></p>
  <?php if ($beitraege): ?>
  <div class="karte">
    <ul class="liste">
      <?php foreach ($beitraege as $b): $bSlug = (string)($b['slug'] ?? ''); ?>
      <li>
        <span class="titel"><?= esc($b['titel'] ?? '') ?><br>
          <span class="meta"><?= esc(datum_anzeige((string)($b['datum'] ?? ''))) ?><?= !empty($b['kategorie']) ? ' · ' . esc($b['kategorie']) : '' ?><?= !empty($b['bild']) ? ' · mit Bild' : '' ?></span>
        </span>
        <a class="knopf leise klein" href="<?= $bSlug !== '' ? '../beitrag/' . rawurlencode($bSlug) : '../aktuelles#beitrag-' . rawurlencode((string)($b['id'] ?? '')) ?>" target="_blank" rel="noopener">Ansehen</a>
        <a class="knopf leise klein" href="?ansicht=beitrag&amp;id=<?= rawurlencode((string)($b['id'] ?? '')) ?>">Bearbeiten</a>
        <form class="inline" method="post" onsubmit="return confirm('Diesen Beitrag wirklich löschen?');">
          <?= csrf_feld() ?>
          <input type="hidden" name="aktion" value="beitrag_loeschen">
          <input type="hidden" name="id" value="<?= esc($b['id'] ?? '') ?>">
          <button class="knopf rot klein" type="submit">Löschen</button>
        </form>
      </li>
      <?php endforeach; ?>
    </ul>
  </div>
  <?php else: ?>
  <div class="karte"><p class="hinweis" style="margin:0;">Noch keine Beiträge. Mit „+ Neuer Beitrag" den ersten anlegen.</p></div>
  <?php endif; ?>

<?php endif; ?>
</main>
<div class="fuss">
  <?php
    $gd = function_exists('imagewebp');
    printf('Systemcheck: PHP %s · Bildverkleinerung (GD/WebP): %s · Upload-Grenzen: %s / %s · daten/ beschreibbar: %s',
      esc(PHP_VERSION),
      $gd ? 'aktiv' : 'nicht verfügbar – Bilder werden unverändert übernommen',
      esc((string)ini_get('upload_max_filesize')), esc((string)ini_get('post_max_size')),
      is_writable(DATEN) ? 'ja' : 'NEIN – bitte Projektleitung informieren');
  ?>
</div>
<script>
(function () {
  function feld() { return document.getElementById('f-text'); }
  function einfuegen(vorher, nachher, platzhalter) {
    var f = feld();
    if (!f) { return; }
    var anfang = f.selectionStart, ende = f.selectionEnd;
    var ausgewaehlt = f.value.slice(anfang, ende) || (platzhalter || '');
    f.setRangeText(vorher + ausgewaehlt + nachher, anfang, ende, 'end');
    f.focus();
  }
  window.mdUeberschrift = function (ebene) { einfuegen('#'.repeat(ebene) + ' ', '', 'Überschrift'); };
  window.mdFett         = function () { einfuegen('**', '**', 'fett'); };
  window.mdKursiv       = function () { einfuegen('*', '*', 'kursiv'); };
  window.mdListe        = function (nummeriert) { einfuegen(nummeriert ? '1. ' : '- ', '', 'Eintrag'); };
  window.mdTrennlinie   = function () { einfuegen('\n---\n', '', ''); };
  window.mdLink = function () {
    var url = window.prompt('Adresse (z. B. https://nsbb.de/kontakt oder /kontakt):', 'https://');
    if (!url) { return; }
    einfuegen('[', '](' + url + ')', 'Linktext');
  };
  window.mdTabelle = function () {
    einfuegen('\n| Spalte 1 | Spalte 2 |\n|---|---|\n| Zelle | Zelle |\n', '', '');
  };

  // Markdown-Datei laden: Inhalt ins Textfeld übernehmen. Ein führender
  // HTML-Kommentar (SEO-Meta-Kopf) und ein manuell geschriebenes „## Inhalt"
  // werden entfernt (das Inhaltsverzeichnis entsteht automatisch); die erste
  // Überschrift wandert – wenn das Titelfeld leer ist – in den Titel.
  (function () {
    var inp = document.getElementById('md-datei');
    if (!inp) { return; }
    inp.addEventListener('change', function () {
      var f = inp.files && inp.files[0];
      if (!f) { return; }
      var leser = new FileReader();
      leser.onload = function () {
        var txt = String(leser.result || '').replace(/\r\n/g, '\n');
        txt = txt.replace(/^\uFEFF/, '').replace(/^\s*<!--[\s\S]*?-->\s*/, '');
        var titelFeld = document.getElementById('f-titel');
        var mH1 = /^#\s+(.+?)\s*$/m.exec(txt);
        if (mH1) {
          if (titelFeld && !titelFeld.value.trim()) { titelFeld.value = mH1[1].trim(); }
          txt = txt.replace(mH1[0], '');
        }
        txt = txt.replace(/##\s+Inhalt\b[\s\S]*?\n-{3,}\s*\n/, '');
        txt = txt.replace(/^\s+/, '');
        var ta = document.getElementById('f-text');
        if (!ta) { return; }
        if (ta.value.trim() && !window.confirm('Der vorhandene Beitragstext wird ersetzt. Fortfahren?')) { inp.value = ''; return; }
        ta.value = txt;
        inp.value = '';
      };
      leser.readAsText(f, 'utf-8');
    });
  })();
})();
</script>
<script>
/* Titelbild-Generator: zeichnet aus Titel + Kategorie (+ optionalem Untertitel)
   ein markenkonformes 1200×630-Bild auf ein <canvas>. Beim Speichern wird das
   Bild als PNG in das Datei-Feld gelegt und läuft danach durch dieselbe
   Upload-Strecke wie ein hochgeladenes Bild (WebP-Anzeige + OG-Vorschaubild).
   Kein externer Dienst; die Schriften liegen lokal (fonts.css). */
(function () {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) { return; }                       // nur in der Beitrags-Ansicht
  var an      = document.getElementById('bg-an');
  var box     = document.getElementById('bg-box');
  var elTitel = document.getElementById('f-titel');
  var elKat   = document.getElementById('f-kat');
  var elUnter = document.getElementById('bg-unter');
  var elBild  = document.getElementById('f-bild');
  var elAlt   = document.getElementById('f-alt');
  var form    = elTitel ? elTitel.form : null;
  var x = canvas.getContext('2d');
  x.scale(2, 2);                                  // 2× für scharfe Kanten
  var ACC = '#4A7C59', INK = '#23221F', MUT = '#6B6358', SUB = '#A39D95', MINT = '#98D0C6';
  var SERIF = "'Cormorant Garamond', Georgia, serif";
  var SANS  = "'DM Sans', system-ui, sans-serif";

  // Echtes Logo (dunkle Fassung fürs helle Titelbild) vorab laden – gleicher
  // Ursprung, daher bleibt der Canvas „sauber" und toBlob() funktioniert.
  var logo = new Image(); var logoBereit = false;
  logo.onload = function () { logoBereit = true; if (an.checked) { zeichne(); } };
  logo.src = '../assets/images/logo-nav.webp';

  function rr(a, b, w, h, r) { x.beginPath(); x.moveTo(a+r,b); x.arcTo(a+w,b,a+w,b+h,r); x.arcTo(a+w,b+h,a,b+h,r); x.arcTo(a,b+h,a,b,r); x.arcTo(a,b,a+w,b,r); x.closePath(); }
  function ls(v) { if ('letterSpacing' in x) { x.letterSpacing = v; } }
  function fit(t, maxW, maxL) {
    for (var fs = 86; fs >= 40; fs -= 2) {
      x.font = '500 ' + fs + 'px ' + SERIF;
      var ws = t.split(/\s+/), ln = [], cur = '';
      for (var i = 0; i < ws.length; i++) { var tr = cur ? cur + ' ' + ws[i] : ws[i]; if (x.measureText(tr).width > maxW && cur) { ln.push(cur); cur = ws[i]; } else { cur = tr; } }
      if (cur) { ln.push(cur); }
      var ok = ln.length <= maxL; for (var j = 0; j < ln.length; j++) { if (x.measureText(ln[j]).width > maxW) { ok = false; } }
      if (ok) { return { fs: fs, ln: ln }; }
    }
    return { fs: 40, ln: [t] };
  }
  function wrap(t, cx, cy, maxW, lh) { var ws = t.split(/\s+/), cur = '', yy = cy; for (var i = 0; i < ws.length; i++) { var tr = cur ? cur + ' ' + ws[i] : ws[i]; if (x.measureText(tr).width > maxW && cur) { x.fillText(cur, cx, yy); cur = ws[i]; yy += lh; } else { cur = tr; } } if (cur) { x.fillText(cur, cx, yy); } }

  function zeichne() {
    var titel = (elTitel && elTitel.value || 'Titel des Beitrags').trim();
    var kat   = (elKat && elKat.value || 'AKTUELLES').toUpperCase();
    var unter = (elUnter && elUnter.value || '').trim();
    x.clearRect(0, 0, 1200, 630);
    // Hero-Verlauf der Website (warm → Mint).
    var g = x.createLinearGradient(0, 0, 1200, 630);
    g.addColorStop(0, '#F7F6F3'); g.addColorStop(0.5, '#F0EEE9'); g.addColorStop(1, '#EAF0EC');
    x.fillStyle = g; x.fillRect(0, 0, 1200, 630);
    // Dezente Mint-Kugel rechts + feiner Ring + kleiner Akzentpunkt.
    x.fillStyle = 'rgba(152,208,198,0.22)'; x.beginPath(); x.arc(1140, 150, 300, 0, 7); x.fill();
    x.strokeStyle = 'rgba(74,124,89,0.10)'; x.lineWidth = 2; x.beginPath(); x.arc(1140, 150, 300, 0, 7); x.stroke();
    x.fillStyle = 'rgba(74,124,89,0.14)'; x.beginPath(); x.arc(150, 545, 5, 0, 7); x.fill();
    // Kategorie-Label: grüne Kapitälchen (wie .label auf der Website).
    ls('3px'); x.font = '600 18px ' + SANS; x.fillStyle = ACC; x.textBaseline = 'alphabetic'; x.fillText(kat, 92, 120); ls('0px');
    // Titel in Cormorant Garamond; letzte Zeile grün, wenn mehrzeilig (wie der Hero).
    var ft = fit(titel, 620, 3); x.font = '500 ' + ft.fs + 'px ' + SERIF;
    var lh = ft.fs * 1.12, ty = 168 + ft.fs;
    for (var k = 0; k < ft.ln.length; k++) { x.fillStyle = (ft.ln.length >= 2 && k === ft.ln.length - 1) ? ACC : INK; x.fillText(ft.ln[k], 90, ty + k*lh); }
    var tb = ty + (ft.ln.length - 1)*lh;
    // Kurzer grüner Trennstrich (wie .divider).
    x.fillStyle = ACC; rr(92, tb + 30, 50, 4, 2); x.fill();
    if (unter) { x.fillStyle = MUT; x.font = '400 24px ' + SANS; wrap(unter, 92, tb + 78, 600, 33); }
    // Echtes Logo unten links (Rückfall: Wortmarke, falls das Bild noch lädt).
    if (logoBereit) {
      var lho = 60, lwo = lho * ((logo.naturalWidth / logo.naturalHeight) || (240 / 112));
      x.drawImage(logo, 90, 590 - lho, lwo, lho);
    } else {
      x.fillStyle = INK; x.font = '600 30px ' + SERIF; x.fillText('NSBB', 90, 580);
    }
  }

  function umschalten() {
    box.hidden = !an.checked;
    if (elBild) { elBild.disabled = an.checked; elBild.style.opacity = an.checked ? '.5' : ''; }
    if (an.checked) { zeichne(); }
  }
  an.addEventListener('change', umschalten);
  [elTitel, elKat, elUnter].forEach(function (el) { if (el) { el.addEventListener('input', function () { if (an.checked) { zeichne(); } }); } });

  // Nach dem Laden der lokalen Schriften (Cormorant + DM Sans) neu zeichnen –
  // sonst würde zunächst mit der System-Schrift gezeichnet.
  if (document.fonts && document.fonts.load) {
    try {
      Promise.all([
        document.fonts.load("500 60px 'Cormorant Garamond'"),
        document.fonts.load("600 18px 'DM Sans'")
      ]).then(function () { if (an.checked) { zeichne(); } }, function () {});
    } catch (e) {}
  }

  // Beim Absenden das gezeichnete Bild als PNG ins Datei-Feld legen.
  if (form) {
    form.addEventListener('submit', function (ev) {
      if (!an.checked || form.dataset.bggen === '1') { return; }
      ev.preventDefault();
      zeichne();
      canvas.toBlob(function (blob) {
        try {
          if (blob && elBild) {
            var dt = new DataTransfer();
            dt.items.add(new File([blob], 'titelbild.png', { type: 'image/png' }));
            elBild.disabled = false;
            elBild.files = dt.files;
          }
          if (elAlt && !elAlt.value.trim()) { elAlt.value = 'Titelbild zum Beitrag „' + (elTitel.value || '').trim() + '“'; }
        } catch (e) {}
        form.dataset.bggen = '1';
        form.submit();
      }, 'image/png');
    });
  }
})();
</script>
</body>
</html>
