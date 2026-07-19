# Prompt für Claude Code

**An den Kunden:** Öffnen Sie Claude Code in diesem Projektordner und fügen Sie
den kompletten Text unterhalb der Linie als erste Nachricht ein. Danach können
Sie ganz normal beschreiben, was Sie geändert haben möchten – zum Beispiel
*„Ändere auf der Startseite die Überschrift zu …"* oder *„Tausche das Foto von
Frau Richrath gegen das neue aus."*

---

Du arbeitest am Projektordner der NSBB-Website (Steuerberatung Berlin & Köln).

## Was dieser Ordner ist

Dies ist eine **fertig optimierte, ausgelieferte Fassung** – kein Rohentwurf und
keine Baustelle. Die Website wurde am 17.07.2026 technisch überarbeitet: Der
frühere 1-MB-Monolith wurde in eine saubere Dateistruktur aufgeteilt, die
Schriften von Google auf lokale Auslieferung umgestellt, die Bilder auf WebP
umgestellt und eine Server-Konfiguration für All-Inkl ergänzt. Erstaufruf
vorher ca. 1,1 MB, jetzt 311 KB.

**Lies als Erstes `changelog.md`**, insbesondere den Abschnitt „Offene Punkte".
Dort steht, was bewusst so ist und was noch aussteht. Ohne diesen Kontext wirst
du Dinge „reparieren", die Absicht sind.

## Deine Aufgabe

Der Kunde möchte **inhaltliche Änderungen** vornehmen: Texte, Fotos,
Ansprechpartner, Stellenanzeigen. Setze genau das um – nicht mehr.

Der Ordner geht anschließend als ZIP zurück an die Projektleitung und wird dort
per Git mit deren parallelem Arbeitsstand **zusammengeführt**. Das ist der Grund
für die Regeln unten: Je gezielter deine Änderungen, desto sauberer der Merge.
Großflächige Umbauten machen das Zusammenführen unmöglich und werden verworfen.

## Wo was liegt

| Was | Wo |
|---|---|
| **Alle Texte und Inhalte** (DE + EN), alle Seiten, die Logik | `assets/js/app.js` |
| Aussehen / Layout | `assets/css/style.css` |
| Ausgelieferte Bilder (WebP) | `assets/images/` |
| Bild-Originale (JPG/PNG) | `_source/images/` |
| React-Laufzeit (Fremdbibliothek) | `assets/js/vendor/react-bundle.js` |
| Serverkonfiguration | `.htaccess` |

Die Website ist eine React-18-Single-Page-Application. Der Code ist bewusst in
`React.createElement`-Schreibweise ohne Build-Schritt geschrieben – die Dateien
laufen so, wie sie sind, direkt auf dem Server.

## Feste Regeln

**1. Nicht umbauen.**
`app.js` ist groß und die Schreibweise ist altmodisch. Das ist bekannt und
bewusst. **Refaktoriere nicht, formatiere nicht um, teile keine Dateien auf,
führe kein Build-System, kein JSX, kein Framework und keinen Paketmanager ein.**
Auch nicht „nur schnell nebenbei". Solche Änderungen erzeugen tausende
Diff-Zeilen und machen das Zusammenführen mit der Projektleitung unmöglich.
Ändere ausschließlich die Stellen, um die es inhaltlich geht.

**2. `assets/js/vendor/react-bundle.js` nicht anfassen.** Fremdbibliothek.

**3. Keine externen Dienste einbinden.**
Die Seite lädt im Normalbetrieb von **keinem fremden Server** nach. Schriften und
React liegen absichtlich lokal. **Binde keine Google Fonts, kein CDN, keine
Bibliothek per `<script src="https://…">`, keine Analytics und keine Tracker
ein.** Das ist nicht nur eine Performance-, sondern eine Datenschutzentscheidung:
Eine Steuerberatungskanzlei darf die IP-Adressen ihrer Besucher nicht ohne
Einwilligung in die USA übertragen. Wenn etwas Externes nötig scheint: melden,
nicht einbauen.

**4. Nach jeder Änderung an `assets/js/app.js`:**

```bash
node --check assets/js/app.js
```

Ein einziger Syntaxfehler legt die **komplette** Website lahm – alle Seiten
stecken in dieser Datei. Prüfe das, bevor du fertig meldest.

**5. Nach jeder Änderung an `app.js`, `style.css` oder `fonts.css`:
Versionsnummer erhöhen.**
In der `index.html` stehen Verweise mit `?v=20260717`. Der Server liefert diese
Dateien mit einem Jahr Cache aus. Wer die Nummer nicht hochzählt, dessen Änderung
sieht bei wiederkehrenden Besuchern bis zu ein Jahr lang niemand. Setze überall
dasselbe neue Datum ein, z. B. `?v=20260801`.

**6. Bilder: immer als WebP nach `assets/images/`.**
Ein neues Foto gehört als Original nach `_source/images/` **und** als WebP nach
`assets/images/`:

```bash
cwebp -q 82 -metadata none _source/images/team-neu.jpg -o assets/images/team-neu.webp
```

Steht `cwebp` nicht zur Verfügung, sag dem Kunden, dass er die Datei über einen
Online-Konverter nach WebP wandeln soll. **Stelle die Referenzen in `app.js`
nicht auf JPG/PNG zurück.**

**7. Jede Änderung in `changelog.md` eintragen.**
Oben, nach der Vorlage am Dateiende: Datum, dass Claude Code sie gemacht hat,
was, warum, und wie du geprüft hast, dass nichts kaputt ist. Das ist keine
Formalie – der Ordner wandert zwischen mehreren Beteiligten ohne gemeinsame
Versionsverwaltung. Was nicht im Changelog steht, ist für alle anderen
unsichtbar und geht beim Zusammenführen verloren.

**8. Nichts löschen:** `_source/`, `changelog.md`, `README.md`, `.htaccess`,
`robots.txt`, `sitemap.xml`, `tools/`. Auch wenn sie für die Website selbst
nicht nötig scheinen.

**9. Die bekannten offenen Punkte nicht eigenmächtig angehen.**
In `changelog.md` stehen zehn davon – unter anderem, dass das Kontaktformular
nichts verschickt und ein Passwort im Klartext im Code steht. Die sind erfasst
und liegen bei der Projektleitung. **Fass sie nicht ohne ausdrücklichen Auftrag
an**, sonst kollidieren deine Änderungen mit deren Arbeit. Weist der Kunde dich
ausdrücklich darauf an: umsetzen, aber im Changelog deutlich vermerken.

## Testen

```bash
python3 -m http.server 8080
# im Browser: http://localhost:8080
```

Die `.htaccess` wirkt dabei nicht (dafür bräuchte es einen Apache) – für
inhaltliche Prüfungen reicht es. Sieh dir die geänderte Seite tatsächlich an,
statt nur den Code zu prüfen.

## Wenn du fertig bist

Fasse dem Kunden zusammen: was geändert wurde, in welchen Dateien, ob die
Versionsnummer erhöht wurde und ob der Changelog-Eintrag steht. Sag ihm, dass er
den **kompletten Ordner unverändert in der Struktur** wieder als ZIP an die
Projektleitung schickt.

Wenn dir etwas auffällt, das über den Auftrag hinausgeht: **melde es, statt es zu
beheben.** Ein Hinweis ist wertvoll, ein ungefragter Eingriff kostet die
Projektleitung beim Zusammenführen Zeit.
