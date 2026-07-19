# Changelog – NSBB Website

Diese Datei ist das **verbindliche Protokoll aller Änderungen** an diesem Projekt.

> **Jede Änderung wird hier eingetragen – ausnahmslos.**
> Das gilt für Änderungen von Hand, durch Claude, durch andere KI-Assistenten
> und Agenten, durch Cloud-Dienste und durch jedes andere Werkzeug.
> Der Projektordner wandert per ZIP zwischen mehreren Beteiligten hin und her.
> Es gibt keine Versionsverwaltung, die Änderungen automatisch nachhält – diese
> Datei ist die einzige gemeinsame Quelle der Wahrheit. Ein nicht eingetragener
> Eingriff ist für alle anderen unsichtbar und geht beim nächsten Zusammenführen
> verloren.

Format: neueste Einträge oben. Aufbau eines Eintrags siehe Vorlage am Ende.

---

## [2026-07-17] Einstiegs-Prompt und Leitplanken für den Kunden

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Projektleitung
**Grund:** Der Kunde bearbeitet den Ordner mit seiner eigenen Claude-Code-Instanz
und schickt ihn zurück. Ohne Vorgaben besteht das reale Risiko, dass ein KI-Agent
die 457 KB große `app.js` in `React.createElement`-Schreibweise für
Aufräumbedarf hält und refaktoriert – das erzeugt tausende Diff-Zeilen und macht
den Merge unmöglich. Zweites Risiko: „hilfreiches" Wiedereinbinden von Google
Fonts oder einem CDN, was Performance und Datenschutz zunichtemacht.
**Keine inhaltliche Änderung an der Website.**

### Neu

* **`PROMPT-FUER-CLAUDE.md`** – der Text, den der Kunde zusammen mit dem ZIP
  bekommt und in Claude Code einfügt. Selbsttragend, funktioniert auch mit
  anderen Werkzeugen.
* **`CLAUDE.md`** – dieselben Leitplanken in Kurzform. Claude Code lädt diese
  Datei **automatisch**, ohne Zutun des Kunden. Damit greifen die Regeln auch
  dann, wenn er den Prompt nicht einfügt. Bewusst redundant zum Prompt: zwei
  Einstiegswege, eine Aussage.

### Inhalt der Leitplanken

Kein Refactoring, kein Build-System, keine externen Dienste,
`react-bundle.js` unantastbar, `node --check` nach jeder `app.js`-Änderung,
`?v=` hochzählen, Bilder als WebP, Changelog-Pflicht, offene Punkte nicht
eigenmächtig angehen, Auffälligkeiten melden statt beheben.

### Angepasst

* `README.md` – Struktur um die zwei neuen Dateien ergänzt.
* `robots.txt` – `/tools/`, `CLAUDE.md`, `PROMPT-FUER-CLAUDE.md` ergänzt.
  (Wirkt nur ergänzend; die `.htaccess` sperrt `*.md` ohnehin serverseitig.)

### Geprüft

* Beide Dateien landen im Kunden-ZIP (`tools/zip-fuer-kunden.sh` schließt nur
  `.git/` und `tools/` aus) und sind über den Webserver nicht abrufbar –
  die `.htaccess`-Regel für `*.md` greift.

---

## [2026-07-17] Git-Repository eingerichtet

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Projektleitung
**Grund:** Der Ordner wandert per ZIP zwischen Projektleitung und Kunde. Ohne
Versionsverwaltung lassen sich zwei parallel bearbeitete Stände nicht
zusammenführen – wer zuletzt kopiert, überschreibt den anderen stillschweigend.
**Keine inhaltliche Änderung an der Website.**

### Angelegt

* Git-Repository im Projektordner, Branch `main`.
* Identität **nur lokal für dieses Repo** gesetzt (`everbrave` /
  `tools@everbrave.io`) – die globale Git-Konfiguration wurde nicht angefasst.
  Änderbar mit `git config user.name "..."`.
* `.gitignore` für `.DS_Store`, Editor-Dateien, ZIPs, Backups.

### Historie: zwei Commits

| Commit | Inhalt |
|---|---|
| `f8de9ff` | **Ausgangsstand des Kunden** – aus dem Backup rekonstruiert |
| `13aab52` | Die Umbauten vom 2026-07-17 (siehe Eintrag unten) |

