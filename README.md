# NSBB Website – Projektordner

---

## ⚠️ Zuerst lesen: Änderungen gehören in die `changelog.md`

**Jede Änderung an diesem Projekt wird in [`changelog.md`](changelog.md)
eingetragen – ausnahmslos und unabhängig davon, wer sie vornimmt:**

* von **Hand** (Entwickler, Agentur, Kunde),
* durch **Claude** oder einen anderen **KI-Assistenten / KI-Agenten**,
* durch ein **Cloud-Programm**, einen Website-Baukasten oder ein sonstiges
  automatisches Werkzeug.

**Warum das nicht verhandelbar ist:** Dieser Ordner wandert als ZIP zwischen
mehreren Beteiligten hin und her. Es gibt keine Versionsverwaltung, die
Änderungen automatisch nachhält, und keinen Weg, zwei Bearbeitungsstände
maschinell zusammenzuführen. Die `changelog.md` ist die einzige gemeinsame Quelle
der Wahrheit. Was dort nicht steht, ist für alle anderen unsichtbar – und geht
beim nächsten Zusammenführen der Stände verloren oder überschreibt still die
Arbeit von jemand anderem.

Eine Vorlage für neue Einträge steht am Ende der `changelog.md`.

> **Hinweis für KI-Assistenten und -Agenten:** Bevor du an diesem Projekt
> arbeitest, lies die `changelog.md` – insbesondere den Abschnitt „Offene
> Punkte". Trage jede von dir vorgenommene Änderung dort ein, mit Datum,
> Werkzeug, Begründung und der Angabe, wie du sie geprüft hast.

---

## Der ZIP-Weg: raus zum Kunden und zurück

Das Projekt liegt in einem **Git-Repository**. Der Kunde bekommt trotzdem ein
schlichtes ZIP ohne Git – er soll und muss damit nichts zu tun haben. Git läuft
nur auf unserer Seite und beantwortet die Frage, die sonst niemand beantworten
kann: *Was genau hat der Kunde eigentlich geändert?*

### 1. ZIP für den Kunden erzeugen

```bash
tools/zip-fuer-kunden.sh
```

Das Skript prüft, dass nichts Uncommittetes herumliegt, setzt ein **Versand-Tag**
(`versand/JJJJ-MM-TT`) und legt das ZIP eine Ebene über dem Projektordner ab.

Das Versand-Tag ist der wichtigste Teil. Es merkt sich, **auf welchem Stand der
Kunde aufsetzt**. Ohne dieses Tag ist die Rücklieferung später nur ein Haufen
Dateien, bei dem sich nicht mehr feststellen lässt, was von ihm stammt und was
von uns.

### 2. Rücklieferung einspielen

```bash
tools/kundenstand-importieren.sh ~/Downloads/NSBB_vom_Kunden.zip
```

Das Skript legt seine Fassung als eigenen Branch `kunde/JJJJ-MM-TT` an –
**aufgesetzt auf dem Versand-Tag, nicht auf dem aktuellen Stand** – und zeigt
danach, was er angefasst hat. Anschließend:

```bash
git diff main kunde/2026-08-01    # ansehen
git merge kunde/2026-08-01        # zusammenführen
```

**Warum der Umweg über den Branch?** Wenn der Kunde an seiner Fassung arbeitet
und wir parallel weitermachen, gibt es zwei Bearbeitungsstände desselben Stands.
Packt man seine Dateien einfach drüber, ist unsere Arbeit still weg. Setzt man
seinen Stand dagegen auf dem Punkt auf, den er tatsächlich bekommen hat, kann Git
beide Seiten unterscheiden: Es führt zusammen, was sich nicht überschneidet, und
meldet den Rest als Konflikt, statt ihn zu verschlucken.

### 3. Nach jedem Merge

```bash
node --check assets/js/app.js     # Syntaxfehler legen die GANZE Seite lahm
```