Der Ausgangsstand wurde bewusst als eigener erster Commit angelegt, damit die
Umstellung als Diff nachvollziehbar bleibt. Die `index.html` aus `f8de9ff` hat
exakt die protokollierte SHA-256
`29b5607a0238a7267c8c48035e5f404e8fefece749d8e780d6a18c1152dc2e70` – der
Kundenstand ist also bitgenau aus Git wiederherstellbar
(`git show f8de9ff:index.html`).

### Versand-Tags: der Kern des Rückwegs

Beim Versand ans ZIP wird ein Tag `versand/JJJJ-MM-TT` gesetzt (aktuell
`versand/2026-07-17`). Es hält fest, **auf welchem Stand der Kunde aufsetzt**.
Kommt seine Fassung zurück, wird sie auf genau diesem Tag als Branch
`kunde/JJJJ-MM-TT` eingespielt – erst dadurch kann Git seine Änderungen von
unseren unterscheiden und beides zusammenführen, statt eines zu überschreiben.

> ⚠️ **Versand-Tags nicht löschen**, solange der zugehörige Stand beim Kunden
> liegt. Ohne das Tag ist die Rücklieferung nur ein Haufen Dateien.

### Werkzeuge (neu, `tools/`)

* `tools/zip-fuer-kunden.sh` – prüft auf uncommittete Reste, setzt das
  Versand-Tag, baut das ZIP (ohne `.git` und `tools/`).
* `tools/kundenstand-importieren.sh` – legt die Rücklieferung als Branch auf dem
  Versand-Tag an und zeigt, was der Kunde geändert hat.

Beide getestet: Ein simulierter Durchlauf (ZIP erzeugen → Kundenänderung an
`app.js` → importieren → mergen) führte die Änderung korrekt mit einer parallelen
eigenen Änderung zusammen, ohne Datenverlust.

### Wichtig: Der Changelog bleibt Pflicht

Git ersetzt diese Datei **nicht**. Es protokolliert nur unsere eigene Seite.
Kunde, andere Agenturen und KI-Werkzeuge arbeiten ohne Git – ihre Arbeit
erscheint in der Historie als ein einziger „Stand des Kunden"-Commit ohne
Begründung. Das *Warum* steht nirgends außer hier.

---

## [2026-07-17] Aufteilung in Dateistruktur, Performance- und Serververbereitung

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Projektleitung
**Ausgangsstand:** `index.html` (1.056.924 Bytes, 22.541 Zeilen), SHA-256
`29b5607a0238a7267c8c48035e5f404e8fefece749d8e780d6a18c1152dc2e70`
**Ziel:** Auslieferbare, performante Struktur für den All-Inkl-Webspace.
**Inhaltlich unverändert** – kein Text, kein Layout, keine Funktion angefasst.

### Struktur: Monolith aufgeteilt

Die gesamte Website steckte in einer einzigen `index.html`. Sie ist jetzt
aufgeteilt, ohne dass sich am Code selbst etwas geändert hat – die Blöcke wurden
1:1 in eigene Dateien verschoben:

| Neue Datei | Inhalt | Größe |
|---|---|---|
| `index.html` | nur noch Head, Ladebildschirm, Verweise | 4 KB (vorher 1.031 KB) |
| `assets/js/vendor/react-bundle.js` | eingebettete React-18-Laufzeit | 558 KB |
| `assets/js/app.js` | die Anwendung (alle Seiten, Texte, Logik) | 457 KB |
| `assets/css/style.css` | Stylesheet | 15 KB |

Beide JS-Dateien wurden mit `node --check` auf Syntaxfehler geprüft.

**Warum das mehr ist als Kosmetik:** Vorher musste der Browser bei jedem
Seitenaufruf 1 MB HTML neu laden, weil HTML nicht dauerhaft gecacht werden darf.
Jetzt lädt er einmalig die JS-Dateien und danach nur noch 4 KB HTML. Zusätzlich
erlaubt erst diese Trennung eine strenge Content-Security-Policy ohne
`script-src 'unsafe-inline'` (siehe unten) – bei Inline-Code ist das unmöglich.

### Schriften: von Google Fonts auf lokale Auslieferung

* Cormorant Garamond und DM Sans werden nicht mehr von `fonts.googleapis.com`
  geladen, sondern liegen als woff2 unter `assets/fonts/`.
* Erzeugt: `assets/css/fonts.css` mit lokalen Pfaden. Die Preconnect-Verweise
  auf Google wurden entfernt.
* Nur die Subsets **latin** und **latin-ext** – Kyrillisch, Griechisch und
  Vietnamesisch brauchen wir für DE/EN nicht.
* Beide sind **Variable Fonts**: Google liefert für die Gewichte 300/400/500/600
  physisch dieselbe Datei aus. Statt 20 Dateien à 840 KB liegen deshalb 6 Dateien
  à 248 KB im Ordner, angesprochen über Gewichtsbereiche (`font-weight: 300 600`).
  Ein deutscher Besucher lädt real nur die zwei Latin-Schnitte, ca. 98 KB.
* Die beiden sofort sichtbaren Schnitte werden per `<link rel="preload">`
  vorgeladen.
* **Zweiter Effekt, rechtlich:** Die Einbindung über Google übertrug bei jedem
  Aufruf die IP-Adresse des Besuchers an Google in die USA – ohne Einwilligung.
  Das entfällt damit. Lizenz der Schriften: SIL Open Font License 1.1, lokale
  Auslieferung ausdrücklich erlaubt.

### Bilder: WebP statt JPG/PNG

* Alle acht Bilder zusätzlich als WebP erzeugt (`cwebp`, Qualität 82 für Fotos,
  90 für die Logos): **245 KB → 141 KB, 43 % weniger** bei gleicher Optik.
* Die acht Referenzen in `app.js` zeigen jetzt auf `.webp`.
* **Kein `<picture>`-Fallback** – bewusst: Jeder Browser, der diese Seite
  überhaupt darstellen kann, versteht WebP. Die Seite setzt bereits
  `backdrop-filter` und `IntersectionObserver` voraus, und beide werden von
  *weniger* Browsern unterstützt als WebP (ab Chrome 32, Firefox 65, Safari 14).
  Ein Fallback würde also nur Komplexität ohne Nutzen bringen.