Dann die Versionsnummer `?v=` in der `index.html` erhöhen (siehe unten) und einen
Eintrag in die `changelog.md` schreiben.

> **Die `changelog.md` bleibt trotz Git Pflicht.** Git protokolliert nur unsere
> eigene Seite. Der Kunde, andere Agenturen und KI-Werkzeuge arbeiten ohne Git –
> deren Änderungen tauchen in der Historie nur als ein einziger großer
> „Stand des Kunden"-Commit auf, ohne Begründung. Das *Warum* steht nirgends
> außer im Changelog.

---

## Struktur

```
Website_Relaunch_2026/
├── index.html                    ← Grundgerüst: Head, Ladebildschirm, Verweise
├── .htaccess                     ← Serverkonfiguration (Kompression, Cache, Sicherheit)
├── robots.txt
├── sitemap.xml
├── changelog.md                  ← Änderungsprotokoll (siehe oben)
├── README.md                     ← diese Datei
├── PROMPT-FUER-CLAUDE.md         ← Einstiegstext für den Kunden
├── CLAUDE.md                     ← Regeln, die Claude Code automatisch lädt
│
├── tools/                        ← Hilfsskripte (nicht hochladen)
│   ├── zip-fuer-kunden.sh
│   └── kundenstand-importieren.sh
│
├── assets/
│   ├── css/
│   │   ├── style.css             ← Stylesheet der Website
│   │   └── fonts.css             ← Schrift-Einbindung (lokal)
│   ├── fonts/                    ← Cormorant Garamond + DM Sans (woff2)
│   ├── images/                   ← die ausgelieferten Bilder (WebP)
│   └── js/
│       ├── app.js                ← DIE WEBSITE: alle Seiten, Texte, Logik
│       └── vendor/
│           └── react-bundle.js   ← React-18-Laufzeit (nicht bearbeiten)
│
└── _source/
    └── images/                   ← Bild-Originale (JPG/PNG), NICHT hochladen
```

**Wo liegt was?**

* **Texte und Inhalte** stehen alle in `assets/js/app.js`.
* **Aussehen** in `assets/css/style.css`.
* `assets/js/vendor/react-bundle.js` ist eine Fremdbibliothek – hier gibt es
  nichts zu ändern.

---

## Hochladen auf All-Inkl

1. Per FTP (z. B. FileZilla) in das Verzeichnis der Domain hochladen –
   bei All-Inkl üblicherweise `/www/htdocs/<Kundennummer>/`.
2. **Hochladen:** `index.html`, `.htaccess`, `robots.txt`, `sitemap.xml`
   und den kompletten `assets/`-Ordner mit unveränderter Ordnerstruktur.
3. **Nicht hochladen:** `_source/`, `README.md`, `changelog.md`.
   (Falls doch mit hochgeladen: die `.htaccess` sperrt den Zugriff darauf.)

### Wichtig: `.htaccess` wird oft übersehen

Dateien, die mit einem Punkt beginnen, blendet FileZilla standardmäßig aus –
unter *Server → Versteckte Dateien anzeigen* einschalten. **Ohne die `.htaccess`
verliert die Seite Kompression, Caching und alle Sicherheits-Header** und lädt
spürbar langsamer.

### Vor dem Livegang zu prüfen

| Punkt | Wo |
|---|---|
| SSL-Zertifikat eingerichtet? **Erst danach** die HTTPS-Weiterleitung aktiv lassen | KAS → Domain → SSL |
| PHP-Version aktuell (für `contact.php`) | KAS → Domain → PHP-Version |
| `contact.php` vorhanden? | siehe unten |

---

## Kontaktformular (`contact.php`)

Das **Karriereformular** sendet per `fetch()` an eine Datei **`contact.php`** im
selben Verzeichnis wie die `index.html`. Diese Datei ist **nicht Teil dieses
Ordners** und muss serverseitig ergänzt werden (Absender `mail@nsbb.de`,
Empfänger `m.siebert@nsbb.de`, Reply-To auf die Adresse des Absenders).
Fehlt sie, läuft jede Bewerbung in den Fehlerzweig.

> ⚠️ **Das allgemeine Kontaktformular nutzt `contact.php` nicht.** Es öffnet
> stattdessen einen `mailto:`-Link und meldet danach „Vielen Dank" – auch dann,
> wenn gar nichts versendet wurde. Besucher ohne eingerichtetes Mailprogramm
> (Web-Mail im Browser) lösen damit nichts aus, die Anfrage geht verloren.
> Siehe `changelog.md`, „Offene Punkte" Nr. 2.

---

## Änderungen vornehmen

### Nach JEDER Änderung an CSS oder JS: Versionsnummer erhöhen

In der `index.html` stehen die Verweise mit einem Anhängsel:

```html
<link rel="stylesheet" href="assets/css/style.css?v=20260717"/>
<script src="assets/js/app.js?v=20260717" defer></script>
```

Der Server liefert diese Dateien mit **einem Jahr Cache** aus. Das `?v=...` ist
das Einzige, was Browser dazu bringt, eine neue Fassung zu holen.

> ⚠️ **Wer `app.js`, `style.css`, `fonts.css` oder `react-bundle.js` ändert und
> die Nummer nicht hochzählt, dessen Änderung sieht bei wiederkehrenden Besuchern
> bis zu ein Jahr lang niemand.** Einfach das Datum der Änderung eintragen,
> überall gleich (z. B. `?v=20260801`).

### Bilder austauschen

Die Website liefert **WebP** aus, die Originale liegen in `_source/images/`.
Nach dem Austausch eines Bildes muss die WebP-Fassung neu erzeugt werden:

```bash
# Fotos
cwebp -q 82 -metadata none _source/images/team-neu.jpg -o assets/images/team-neu.webp
# Logos / Grafiken mit Transparenz
cwebp -q 90 -alpha_q 100 -metadata none _source/images/logo-neu.png -o assets/images/logo-neu.webp
```

Ohne `cwebp` zur Hand tut es auch ein Online-Konverter – wichtig ist nur, dass
in `assets/images/` eine `.webp` mit dem Namen liegt, den `app.js` erwartet.
Danach: Versionsnummer erhöhen (siehe oben) und Eintrag in die `changelog.md`.

### Lokal testen

```bash
cd Website_Relaunch_2026
python3 -m http.server 8080
# im Browser: http://localhost:8080
```

Damit lässt sich die Seite prüfen; die `.htaccess` wirkt dabei allerdings nicht
(dafür braucht es einen Apache). Nach Änderungen an `app.js` unbedingt prüfen,
ob die Seite noch lädt – ein Syntaxfehler legt die **komplette** Website lahm,
weil alle Seiten in dieser einen Datei stecken:

```bash
node --check assets/js/app.js
```

---

## Technischer Hintergrund

Die Website ist eine **Single-Page-Application auf Basis von React 18**. React
ist lokal eingebunden (`assets/js/vendor/react-bundle.js`), es wird **kein
externer CDN** benötigt. Auch die Schriften liegen lokal – die Seite lädt im
Normalbetrieb **von keinem fremden Server** nach.

Einzige Ausnahme: die **Google-Maps-Karten** auf der Kontaktseite. Sie laden
beim Aufruf der Seite und übertragen dabei die IP-Adresse des Besuchers an
Google. Siehe `changelog.md`, „Offene Punkte" Nr. 4.

**Alle Unterseiten teilen sich eine einzige URL** (Navigation über `#kontakt`,
`#leistungen` …). Das hat spürbare Folgen für die Auffindbarkeit bei Google und
ist in der `changelog.md` unter „Offene Punkte" Nr. 6 beschrieben.

## Sprachen

Deutsch und Englisch, umschaltbar über den Schalter im Menü. Beide Sprachfassungen
stehen direkt in `assets/js/app.js`.