* Die Originale liegen unverändert in **`_source/images/`** (siehe README:
  „Bilder austauschen").

### Server: `.htaccess` für All-Inkl (neu)

Getestet gegen ein lokales Apache 2.4 mit derselben Modulausstattung – nicht nur
geschrieben, sondern gemessen:

* **Kompression** (brotli + gzip) für HTML/CSS/JS. Der Haupteffekt:
  `react-bundle.js` 571 KB → **103 KB**, `app.js` 468 KB → **103 KB** über die
  Leitung. woff2/webp bleiben ausgenommen, sie sind bereits komprimiert.
* **Caching:** CSS/JS/Fonts/Bilder 1 Jahr `immutable`, `index.html` `no-cache`.
* **Sicherheits-Header:** `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy` und eine **Content-Security-Policy**.
  Die CSP wurde im Browser gegengeprüft: Startseite und Kontaktseite laden
  fehlerfrei, die Google-Maps-iframes funktionieren (`frame-src`).
* **HTTPS- und www-Weiterleitung** auf `https://www.nsbb.de` (passend zum
  `canonical`-Tag). ⚠️ Erst nach eingerichtetem SSL-Zertifikat aktivieren.
* **HSTS** ist auskommentiert vorbereitet – bewusst nicht aktiv, weil ein zu früh
  gesetzter HSTS-Header beim Besucher nicht zurückgenommen werden kann.
* **Zugriffsschutz** für `*.md`, `_source/`, Punktdateien; Verzeichnislisting aus.

### Cache-Versionierung

CSS und JS werden in der `index.html` mit `?v=20260717` referenziert. Nur dadurch
ist der Ein-Jahres-Cache gefahrlos.

> ⚠️ **Nach jeder Änderung an `app.js`, `style.css`, `fonts.css` oder
> `react-bundle.js` muss die Versionsnummer in der `index.html` erhöht werden.**
> Sonst sehen wiederkehrende Besucher bis zu ein Jahr lang die alte Fassung.

### Kleinere Ergänzungen

* `<noscript>`-Hinweis mit Telefonnummern und E-Mail. Vorher sah ein Besucher
  ohne JavaScript nur einen endlos drehenden Ladekreis.
* `robots.txt` neu.
* `sitemap.xml` neu – enthält bewusst nur eine URL, siehe „Offene Punkte".
* Skripte laden mit `defer`: Reihenfolge bleibt garantiert, das Rendern wird
  nicht blockiert.

### Ergebnis

| | vorher | nachher |
|---|---|---|
| Erstaufruf Startseite, übertragen | ca. 1,1 MB (unkomprimiert, + Google-Fonts-Roundtrip) | **311 KB** |
| Folgeaufruf | erneut ca. 1 MB HTML | **~2 KB** (Rest aus dem Cache) |
| Anfragen an fremde Server | Google Fonts | **keine** (außer Maps nach Klick) |

### Geprüft

* `node --check` auf beide JS-Dateien: fehlerfrei.
* Im Browser: Startseite, „Über uns", Kontakt – Rendering, Navigation,
  Sprachumschalter-Button, Schriften, Logos, Team- und Standortbilder
  (inkl. Lazy Loading), Maps-iframes. **Keine Konsolenfehler.**
* Header, Kompression und Zugriffsschutz gegen lokales Apache verifiziert.
* Backup des Ausgangsstands inkl. SHA-256-Prüfsumme wurde vor dem ersten
  Eingriff angelegt.

---

## Offene Punkte

Nicht angefasst – teils außerhalb des Auftrags („bleibt 1:1"), teils weil eine
Entscheidung nötig ist. Nach Dringlichkeit:

1. **Admin-Passwort steht im Klartext im Quelltext.**
   `assets/js/app.js`, **Zeile 2958** (Insights-Seite): `adminPass === 'Holzmarkt2/2a'`.
   Für jeden per „Quelltext anzeigen" lesbar. Da es an eine Büroadresse angelehnt
   ist: auch anderswo ändern, wo es verwendet wird. Ein Login lässt sich im
   Browser grundsätzlich nicht absichern – das muss serverseitig laufen.

2. **Das Kontaktformular verschickt nichts.**
   Es baut einen `mailto:`-Link (`app.js` **Zeile 3311**) und meldet nach 800 ms
   „Vielen Dank", unabhängig vom Erfolg. Wer Web-Mail statt eines Mailprogramms
   nutzt, löst damit gar nichts aus – die Anfrage geht verloren, ohne dass es
   jemand merkt. Braucht einen echten serverseitigen Endpunkt.

3. **`contact.php` fehlt.** Das Karriereformular postet dorthin (`app.js`
   **Zeile 4302**), die Datei existiert im Projekt nicht. Solange sie auf dem
   Server fehlt, läuft jede Bewerbung in den Fehlerzweig. Außerdem: kein
   Datei-Upload für den Lebenslauf.

4. **Cookie-Banner ohne Ablehnen-Option.** Nur „Akzeptieren", und er steuert
   technisch nichts. Nach der Font-Umstellung lädt beim Aufruf nichts
   Einwilligungspflichtiges mehr – einzig Google Maps auf der Kontaktseite.
   Sauberste Lösung: Maps als Zwei-Klick-Lösung (Vorschaubild, Karte erst nach
   aktivem Klick), dann ist der Banner verzichtbar. Juristische Abnahme
   empfohlen.

5. **Datenschutzerklärung nennt Google Maps nicht.** Aufgeführt ist nur All-Inkl
   als Hoster. Google Fonts und der CDN sind mit dieser Sitzung erledigt, Maps
   bleibt offen.

6. **Alle rund 40 Unterseiten teilen sich eine URL** (Hash-Routing), der
   `canonical` zeigt überall auf `https://www.nsbb.de`. Google indexiert
   Hash-Fragmente nicht – die Themenseiten (Wegzugsbesteuerung, DBA, Branchen …)
   können nicht ranken. Das ist der größte Hebel für die Sichtbarkeit und der
   Grund, warum die `sitemap.xml` nur einen Eintrag hat. Lösung wäre echtes
   Rendering (z. B. Astro) – ein eigenes Projekt.

7. **`hreflang` verweist auf `?lang=en`**, aber der Parameter wird nirgends
   ausgelesen; die Sprache startet immer auf DE. Das Signal an Google geht ins
   Leere.

8. **Kein `og:image`.** Geteilte Links (LinkedIn, WhatsApp) zeigen keine
   Vorschau. Braucht ein Bild in 1200×630.

9. **`aria-expanded` fehlt** an den aufklappbaren Menüs und Akkordeons; das
   mobile Menü hat keinen Fokus-Trap. Relevant seit dem BFSG (Juni 2025).

10. **Anfragenummer per LocalStorage** (`app.js` **Zeile 3232**) zählt pro
    Besucher-Browser, nicht pro Kanzlei – zwei Interessenten senden beide
    „Anfrage #1".

---

## Vorlage für neue Einträge

```markdown
## [JJJJ-MM-TT] Kurztitel

**Bearbeiter:** Name / Werkzeug (Mensch, KI-Assistent, Cloud-Dienst …)
**Grund:** Warum war die Änderung nötig?

### Geändert
* `pfad/zur/datei` – was und warum

### Geprüft
* Wie wurde sichergestellt, dass nichts kaputt ist?

### Offen / Achtung
* Was der oder die Nächste wissen muss.
```
