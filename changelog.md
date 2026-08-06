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

## [2026-08-06] Startseite: Standort-Verlinkung heißt jetzt „Standort Berlin" / „Standort Köln"

**Bearbeiter:** Claude (Claude Code, Opus 5)
**Grund:** Kundenwunsch – die beiden Verweise in der Kennzahlenleiste der
Startseite sollen „Standort Berlin" und „Standort Köln" heißen (vorher
„Steuerberater Berlin" / „Steuerberater Köln"). Sonst bleibt alles unverändert.

### Geändert
* `assets/js/app.js`, `HomePage` (Standort-Schnellzugriff in der
  Kennzahlenleiste): Beschriftung der beiden Knöpfe
  „Steuerberater Berlin/Köln" → **„Standort Berlin" / „Standort Köln"**,
  englisch „Tax Advisor Berlin/Cologne" → **„Berlin office" / „Cologne office"**
  (passend zum Eyebrow der Standortseiten). Ziel-Adressen unverändert
  (`steuerberater-berlin` / `steuerberater-koeln`).
* `index.html`: `?v=20260806c` → `?v=20260806d`.

### Bewusst NICHT geändert
* **Menü** („Über uns" → Dropdown) und **Footer**-Seitenliste behalten den
  Ankertext „Steuerberater Berlin" / „Steuerberater Köln". Interner Ankertext ist
  ein Rankingsignal – so bleibt das Keyword für die Suche erhalten, während die
  Startseite die vom Kunden gewünschte Beschriftung trägt.
* Die beiden Standortseiten selbst, ihre Adressen, Inhalte und die strukturierten
  Daten bleiben unangetastet.

### Geprüft
* `node --check assets/js/app.js` – fehlerfrei.
* Browser (Playwright, DE + EN): beide Knöpfe tragen die neue Beschriftung, die
  alte Beschriftung kommt auf der Startseite nicht mehr vor, Klick führt korrekt
  auf „Steuerberater in Berlin." bzw. „Tax Advisor in Berlin."; keine
  Konsolenfehler.

---

## [2026-08-06] Standortseiten Berlin & Köln optisch neu aufgebaut (nutzerfreundlicher, mehr Inhalt)

**Bearbeiter:** Claude (Claude Code, Opus 5)
**Grund:** Kundenmeldung – die beiden Standortseiten gefielen optisch nicht: zu
textlastig, zu flach, zu wenig ansprechend. Gewünscht war eine deutlich
hochwertigere, nutzerfreundlichere Oberfläche mit mehr nützlichen Informationen –
**ohne** die erreichte SEO-/GEO-/KI-Optimierung zu verlieren.

**Wichtig:** Es wurde **kein** neues Design erfunden. Alles ist mit den
vorhandenen Mitteln der Website gebaut (Akzentgrün `--accent`, Cormorant Garamond
für Überschriften, DM Sans für Text, die bestehenden `Ico`-Icons, `card-hover`,
`btn-p`/`btn-s`, `fade-up`). Geändert wurde ausschließlich die Seiten-Komponente
`StandortPage` (und das zugehörige `StandortAccordion`) – kein Eingriff in andere
Seiten oder Bausteine.

### Geändert (nur `assets/js/app.js`, `index.html`)
* **Einstieg mit echtem Standortfoto (neu):** Zweispaltiger Auftakt aus Text und
  dem bereits im Projekt vorhandenen, bisher auf diesen Seiten **ungenutzten**
  Standortbild (`assets/images/standort-berlin.webp` / `-koeln.webp`, WebP, mit
  `width`/`height` und beschreibendem `alt`). Über dem Bildfuß liegt eine
  Adresskarte. Links: Kurzüberschrift, Intro, drei Vertrauenspunkte mit Haken und
  zwei Handlungsknöpfe – **„Anrufen: <Durchwahl>"** (Telefon ist der zuverlässig
  funktionierende Weg) und „Erstgespräch vereinbaren".
* **„Auf einen Blick" als Kachelraster:** Die frühere graue Liste ist jetzt ein
  Raster aus acht Karten mit Icon (Anschrift, Telefon, E-Mail, Öffnungszeiten,
  Sprachen, Schwerpunkte, Beratungsregion, **Berufsträger vor Ort** – neu).
  Deutlich schneller erfassbar, gleiche maschinelle Auswertbarkeit.
* **Leistungskarten mit Icons** (Unternehmen/International/Privat) und
  `card-hover`; die ganze Karte ist klickbar – wie auf der Startseite.
* **Neuer Abschnitt „Warum NSBB in Berlin/Köln?"** auf ruhiger Akzentfläche:
  vier Karten (Feste Ansprechpartner · Digital & papierlos · International
  vernetzt · Verbindlich & vertraulich). Gibt der Seite einen optischen Anker und
  beantwortet die Auswahlfrage der Besucher.
* **Ansprechpartner mit Direktkontakt:** Karten mit rundem Foto, Position, Name,
  Berufstitel – **neu**: Durchwahl und persönliche E-Mail direkt anklickbar.
  Darunter weiterhin **ein** Link zum Team.
* **Digitale Zusammenarbeit als Checkliste:** Text links, rechts eine Karte
  „So läuft es konkret ab" mit vier Punkten. **Kölner Fassung weiterhin ohne
  eSign** (wie abgestimmt). Dazu ein Link auf „Digitale Kanzlei".
* **Anfahrt konkret (neu):** Zwei Karten – „Adresse & Kontakt" (Anschrift,
  Telefon, E-Mail, Öffnungszeiten mit Icons, Google-Maps-Knopf) und „So erreichen
  Sie uns" mit **echten Wegbeschreibungen**: Berlin S1/Zehlendorf, Bus M48/X10,
  kostenfreie Parkplätze · Köln Linie 3/4 Heumarkt, Hauptbahnhof, Tiefgarage.
  Diese Angaben lagen bereits auf der Kontaktseite und fehlten hier – sie sind
  zugleich ein starkes lokales Suchsignal.
* **FAQ in Karte, klareres Aufklappen:** rundes Plus/Minus statt freistehendem
  Zeichen, aktive Frage in Akzentfarbe.
* **`StandortAccordion`:** Optik nachgezogen (rundes Plus/Minus, letzte Zeile
  ohne Trennlinie, größere Zeilenhöhe in den Antworten).
* `index.html`: `?v=20260806b` → `?v=20260806c`.

### Nicht angetastet (SEO/GEO bleibt vollständig erhalten)
Strukturierte Daten (`AccountingService`/`LocalBusiness` + `BreadcrumbList` +
`FAQPage`), die seitengenauen Meta-Beschreibungen, die neun FAQ je Standort, der
Abschnitt zur lokalen Reichweite samt Orts-Chips und `llms.txt` sind unverändert.
Durch den Umbau kamen zusätzliche Inhalte **hinzu** (Anfahrtswege, Berufsträger
vor Ort, Warum-Abschnitt), was Local SEO und KI-Auswertbarkeit eher stärkt.

### Geprüft
* `node --check assets/js/app.js` – fehlerfrei.
* Browser (Playwright, 1280 px und 390 px, DE + EN): beide Seiten vollständig,
  neun `h2`-Ebenen (saubere Gliederung), alle Bilder laden, Abschnitte schließen
  lückenlos an (kein Layout-Loch), mobil sauber einspaltig; FAQ klappt auf;
  Leistungskarte führt korrekt zu „Steuerberatung für Unternehmen"; Telefon- und
  E-Mail-Links gesetzt; JSON-LD weiterhin mit allen drei Typen und je neun
  Fragen; **Köln ohne eSign**; keine Konsolenfehler.

### Offen / Achtung
* **Beobachtung, nicht geändert:** Nach Klick auf „Alle akzeptieren" im
  Cookie-Banner lädt die Website den **Google Tag Manager**
  (`googletagmanager.com/gtm.js?id=GTM-NNQTHD76`). Das ist Bestandteil der
  gelieferten Designer-Fassung und lädt korrekt erst nach Einwilligung. In der
  abgeschotteten Testumgebung schlägt dieser Aufruf fehl (kein Internetzugang) –
  live ist das unauffällig. Hinweis nur, weil `CLAUDE.md` „keine externen
  Dienste" vorgibt: bitte gegen die Datenschutzerklärung prüfen (dort ist
  bislang nur All-Inkl als Dienstleister genannt).

---

## [2026-08-06] SEO/GEO/KI-Optimierung der beiden Standortseiten Berlin & Köln

**Bearbeiter:** Claude (Claude Code, Opus 4.8)
**Grund:** Kundenwunsch – die beiden Standortseiten „Steuerberater Berlin" und
„Steuerberater Köln" vollumfänglich für klassisches SEO **und** GEO (generative
Suche / KI-Systeme wie ChatGPT, Perplexity, Google AI Overviews) optimieren.

### Geändert (nur `assets/js/app.js`, `llms.txt`, `index.html`)
* **Strukturierte Daten je Standortseite** (`app.js`, `StandortPage`): Beim
  Öffnen wird ein `application/ld+json`-Block ins `<head>` gespielt und beim
  Verlassen wieder entfernt (reversibel, keine Nebenwirkung auf andere Seiten).
  Inhalt als `@graph`:
  - `AccountingService`/`LocalBusiness` mit Name, eigener `@id`,
    `parentOrganization` → `https://nsbb.de/#kanzlei`, Anschrift, `geo`
    (Berlin 52.4294067,13.2565013 · Köln 50.9286278,6.9632448), Telefon,
    E-Mail, `areaServed` (Stadtteile + Umland), `knowsLanguage` de/en,
    Öffnungszeiten (Mo–Do 08–17:30, Fr 08–16:30).
  - `BreadcrumbList` (Startseite → Über uns → Steuerberater Berlin/Köln).
  - `FAQPage` aus den Seiten-FAQ (aktualisiert sich beim DE/EN-Wechsel mit).
* **Seitengenaue Meta-Beschreibung** (`app.js`): je Standort und Sprache wird
  `meta[name=description]` gesetzt und beim Verlassen auf den Ausgangswert
  zurückgestellt.
* **Faktenkarte „Auf einen Blick"** (`app.js`): kompakte `dl`-Liste mit
  Anschrift, Telefon, E-Mail, Öffnungszeiten, Sprachen, Schwerpunkten und
  Beratungsregion – für Menschen schnell erfassbar, für KI sauber extrahierbar.
* **Lokale Reichweite** (`app.js`): neuer Abschnitt „Wen wir in Berlin/Köln und
  Umgebung beraten" mit Fließtext und Stadtteil-/Umland-Chips (Berlin: Zehlendorf,
  Steglitz, Dahlem, Wannsee, Grunewald, Potsdam · Köln: Altstadt-Süd, Deutz,
  Lindenthal, Bonn, Leverkusen, Bergisch Gladbach). Stärkt Local SEO und liefert
  KI klare Ortssignale.
* **FAQ erweitert** (`app.js`): je Standort von 5 auf 9 Fragen (neue Intents:
  Branchen, Erreichbarkeit/Öffnungszeiten, regionale Reichweite, Beratung auf
  Englisch) – gut für Featured Snippets und KI-Antworten.
* **`llms.txt`**: beide Standortseiten mit URL, Anschrift, betreuten Regionen und
  den Berufsträgern vor Ort ergänzt (Zusammenfassung für KI-Systeme).
* **`index.html`**: `?v=20260806` → `?v=20260806b`.

### Geprüft
* `node --check assets/js/app.js` – fehlerfrei.
* Browser (Playwright, DE + EN): JSON-LD wird injiziert und ist valide
  (`AccountingService`+`LocalBusiness` / `BreadcrumbList` / `FAQPage` mit je 9
  Fragen); Geo/Adresse/Öffnungszeiten korrekt; Meta-Beschreibung wechselt mit der
  Sprache; Faktenkarte und Regionen-Chips rendern; Köln weiterhin **ohne** eSign;
  beim Verlassen der Seite wird das JSON-LD entfernt und die Meta-Beschreibung
  zurückgesetzt; keine Konsolenfehler.

### Offen / Achtung
* Die strukturierten Daten werden zur Laufzeit ins `<head>` geschrieben – Google
  rendert JS und liest sie; falls das Vorrender-Verfahren der Projektleitung
  Head-Änderungen zur Laufzeit **nicht** serialisiert, sollte der JSON-LD-Block
  (und die Meta-Beschreibung) je Seite fest ins vorgerenderte HTML übernommen
  werden. Vorlagen stehen oben bzw. ergeben sich aus `STANDORT_DATA` in `app.js`.
* `robots.txt` blockiert keine KI-Crawler (GPTBot, Google-Extended,
  PerplexityBot etc. sind über `Allow: /` zugelassen) – bewusst so belassen.

---

## [2026-08-06] Zwei Standortseiten „Steuerberater Berlin" & „Steuerberater Köln" (DE + EN)

**Bearbeiter:** Claude (Claude Code, Opus 4.8)
**Grund:** Kundenwunsch – zwei standortbezogene Seiten für lokale Sichtbarkeit
(SEO/GEO) „Steuerberater Berlin" und „Steuerberater Köln", zweisprachig, mit den
Kurzprofilen der jeweils vor Ort tätigen Berufsträger. Umgesetzt als **normale
SPA-Seiten** mit echten Adressen (`/steuerberater-berlin`, `/steuerberater-koeln`)
– damit werden sie von der Projektleitung automatisch aus `validPages`
vorgerendert und in die Sitemap aufgenommen (kein `tools/`-Eingriff nötig).

### Geändert
* `assets/js/app.js` – **neue Seiten-Komponente** `StandortPage` (+ Datenobjekt
  `STANDORT_DATA` für Berlin/Köln, Hilfs-Komponente `StandortAccordion` für die
  FAQ, dünne Wrapper `SteuerberaterBerlinPage` / `SteuerberaterKoelnPage`).
  Aufbau je Seite, komplett DE + EN über `isDE ? … : …`:
  - `PageHero` (`fit:true`, identische Höhe/Optik wie alle Hauptseiten):
    Eyebrow „Standort Berlin · Zehlendorf" / „Standort Köln · Rheinauhafen",
    Titel „Steuerberater in" + grüner Akzent „Berlin." / „Köln.".
  - Intro-Absatz, drei Leistungs-Karten (verlinken auf `leistungen-unternehmen`
    / `-international` / `-privat`).
  - **Ansprechpartner:** `team.filter(standort)` als kompakte Karten (rundes
    Foto, interne Position, Name, Berufstitel) – Berlin: Guido H. Siebert &
    Isabell Schramm; Köln: Maximilian Siebert & Hanna Richrath. Darunter **ein**
    Link „Team kennenlernen →" auf die Team-Seite (`ueber-uns`); keine Klick-
    Popups (bewusst, wie mit dem Kunden abgestimmt).
  - „Digitale Zusammenarbeit" (Kölner Text **ohne** eSign-Erwähnung, wie
    gewünscht umformuliert), „So finden Sie uns …" (Adresse, Durchwahl als
    `tel:`-Link, Google-Maps-Link), FAQ-Accordion (5 Fragen/Antworten je Stadt),
    abschließend `ContactCTA`.
* `assets/js/app.js` – **Registrierung** (laut `README-INHALTSSEITEN.md`):
  `validPages` um `'steuerberater-berlin'`, `'steuerberater-koeln'` ergänzt;
  in `const pages` beide Schlüssel den Komponenten zugeordnet; `pageTitles`
  **DE und EN** ergänzt.
* `assets/js/app.js` – **Navigation:** Menüpunkt „Über uns" ist jetzt ein
  **Dropdown** mit den Unterpunkten Team / Steuerberater Berlin / Steuerberater
  Köln (analog zu „Leistungen"). „Über uns" selbst hat keine eigene Seite mehr,
  „Team" zeigt auf die bisherige Über-uns-Seite (`ueber-uns`).
* `assets/js/app.js` – **Startseite:** In der Kennzahlenleiste (2 Standorte,
  4 Berufsträger …) rechts daneben zwei Schnellzugriff-Buttons „Steuerberater
  Berlin" / „Steuerberater Köln" mit Verlinkung; auf Mobil rücken sie darunter.
* `assets/js/app.js` – **Footer:** in der crawlbaren Seitenliste zwei echte Links
  „Steuerberater Berlin" / „Steuerberater Köln" ergänzt (interne Verlinkung).
* `index.html`: `?v=20260724g` → `?v=20260806` (alle vier Asset-Verweise), damit
  wiederkehrende Besucher die neue `app.js` sofort sehen.

### Geprüft
* `node --check assets/js/app.js` – nach jeder Änderung fehlerfrei.
* Lokal (`python3 -m http.server`): beide Seiten öffnen mit identischem Header
  und identischer Hero wie der Rest der Website; In-App-Navigation (kein
  „Rausleiten"); DE/EN-Umschalter wechselt alle Texte; FAQ-Accordion klappt auf/
  zu; korrekte Profile je Standort; „Team kennenlernen" führt zur Team-Seite;
  Standort-Links in Startseite/Footer/Menü funktionieren; keine Konsolenfehler.
* Direktaufruf `/steuerberater-berlin` und `/steuerberater-koeln` (Router
  `seiteAusAdresse` liest `validPages`) zeigt die jeweils richtige Seite.

### Offen / Achtung
* **Wunsch-Meta-Beschreibungen** für das Vorrendern durch die Projektleitung:
  - `/steuerberater-berlin` (DE): „Steuerberater in Berlin-Zehlendorf: NSBB
    berät Unternehmen, Privatpersonen und internationale Mandanten – digital,
    persönlich und über das weltweite TGS-Netzwerk. Jetzt Erstgespräch
    vereinbaren."
  - `/steuerberater-berlin` (EN): „Tax advisor in Berlin-Zehlendorf: NSBB advises
    companies, private individuals and international clients – digital, personal
    and connected worldwide via the TGS network."
  - `/steuerberater-koeln` (DE): „Steuerberater in Köln am Rheinauhafen: NSBB
    berät Unternehmen, Freiberufler und Privatpersonen – digital, persönlich und
    international vernetzt über das TGS-Netzwerk."
  - `/steuerberater-koeln` (EN): „Tax advisor in Cologne on the Rheinauhafen:
    NSBB advises companies, freelancers and private individuals – digital,
    personal and internationally connected via the TGS network."
* Sitemap/Vorrendern bleiben wie vorgesehen der Projektleitung überlassen (beide
  Seiten stehen in `validPages`); `tools/` und `sitemap.xml` wurden **nicht**
  angefasst.

---

## [2026-07-24] Fix: „Aktuelles" im Menü lud nicht, wenn man auf einem Beitrag war

**Bearbeiter:** Claude (Claude Code, Opus 4.8)
**Grund:** Kundenmeldung – auf einer Beitragsseite (`/beitrag/<slug>`) blieb beim
Klick auf „Aktuelles" im Menü der Beitrag stehen, die Übersicht lud nicht.

**Ursache:** Beitrag UND Übersicht sind im Router dieselbe Seite (`aktuelles`);
den Unterschied macht nur die Adresse. Der Menü-Klick ruft `setPage('aktuelles')`
auf – das ändert die schon gleiche Router-Seite nicht (kein Neu-Rendern) und
schreibt die Adresse per `pushState`, was **kein** `popstate` auslöst. Die
`AktuellesPage` (die ihren geöffneten Beitrag am `slug` in der Adresse erkennt)
bekam davon nichts mit und blieb auf dem Beitrag.

### Geändert
* `assets/js/app.js`, Router `setPage()`: nach dem `pushState` wird jetzt ein
  `popstate`-Ereignis ausgelöst. So gleichen adressbewusste Unterseiten (die
  `AktuellesPage` mit ihren `/beitrag/<slug>`-Adressen) ihren Zustand mit der
  neuen Adresse ab. Harmlos für alle anderen Seiten (sie lesen dieselbe Adresse
  erneut und setzen dieselbe Seite).
* `assets/js/app.js`, `AktuellesPage`: Der Browser-Tab-Titel wird beim Zurück­
  wechsel zur Übersicht wieder auf den Übersichtstitel gesetzt (der Router-Titel
  greift nur beim Wechsel der Seite, nicht bei Beitrag↔Übersicht).
* `index.html`: `?v=20260724f` → `?v=20260724g` (Live-Beitragsseite nachgezogen).

### Geprüft
* `node --check assets/js/app.js` – fehlerfrei.
* Lokal (zwei Testbeiträge): Übersicht → Beitrag öffnen → „Aktuelles" im Menü →
  Übersicht lädt korrekt (Hero, Mandanteninfo, Karten, Filter), Tab-Titel wieder
  „Aktuelles …"; keine Konsolenfehler.
* Live nach Deploy: auf `/beitrag/e-rechnungspflicht` „Aktuelles" geklickt →
  `/aktuelles` mit Übersicht und korrektem Titel.

---

## [2026-07-24] Drei Nachbesserungen: eindeutige Bildnamen, Markdown-Upload, Karten-Bild nicht mehr beschnitten

**Bearbeiter:** Claude (Claude Code, Opus 4.8)
**Grund:** Kundenmeldung – (1) ein ersetztes Titelbild blieb im Browser das alte;
(2) es sollte eine Markdown-Datei hochladbar sein; (3) in der Übersicht wurde
das Beitragsbild beschnitten.

### Geändert
* **Eindeutige Bild-Dateinamen** (`redaktion/index.php`): `bild_verarbeiten()` und
  `bild_og_erzeugen()` bekommen ein Kürzel je Upload
  (`<id>-<zeit+zufall>.webp` bzw. `…-og.jpg`). Damit erhält ein **ersetztes**
  Bild eine **neue Adresse** – kein Browser und kein Social-Media-Cache zeigt
  mehr das alte Bild (analog zu den Mandanteninfo-PDFs). Das alte Bild wird
  beim Speichern weiterhin gelöscht. **Ursache des Kundenproblems:** Vorher
  hieß das Bild immer `<id>.webp`; nach dem Ersetzen war die Adresse gleich, der
  Browser lieferte die zwischengespeicherte alte Datei.
* **Markdown-Datei laden** (`redaktion/index.php`): Neuer Knopf „Markdown-Datei
  laden …" über dem Textfeld. Liest eine `.md` clientseitig (`FileReader`) und
  übernimmt den Inhalt ins Textfeld. Dabei werden ein führender HTML-Kommentar
  (SEO-Meta-Kopf) und ein manuell geschriebenes „## Inhalt" entfernt (das
  Inhaltsverzeichnis entsteht automatisch), und die erste Überschrift wandert –
  wenn das Titelfeld leer ist – in den Titel. Kein Server-Upload, keine
  Fremdbibliothek.
* **Karten-Bild in der Übersicht** (`assets/js/app.js`, `AktuellesPage`): Das
  Vorschaubild der Beitragskarte nutzt statt fester Höhe (176 px, beschnitt das
  1200×630-Cover) jetzt `aspect-ratio: 1200 / 630`. Das Cover wird damit
  vollständig gezeigt; Karten bleiben einheitlich. Der Platzhalter (Beitrag ohne
  Bild) nutzt dasselbe Verhältnis.
* `index.html`: `?v=20260724e` → `?v=20260724f`.

### Angewendet
* Das Titelbild des ersten Beitrags („E-Rechnungspflicht") wurde mit den neuen,
  eindeutigen Dateinamen **neu erzeugt und hochgeladen** (generiertes Cover),
  damit die alte, im Browser gecachte Adresse endgültig ersetzt ist. Live
  geprüft: neue Bild-Adresse (`…-260724195354f21e-og.jpg`) in Seite +
  `beitraege.json`, erreichbar (200); die alte feste Adresse liefert jetzt 404.

### Geprüft
* `node --check assets/js/app.js`, beide Redaktions-JS-Blöcke `node --check`,
  `php -l redaktion/index.php` (Server) – alle fehlerfrei.
* Markdown-Verarbeitung mit Node gegen die echte gelieferte `.md`: Titel
  korrekt extrahiert, SEO-Kommentar + manuelles „## Inhalt" entfernt, Haupttext
  erhalten. DOM-Fluss im Browser-Prüfstand (Datei → `FileReader` → Textfeld +
  Titel) bestätigt.
* Karten-Bild im Browser (Testbeitrag mit 1200×630-Bild): angezeigtes
  Seitenverhältnis 1.905 = natürliches Verhältnis → **nicht beschnitten**.
* Eindeutige Dateinamen live durch das Neu-Hochladen des ersten Covers
  verifiziert (s. „Angewendet").

**Bearbeiter:** Claude (Claude Code, Opus 4.8)
**Grund:** Kundenmeldung – `/beitrag/<slug>` zeigte die komplette Aktuelles-
Übersicht (Hero „Gut informiert", Mandanteninformation, Überschrift „Beiträge",
Filter-Chips) mit dem Beitrag nur inline aufgeklappt darin. Es soll nur der
Beitrag stehen, darunter Navigation zum vorherigen/nächsten Beitrag.

### Geändert
* `assets/js/app.js`, `AktuellesPage`: klare Trennung zweier Ansichten statt des
  bisherigen Inline-Aufklappens.
  * **`/aktuelles`** = Übersicht wie bisher (Mandanteninformation + Beitragsraster).
    Die Karten klappen aber **nicht mehr inline auf**, sondern führen per Klick zur
    eigenen Beitragsseite (`pushState` → Verlaufseintrag, damit Zurück wirkt).
  * **`/beitrag/<slug>`** = **eigene, reduzierte Beitragsseite**: nur Kopf
    (Kategorie-Label, Titel in Cormorant, Datum · Autor auf dem Hero-Verlauf),
    Beitragsbild, automatisches Inhaltsverzeichnis, Markdown-Text – und im Fuß die
    **Navigation zum vorherigen/nächsten Beitrag** (nach Datum) plus „Alle
    Beiträge". Keine Übersichts-Bestandteile mehr.
  * State von `offen` (aufgeklappte id) auf `slug` (aktuelle Adresse) umgestellt;
    ein `popstate`-Listener führt Vor/Zurück im Browser sauber nach; der
    Seitentitel im Browser wird auf den Beitragstitel gesetzt. Alte
    `#beitrag-<id>`-Hash-Links werden weiterhin verstanden und auf
    `/beitrag/<slug>` umgeschrieben (Rückwärtskompatibilität).
* `index.html`: `?v=20260724d` → `?v=20260724e`. Die bereits erzeugte Live-
  Beitragsseite `daten/beitragsseiten/e-rechnungspflicht.html` wurde auf denselben
  Stand nachgezogen (nur die `?v=`-Cache-Nummern), damit der Fix auch bei bereits
  gecachtem `app.js` sofort ankommt.

### Geprüft
* `node --check assets/js/app.js` – fehlerfrei; keine Rückstände des alten
  Aufklapp-Modells (`offen`/`umschalten`/`istOffen`/`offenerToc` = 0 Treffer).
* Lokal (`python3 -m http.server`, zwei Testbeiträge, danach Daten wieder geleert):
  Übersicht zeigt Karten (klickbar, kein Inline-Aufklappen); `/beitrag/<slug>`
  zeigt **nur** den Beitrag (kein Mandanteninfo, keine „Beiträge"-Überschrift,
  keine Filter-Chips, kein Aktuelles-Hero); Inhaltsverzeichnis, Tabelle und
  FAQ-Schema rendern; Vor/Zurück-Navigation wechselt korrekt (jeweils nach oben
  gescrollt), Browser-Zurück führt sauber zurück; keine Konsolenfehler.
* Live nach Deploy: `/beitrag/e-rechnungspflicht` → 200, saubere Einzelseite
  (Mandanteninfo/Filter/Hero nicht vorhanden, Bild + Inhaltsverzeichnis +
  FAQ-Schema vorhanden), Meta/`og:image`/BlogPosting/FAQPage unverändert;
  `/aktuelles` weiterhin die Übersicht mit klickbarer Karte.

### Offen / Achtung
* Vor/Zurück richtet sich nach dem Beitragsdatum (neuere/ältere). Bei nur einem
  Beitrag erscheint erwartungsgemäß nur der „Alle Beiträge"-Link.

---

## [2026-07-24] Titelbild-Generator im Redaktionsbereich (Vorlage aus Titel + Kategorie)

**Bearbeiter:** Claude (Claude Code, Opus 4.8)
**Grund:** Kundenwunsch – Titelbilder sollen sich ohne externe Grafikarbeit direkt
im Redaktionsbereich erzeugen lassen.

### Geändert
* `redaktion/index.php`:
  * Neue Checkbox **„Titelbild automatisch aus Titel + Kategorie erzeugen"** im
    Beitragsformular. Aktiv erscheint eine **Live-Vorschau** (1200×630),
    gezeichnet auf ein `<canvas>` – rein clientseitig, **kein externer Dienst**
    (bewusst kein KI-Bilddienst: das verstieße gegen „keine externen Dienste /
    keine Besucherdaten in die USA"). Es ist ein **Vorlagen**-Generator, kein
    KI-Generator.
  * **Design an der echten Website-Optik ausgerichtet** (auf Kundenwunsch, nach
    einem ersten vorlagen-nahen Entwurf verworfen): exakt der Hero-Farbverlauf
    der Seite (`#F7F6F3 → #F0EEE9 → #EAF0EC`), **Titel in Cormorant Garamond**
    (die Serifenschrift der Website) mit **grüner letzter Zeile** wie im
    Startseiten-Hero, grünes Kapitälchen-Label für die Kategorie und kurzer
    grüner Trennstrich (die Bausteine `.label`/`.divider` der Seite), dezente
    Mint-Kugel als Hintergrundakzent, optionaler Untertitel. Unten steht das
    **echte Logo** (`assets/images/logo-nav.webp`, per `drawImage` – gleicher
    Ursprung, daher bleibt der Canvas „sauber" und `toBlob()` funktioniert;
    Rückfall auf eine Wortmarke, falls das Bild noch lädt).
  * Beim Speichern wird das gezeichnete Bild als PNG per `DataTransfer` in das
    bestehende Datei-Feld gelegt und läuft danach durch **dieselbe, schon
    getestete Upload-Strecke** wie ein hochgeladenes Bild (→ WebP-Anzeigebild +
    1200×630-OG-JPG). Serverseitig war dafür **keine** Änderung nötig. Ist kein
    Bild beschrieben, wird die Bildbeschreibung automatisch aus dem Titel
    gesetzt.
  * `<head>`: `../assets/css/fonts.css` eingebunden, damit der Canvas die echten
    NSBB-Schriften nutzt (Cormorant Garamond + DM Sans; die relativen Pfade in
    fonts.css lösen von `/redaktion/` korrekt auf). Vor dem Zeichnen werden beide
    Schnitte per `document.fonts.load()` geladen, dann wird neu gezeichnet.

### Geprüft
* `php -l redaktion/index.php` auf dem Server – fehlerfrei; beide JS-Blöcke
  `node --check` – fehlerfrei.
* Lokaler Prüfstand (echter Generator-Code, Projektwurzel per `python3 -m
  http.server`, Harness unter `/redaktion/` damit `../assets/images/logo-nav.webp`
  **gleichen Ursprung** hat, Browser): Umschalten blendet die Vorschau ein und
  deaktiviert das Datei-Feld; Live-Vorschau aktualisiert bei Eingabe; das Cover
  rendert in der Website-Optik (Cormorant-Titel, grüne letzte Zeile, echtes
  Logo unten). Beim Absenden wird genau **eine** Datei (`titelbild.png`,
  ~1,6 MB, unter dem 5-MB-Limit) ins Datei-Feld injiziert und die
  Bildbeschreibung automatisch gefüllt – d. h. `toBlob()` funktioniert trotz
  eingezeichnetem Logo, der Canvas ist also nicht „tainted".
* `DataTransfer`/`File`-Mechanismus zusätzlich isoliert im Browser bestätigt.
* Live nach Deploy: die deployte `redaktion/index.php` enthält den neuen
  Generator (Cormorant im Canvas, Hero-Verlauf, grüne letzte Zeile,
  `drawImage(logo)` auf `logo-nav.webp`); das alte Dokument-Motiv ist entfernt.

### Offen / Achtung
* Rein clientseitig: In einem Browser ohne JavaScript oder ohne `DataTransfer`
  (sehr alt) bleibt es beim normalen manuellen Upload – kein Funktionsverlust.
* Der Hintergrund (dezente Mint-Kugel) ist für alle Kategorien gleich, ganz im
  ruhigen, typografischen Stil der Website. Kategorie-spezifische Motive wären
  später leicht ergänzbar, sind aber bewusst weggelassen.
* Die letzte Titelzeile wird grün gesetzt, sobald der Titel mehrzeilig umbricht
  (Nachbau des zweifarbigen Hero-Prinzips). Bei sehr kurzen, einzeiligen Titeln
  bleibt der Titel komplett in Tinte.

**Angewendet:** Das extern gelieferte Titelbild des ersten Beitrags
(„E-Rechnungspflicht") wurde durch ein mit diesem Generator erzeugtes Cover in
Website-Optik ersetzt (auf Kundenwunsch). Erzeugt mit dem echten Generator-Code
im Browser (Prüfstand), das PNG über die reguläre Pipeline in den Live-Beitrag
gespeichert (→ neues Anzeige-WebP + 1200×630-OG-JPG, `bild`/`bildOg`
aktualisiert, Beitragsseite neu erzeugt). Live geprüft: das OG-Bild ist das neue
Cover. Hinweis: Der OG-Dateiname bleibt gleich (`<id>-og.jpg`), sehr früh
geteilte Links könnten daher in Social-Media-Caches noch die alte Vorschau
zeigen, bis die Plattformen neu einlesen.

---

## [2026-07-24] Beiträge: Markdown-Formatierung, Inhaltsverzeichnis, FAQ-Strukturdaten, eigene Beitrags-Adresse mit Social-Vorschaubild

**Bearbeiter:** Claude (Claude Code, Sonnet 5)
**Grund:** Kundenwunsch – Beiträge sollen künftig strukturiert (Überschriften,
Listen, verlinktes Inhaltsverzeichnis, interne Links) statt als reiner
Fließtext erscheinen; das mitgelieferte Beispielbild soll zusätzlich als
Vorschaubild beim Teilen (WhatsApp/LinkedIn) dienen.

### Geändert
* `redaktion/index.php`:
  * Neues Feld **„Adresse (URL)"** (automatisch aus dem Titel gebildet,
    zusätzlich von Hand überschreibbar) und **„Autor" (optional)** je Beitrag.
  * Formatierungs-Symbolleiste über dem Textfeld (H2/H3, Fett, Kursiv, Liste,
    nummerierte Liste, Link, Tabelle, Trennlinie) – fügt reine Markdown-Syntax
    an der Cursor-Position ein, kein WYSIWYG.
  * `bild_og_erzeugen()`: schneidet das hochgeladene Bild zusätzlich mittig auf
    exakt 1200×630 zu (JPEG, wie das allgemeine `og-image.jpg` – bewusst kein
    WebP, manche Plattformen zeigen WebP-Vorschaubilder nicht zuverlässig an).
  * `beitragsseite_schreiben()`: erzeugt je Beitrag eine eigene, crawlbare Seite
    unter `daten/beitragsseiten/<adresse>.html` (Title/Description/Canonical/
    og:*/BlogPosting- und ggf. FAQPage-JSON-LD) – liest die Wurzel-`index.html`
    dafür als eigene Vorlage, da der Redaktionsbereich live auf dem Server läuft
    und das Node-Vorrender-Werkzeug (`tools/seiten-generator.js`) nicht
    aufrufen kann.
  * `beitraege_sitemap_schreiben()`: eigene `daten/beitraege-sitemap.xml`,
    bewusst getrennt von der Node-eigenen `sitemap.xml` (die wird bei jedem
    Deploy komplett überschrieben – dort eingetragene Beiträge gingen verloren).
  * `php_faq_extrahieren()`: erkennt einen Abschnitt „Häufige Fragen"/„FAQ" und
    liest daraus Frage/Antwort-Paare für die FAQPage-Strukturdaten.
  * `bild_laden_gedreht()`: die EXIF-Dreh-Logik aus `bild_verarbeiten()` in
    einen gemeinsamen Helfer ausgelagert, damit sie nicht zweimal gepflegt
    werden muss (auch `bild_og_erzeugen()` braucht sie). Einzige, bewusst
    begründete Berührung von Bestandscode.
  * Beitragsseite + eigene Sitemap werden **außerhalb** der `daten/.sperre`-
    Sperre geschrieben (nach dem Speichern des Manifests) – reine Bild-/Datei-
    Operationen sollen die Sperre, die sich auch Mandanteninfo-Speichervorgänge
    teilen, nicht unnötig blockieren.
  * „Ansehen"-Link zeigt jetzt auf `../beitrag/<adresse>` (Rückfall auf die
    alte `#beitrag-<id>`-Form, falls ausnahmsweise keine Adresse vorhanden ist).
* `assets/js/app.js`:
  * Neuer, abhängigkeitsfreier Markdown-Parser (`markdownAst`,
    `markdownInline(Render)`, `markdownRender`, `markdownInhaltsverzeichnis`,
    `markdownFaqExtrahieren`) vor `AktuellesPage` – erkennt genau das, was die
    neue Symbolleiste erzeugt. React escapet weiterhin alle Textinhalte
    automatisch; eingegebenes HTML wird nie interpretiert.
  * `AktuellesPage`: aufgeklappter Beitrag wird jetzt als Markdown gerendert
    (Überschriften/Listen/Tabellen/Links) statt als reiner, an Leerzeilen
    getrennter Fließtext; automatisches Inhaltsverzeichnis mit Sprunglinks
    (nur bei mehr als einer Überschrift); FAQ-Abschnitt löst automatisch
    `useFaqSchema()` aus (bestehender Hook, unverändert wiederverwendet).
  * `seiteAusAdresse()`: `/beitrag/<adresse>` gehört jetzt zur selben Seite
    wie `/aktuelles`; neuer Helfer `beitragsSlugAusPfad()` liest die Adresse
    aus `window.location.pathname`.
  * Neue, eigene Deeplink-Logik für `/beitrag/<adresse>` (Laden + eigener
    `popstate`-Listener, da die Komponente beim Wechsel zwischen zwei
    Beitrags-Adressen nicht neu gemountet wird). Der alte Hash-Deeplink
    (`#beitrag-<id>`) bleibt **unverändert** bestehen – Rückwärtskompatibilität
    für bereits geteilte Links.
  * `umschalten()` schreibt bei vorhandener Adresse `/beitrag/<adresse>` in
    die Adresszeile (per `replaceState`, kein Verlaufseintrag), sonst wie
    bisher den Hash-Anker.
* `.htaccess`: neue Regel `^beitrag/([a-z0-9-]+)/?$` → die vom
  Redaktionsbereich erzeugte Datei in `daten/beitragsseiten/`. **Präfix bewusst
  `/beitrag/` und NICHT `/aktuelles/…`** – siehe „Offen/Achtung" (MultiViews-
  Kollision mit der vorhandenen `aktuelles.html`). Fehlt die Datei, fällt die
  Anfrage auf die SPA zurück – die zeigt dann die Beitragsübersicht statt eines
  Fehlers.
* `robots.txt`: zweite `Sitemap:`-Zeile für `daten/beitraege-sitemap.xml`.
* `assets/js/app.js` (Nachbesserung nach dem ersten echten Beitrag):
  `markdownInlineRender()` rendert **fett**/*kursiv* jetzt **rekursiv**, damit
  ein Link INNERHALB von Fettschrift (`**[Text](Adresse)**`, so im gelieferten
  Beitrag im Schlussabsatz) wirklich als Link erscheint statt als roher
  Markdown-Text. Vorher blieb `[digitale Kanzlei](/digital)` als sichtbarer
  Text stehen.
* `index.html`: `?v=20260724` → `?v=20260724d` (drei Deploys an diesem Tag:
  `…b` = erster Wurf mit `/aktuelles/<slug>`, `…c` = Umstellung auf
  `/beitrag/<slug>`, `…d` = rekursiver Inline-Fix oben).
* Datenmodell (`daten/beitraege.json`, je Beitrag): neue Felder `slug`,
  `autor` (optional), `bildOg` (`{datei,breite,hoehe}` oder `null`). Keine
  Migration nötig, die Datei ist live noch leer.

### Geprüft
* `node --check assets/js/app.js` nach jedem Teilschritt fehlerfrei.
* `php -l` **konnte nicht laufen** – auf dieser Maschine ist kein lokaler
  PHP-Interpreter installiert (`which php` liefert nichts). Die
  `redaktion/index.php`-Änderungen sind stattdessen manuell durchgelesen
  (Klammer-/Strukturprüfung); ein `php -l` auf dem Server vor oder direkt nach
  dem Deploy wird dringend empfohlen.
* Markdown-Parser isoliert mit Node getestet (Funktionen aus `app.js`
  extrahiert, ohne React aufgerufen): sowohl gegen einen synthetischen
  Testbeitrag (Überschriften, verschachtelte Liste, Tabelle, interner/externer
  Link, zwei FAQ-Paare) als auch gegen den echten, vom Kunden gelieferten
  Beitragstext „E-Rechnungspflicht" – Inhaltsverzeichnis (8 Überschriften),
  Tabelle (5 Zeilen) und alle 4 FAQ-Paare wurden korrekt erkannt.
* Browser-Test (`python3 -m http.server`, `daten/beitraege.json` testweise mit
  einem Beispielbeitrag befüllt, danach wieder auf den Leerzustand
  zurückgesetzt): Öffnen zeigt Inhaltsverzeichnis, Überschriften, Liste,
  Tabelle, Trennlinie, Fett/Kursiv/Links korrekt; Adresse wechselt zu
  `/beitrag/<slug>`; `#nsbb-faq-jsonld` erscheint beim Öffnen im `<head>` und
  verschwindet beim Schließen wieder; keine Konsolenfehler.
* Die neue `.htaccess`-Regel selbst konnte **nicht** lokal geprüft werden –
  Python-`http.server` wertet keine `.htaccess` aus, das braucht echtes Apache
  (Test- oder Live-Server nach dem Deploy).
* **Beim Live-Trockenlauf (`tools/deploy.sh live --probe`) gefunden:** Das
  Skript schloss `redaktion/.htaccess` korrekt vom rsync aus, aber NICHT
  `redaktion/.htpasswd` – obwohl der Kommentar im Skript bereits „eigene
  .htaccess + .htpasswd" erwähnte. Der Trockenlauf zeigte tatsächlich
  `*deleting redaktion/.htpasswd`, was den Live-Zugangsschutz des
  Redaktionsbereichs beim nächsten Deploy zerstört hätte (unabhängig von dieser
  Funktion – jeder künftige Deploy war betroffen). `tools/deploy.sh`: fehlenden
  `--exclude 'redaktion/.htpasswd'` ergänzt, mit erneutem Trockenlauf bestätigt.

### Gelöst während der Umsetzung: MultiViews-Kollision → Adressform `/beitrag/<slug>`
* **Fund bei der Live-Verifikation:** Die zuerst gewählte Adressform
  `/aktuelles/<slug>` lieferte live **404**, egal ob die Beitragsseite in
  `daten/beitragsseiten/` existierte oder nicht. Ursache: Apache-Inhalts-
  verhandlung (`MultiViews`, erkennbar am `Vary: negotiate`-Header) fängt jede
  Anfrage, deren erster Pfadabschnitt zu einer vorhandenen Datei passt (hier
  `aktuelles.html`), **vor** den eigenen `.htaccess`-Regeln ab und lehnt einen
  zusätzlichen Pfadanteil dahinter ab. Kein neuer Fehler dieser Funktion –
  betrifft nachweislich jede bestehende Seite (`/leistungen/irgendwas`,
  `/kontakt/irgendwas` 404en identisch), nur durch die neue verschachtelte
  Adresse erstmals sichtbar. `Options -MultiViews` in der `.htaccess` schied
  aus: auf der Testadresse (`/2026/`) einwandfrei, auf der echten Domain aber
  **500-Fehler** (Wechselwirkung mit der vHost-Konfiguration, ohne Root-Zugriff
  nicht sicher zu diagnostizieren) – sofort rückgängig gemacht.
* **Lösung (mit dem Kunden abgestimmt):** Adressform der Einzelbeiträge von
  `/aktuelles/<slug>` auf **`/beitrag/<slug>`** umgestellt. Es gibt keine Datei
  `beitrag.html`, darum greift MultiViews nicht und die Umschreibe-Regel
  funktioniert. Belegt durch die Live-Messung `curl /voellig-neu/irgendwas`
  → 200 (Präfix ohne existierende Datei kommt durch), während `/aktuelles/…`,
  `/leistungen/…` 404en. Die Beitragsseite bleibt weiterhin sicher in `daten/`
  (kein Deploy-`--delete`-Risiko). Geändert: `.htaccess`-Regel 2b, die vier
  URL-Bildungsstellen in `redaktion/index.php` und die drei Routing-Stellen in
  `app.js` (`seiteAusAdresse`, `beitragsSlugAusPfad`, `umschalten`).

### Erster echter Beitrag ist live
* **„E-Rechnungspflicht 2025–2028: Der Fahrplan für Unternehmen"** ist unter
  **https://nsbb.de/beitrag/e-rechnungspflicht** veröffentlicht (Kategorie
  Digitalisierung, Autor „Maximilian Siebert, M.Sc.", Datum 2026-07-24). Inhalt
  aus der gelieferten `.md` aufbereitet (SEO-Kommentar, H1 und das jetzt
  redundante manuelle „## Inhalt" entfernt; Autor-Platzhalter gesetzt).
* Angelegt **über die echte `redaktion/index.php`**, angefahren via kurzlebigem
  `php -S` auf `127.0.0.1` des Servers (dort greift die eingebaute
  `cli-server`-Ausnahme des Wächters – kein Basic-Auth-Passwort nötig, das ich
  ohnehin nicht im Zugriff habe). So lief exakt der Produktivpfad: OG-Bild-
  Zuschnitt, Beitragsseite, Sitemap. Der Edit-Pfad wurde beim ?v-Nachziehen
  ebenfalls einmal live durchlaufen (Bild/OG-Bild bleiben bei Edit ohne neues
  Bild korrekt erhalten).
* **Live verifiziert:** `/beitrag/e-rechnungspflicht` → 200; `<title>`,
  `canonical`, `og:type=article`, `og:url`, `og:title` korrekt; **`og:image`
  ist das beitragseigene 1200×630-JPG** (nicht das allgemeine), erreichbar;
  JSON-LD BlogPosting **und** FAQPage (4 Fragen) eingebettet; im Browser
  rendern Inhaltsverzeichnis (8 Sprungmarken), Überschriften, Liste, Tabelle
  (15 Zellen), Fett/Kursiv und alle drei internen Links (`/digital`,
  `/kontakt`, `/leistungen-unternehmen`); `beitraege-sitemap.xml` + zweite
  `robots.txt`-Sitemap-Zeile live erreichbar.

### Offen / Achtung
* **Bild-Rohdatei:** Das gelieferte `nsbb_erechnung_header.png` war bereits
  exakt 1200×630 – der OG-Zuschnitt war also verlustfrei. Künftige
  Beitragsbilder am besten ebenfalls in **1200×630** liefern (siehe Hinweis an
  den Kunden), dann bleibt der automatische Mittenzuschnitt folgenlos.
* **Bereits erledigt:** `php -l redaktion/index.php` auf dem Server – fehlerfrei.
  `tools/deploy.sh` um den fehlenden `--exclude 'redaktion/.htpasswd'` ergänzt
  (s. o.), damit ein künftiger Deploy den Zugangsschutz nicht löscht.
* Betrifft nicht den offenen Punkt „FAQ ausbauen" in `TODO.md` (Zeile 139) –
  das dort ist eine site-weite FAQ-Seite/-Erweiterung, hier geht es um
  automatisch aus dem Beitragstext erzeugte FAQ-Strukturdaten je Beitrag.

---

## [2026-07-24] Redaktionsschutz: echte Apache-Sperre ist Pflicht (PHP-Wächter allein genügt nicht)

**Bearbeiter:** Claude (Claude Code, Opus 4.8)

Beim Vorbereiten der Umstellung auf den **KAS-Verzeichnisschutz** kam eine
wichtige Erkenntnis zutage: Der PHP-Fail-closed-Wächter in `redaktion/index.php`
ist **allein kein Schutz**. PHP füllt `PHP_AUTH_USER` selbst aus dem rohen
`Authorization`-Header – ohne serverseitige Prüfung. Nach dem (versuchsweisen)
Entfernen meiner Apache-Sperre war `/redaktion/` daher mit einem **beliebigen**
Auth-Header erreichbar. **Sofort behoben** – Apache-Sperre wiederhergestellt.

**Folgerung:** Der Redaktionsbereich braucht IMMER eine echte
Verzeichnis-Sperre (Apache Basic Auth, prüft Passwörter gegen die `.htpasswd`) –
entweder die per SSH gesetzte oder den KAS-Verzeichnisschutz. Der PHP-Wächter
bleibt nur als Tripwire (Defense-in-Depth) HINTER der echten Sperre.

Änderungen:
* `redaktion/index.php`: Wächter prüft nur von Apache **validierte** Variablen
  (`REMOTE_USER` / `PHP_AUTH_USER` / `REDIRECT_REMOTE_USER`); der rohe
  `HTTP_AUTHORIZATION` wird bewusst NICHT geprüft.
* Wurzel-`.htaccess`: `DirectoryIndex` um `index.php` erweitert, damit
  `/redaktion/` auch dann auflöst, wenn KAS die `redaktion/.htaccess` verwaltet.
* `tools/deploy.sh`: `redaktion/.htaccess` vom rsync **ausgeschlossen** – der
  Verzeichnisschutz darf beim Deploy nie überschrieben/gelöscht werden.
* `redaktion/.htaccess` aus dem Repo genommen (Server bzw. KAS verwaltet den Schutz).
* Interimsschutz auf dem Server wiederhergestellt, **neues Passwort** (das alte
  war während der Umstellung kurz ungeschützt), Benutzer `redaktion`.

**Geprüft:** Alle 301-Weiterleitungen (http/www/`steuerberatung`/`insights`/`.html`)
enden korrekt auf der Clean-URL. `/redaktion/`: ohne Auth 401, falsche Daten 401,
richtige Daten 200. Hauptseiten unverändert 200.

**Offen (Projektleitung/Kunde):** Entweder Interimsschutz behalten ODER
KAS-Verzeichnisschutz auf `NSBB-2026/redaktion` setzen und danach die interim
`.htpasswd` löschen lassen. Der Bereich muss dabei durchgehend gesperrt bleiben.

---

## [2026-07-22] Rubrik „Aktuelles" + Redaktionsbereich (Beiträge & Mandanteninfo-PDFs)

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · Kundenwunsch (ohne CMS)

Der Kunde pflegt jetzt **selbst** zwei Dinge: die monatliche
**Mandanteninformation** (PDF) und **Fachbeiträge**. Umsetzung nach
`dokumente/Redaktionsbereich-Konzept.md`, **„Weg 1"** (Verzeichnisschutz über den
Hoster, kein Eigenbau-Login). Damit sind die offenen Punkte „Insights-Seite leer"
(TODO) und „Redaktionsbereich / Adminzugang" (ROADMAP) **erledigt**.

**Prinzip:** Inhalte liegen als JSON/Dateien in `daten/` auf dem Server; die
öffentliche Seite lädt sie zur Laufzeit → neue Inhalte erscheinen **ohne Redeploy**.

**Seite (frühere „Insights" → „Aktuelles"):**
* `assets/js/app.js`: Route `insights` → **`aktuelles`** überall umbenannt
  (`validPages`, pages-Map, `pageTitles` DE/EN, Navigation wieder eingeblendet,
  Footer-Liste ergänzt). `InsightsPage` durch **`AktuellesPage`** ersetzt: oben
  die aktuelle Mandanteninformation als Button (PDF im neuen Tab) + Archiv,
  darunter die Beiträge als Karten mit **Aufklappen an Ort und Stelle** und
  Deeplink `#beitrag-<id>`. Die alte Redaktions-Attrappe (Klartext-Passwort im
  Browser) ist restlos entfernt – laut Konzept darf sie nie zurückkehren.
* Datum über feste deutsche Monatsnamen (keine Zeitzonen-Falle); Bilder als
  `<img>` mit `width`/`height`/`alt` aus dem JSON (kein Layout-Sprung, Regel E2);
  in der EN-Ansicht Hinweis „Beiträge erscheinen auf Deutsch".
* Lademarker `data-nsbb-laedt` am Wurzel-Element; `tools/vorrendern.js` wartet
  darauf (sonst entstünde die Momentaufnahme vor dem Laden der Daten).

**Redaktionsbereich `redaktion/` (neu, eine PHP-Datei, Muster wie contact.php):**
* Zugang regelt **Apache Basic Auth** (`redaktion/.htaccess`), Passwortdatei
  **außerhalb** des Docroots (`/www/htdocs/w01f9274/.nsbb-redaktion.htpasswd`,
  bcrypt). PHP macht KEINEN Passwortvergleich; zusätzlicher Fail-closed-Wächter.
* CSRF-Token je POST, atomare JSON-Schreibvorgänge (Sperrdatei + tmp/rename),
  Sicherungskopien in `daten/backup/`. Upload-Prüfung per **finfo-Magic-Bytes**
  + `getimagesize`; mit GD werden Bilder auf ≤1600 px verkleinert und als WebP
  neu kodiert (entfernt EXIF). PDF-Prüfung (`%PDF-` + finfo).

**Server-Ablage `daten/`** (gitignoriert, gehört dem Server): `beitraege.json`,
`mandanteninfo.json`, `bilder/`, `mandanteninfo/`, `backup/`.

**`.htaccess` (Wurzel):** 301 `^insights/?$ → /aktuelles`; `daten|redaktion` in
die SPA-Ausnahme (ehrliche 404); `application/json` + `FilesMatch \.json$` auf
**no-cache** (Manifeste sofort frisch); `RedirectMatch 404 ^/daten/backup`.

**Werkzeuge:** `tools/deploy.sh` schließt `daten/` vom `rsync --delete` aus
(sonst würden Kundeninhalte gelöscht) + Nachkontrolle; `upload-paket.sh` /
`staging-paket.sh` nehmen `redaktion/` (nicht `daten/`) ins Paket; neues
`tools/daten-holen.sh` (Server-`daten/` → lokal, für frische Momentaufnahmen);
`seiten-generator.js` Beschreibung `aktuelles`; `robots.txt` (`Disallow
/redaktion/`), `llms.txt` (Aktuelles ergänzt), `.gitignore` (`daten/`).

**⚠ Wichtige Server-Erkenntnis:** Die `.htpasswd` muss **für den Webserver
lesbar** sein (`chmod 644`), nicht 600 – sonst kann der Apache-Prozess (Gruppe
www-data) sie bei der Prüfung nicht lesen und liefert bei KORREKTEN Zugangsdaten
einen **500** (ohne Zugangsdaten kommt trotzdem die 401-Abfrage). Der bcrypt-Hash
darf lesbar sein; die Datei liegt außerhalb des Docroots.

**Geprüft:** `node --check` · `php -l` (Server, PHP 8.3) · lokal im Browser
(beide Abschnitte, Filter, Aufklappen, Deeplink, Bildmaße) · Vorrendern (41
Seiten inkl. `aktuelles`, Momentaufnahme = Leerzustand, kein `data-nsbb-laedt`).
**Auf dem Server** in isolierter Testinstanz voll durchgetestet (Basic Auth,
Upload Beitrag+Bild+PDF, JPEG→WebP, JSON, öffentliche Anzeige), danach **live**
nach `NSBB-2026/`: Kernseiten 200, `/insights`→301→`/aktuelles`, Redaktion
401/200, Systemcheck (GD aktiv, `daten/` beschreibbar), JSON no-cache,
`daten/backup` 404, Sitemap/robots korrekt, `daten/` startet leer.
`?v` in `index.html` auf `20260724`.

**Toter Code gemeldet (nicht angefasst):** In der Home-Seite (`app.js` ~623)
`const insights = t.insightsPosts.map(...)` – wird nirgends gerendert; die
zugehörigen `insights*`-Textschlüssel im T-Objekt bleiben deshalb bestehen.

**Zugang** (separat/vertraulich an den Kunden): Benutzer `redaktion` unter
`https://nsbb.de/redaktion/`. Ändern jederzeit mit
`htpasswd -B /www/htdocs/w01f9274/.nsbb-redaktion.htpasswd redaktion`.

---

## [2026-07-21] .htaccess: 301 von /steuerberatung/ auf /leistungen

**Bearbeiter:** Claude (Claude Code, Opus 4.8)

Nach dem Relaunch existiert die alte WordPress-URL `/steuerberatung/` nicht mehr;
sie fiel über die SPA-Regel als Notbehelf auf die Startseite. **Alle aktiven
Google-Ads-Anzeigen** des NSBB-Kontos zeigten aber genau dorthin (themen-
unabhängig). Damit die bezahlten Klicks auf einer relevanten Seite landen, leitet
`.htaccess` `/steuerberatung/` jetzt dauerhaft (301) auf `/leistungen` (neutraler
Leistungs-Hub). Auch fürs SEO sinnvoll (Weitergabe alter Linkkraft).

* Regel steht VOR den Seitenadressen-Regeln, direkt nach der www-Entfernung.
* Message-Match je Anzeigengruppe (spezifische Ziel-URLs) folgt separat – eine
  bestehende RSA ist unveränderlich, dafür müssten neue Anzeigen angelegt werden.

**Geprüft:** `curl -I https://nsbb.de/steuerberatung/` → 301 auf `/leistungen`;
`.htaccess` nach `NSBB-2026/` deployt.

---

## [2026-07-21] Conversion-Tracking: dataLayer-Signal bei Formularerfolg

**Bearbeiter:** Claude (Claude Code, Opus 4.8)

Grundlage für Google-Ads-Conversion-Tracking (die NSBB-Kampagnen hatten bislang
0 Conversions). Die SPA wechselt beim Absenden nicht die URL – daher wird bei
bestätigtem Erfolg ein Ereignis ins `dataLayer` geschoben, das der bereits
eingebundene Google Tag Manager (`GTM-NNQTHD76`) auswerten kann.

* `assets/js/app.js`, Kontaktformular (Erfolgszweig nach `contact.php`):
  `dataLayer.push({ event:'generate_lead', formular:'kontakt' })`.
* `assets/js/app.js`, Karriereformular (Erfolgszweig): dasselbe mit
  `formular:'karriere'`.
* Feuert **nur** nach serverseitig bestätigtem `success:true`, in `try/catch`
  gekapselt. GTM wertet es – über den Consent-Banner (Consent Mode v2) – erst
  nach erteilter Marketing-Einwilligung aus. Kein neuer externer Dienst im Code.
* Offen (in den Google-Konten, nicht im Code): Conversion-Aktionen anlegen und
  GTM-Trigger `generate_lead` + `tel:`-Klick auf die Ads-Conversion mappen.
* `?v` in `index.html` auf `20260723` erhöht; neu vorgerendert (41 Seiten).

**Geprüft:** `node --check` ok · Aktualitäts-Wächter „aktuell & vollständig" (41)
· Seiten neu erzeugt · Deploy nach `NSBB-2026/` + Live-Kontrolle auf nsbb.de.

---

## [2026-07-21] Favicon: grünes Kugel-Emblem aus dem Logo

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · Kundenwunsch

Das Favicon (Symbol im Browser-Tab) war ein grünes Quadrat mit weißem „N". Auf
Wunsch zeigt es jetzt das **grüne Kugel-/Globus-Emblem aus dem NSBB-Logo**.

* Emblem **verlustfrei aus `_source/images/logo-nav.png` freigestellt** (der
  Ball-Bereich), auf eine quadratische, transparente Fläche zentriert.
* Farbe exakt wie im Logo: flaches Mintgrün **#98D0C6**; die Segment-Trennlinien
  sind – wie im Original – transparente Lücken (kein Weiß).
* Als **64-px-PNG inline (Data-URI, ~2,3 KB)** in `index.html` hinterlegt –
  gleiche Bauweise wie zuvor (kein externer Request, self-contained).
* Über `tools/seiten-generator.js` auf **alle 41 Seiten in `build/`** übernommen.

**Geändert:** `index.html` (Zeile `<link rel="icon">`), dadurch alle `build/*.html`.

**Geprüft:** Favicon in 16/32/64 px auf hellem und dunklem Tab-Grund gesichtet
(liest sich als Kugel-Emblem); `grep` bestätigt 41/41 Seiten mit neuem
PNG-Favicon, 0 mit altem SVG. Kein `app.js`-Eingriff → kein `?v`-Hochzählen nötig
(Favicon steckt inline im HTML, nicht in einer gecachten Asset-Datei).

**Deployt:** am 2026-07-21 per rsync nach `/www/htdocs/w01f9274/NSBB-2026/`
(41 HTML-Dateien aktualisiert, keine Löschungen, `.formlimit` ausgenommen).
Live geprüft: `https://nsbb.de/` und Unterseiten liefern das PNG-Favicon aus.
Dabei `tools/deploy.conf` korrigiert: `ZIEL_LIVE` zeigt jetzt auf `NSBB-2026`
(bis zum Relaunch stand dort der alte WordPress-Pfad).

---

## [2026-07-21] LIVEGANG – nsbb.de zeigt auf die neue Seite

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO I1

Der Kunde hat SPF gesetzt und die Postfächer (`mail@`, `mandant@`, `karriere@`)
angelegt. Danach:

* **Live-Fassung (Basis „/")** mit `tools/upload-paket.sh` gebaut und per rsync in
  einen **neuen Ordner `/www/htdocs/w01f9274/NSBB-2026/`** gelegt – **neben** dem
  WordPress-Ordner (`…/nsbb.de/`), der dabei **unberührt** blieb (Rechte 755/644).
* Der Kunde hat im KAS die Domain `nsbb.de` von `nsbb.de` auf `NSBB-2026`
  umgestellt. Damit ist die neue Seite live.

**Vorteil dieses Weges:** WordPress wurde nicht angefasst → sofortiger Rückweg
möglich (im KAS die Domain einfach wieder auf `nsbb.de` zeigen lassen). Kein
Löschen der 2,1-GB-WordPress-Installation nötig.

### Live geprüft (`https://nsbb.de/`)

| | Ergebnis |
|---|---|
| Neue Seite statt WordPress | ✓ `app-base "/"`, `?v=20260722`, 0 WordPress-Marker, 0,34 s |
| `http://` + `www.` → `https://nsbb.de/` | ✓ 301 |
| Clean URLs + vorgerenderter Inhalt | ✓ (z. B. Kontakt 1834 Zeichen, Wegzug 3332) |
| Maps `NSBB Steuerberatung Berlin/Köln`, Footer-Fix, Digital-Titel | ✓ live |
| Strukturierte Daten (Org, Person 4×, FAQPage), `llms.txt` | ✓ |
| Formular-Endpoint `contact.php` | ✓ `success:true` |
| robots (kein noindex), `sitemap.xml` (41 URLs) | ✓ |
| WordPress-Ordner | ✓ unberührt |

**Offen (Kunde):** eine echte Formular-Absendung, um die **Zustellung** in die
Postfächer (`mandant@` / `karriere@`) zu bestätigen; danach Sitemap in der Google
Search Console einreichen.

---

## [2026-07-21] Kontaktformular-Empfänger: info@ → mandant@nsbb.de

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · Kundenwunsch

Das **allgemeine** Kontaktformular geht jetzt an **`mandant@nsbb.de`** statt
`info@nsbb.de` (`contact.php`, `EMPFAENGER['standard']`). Das Bewerbungsformular
bleibt bei `karriere@nsbb.de`. Nur `contact.php` betroffen – kein `app.js`, also
kein Vorrendern/`?v`.

* Wirkt sich auch auf die zwei Nutzer-Hinweise bei Fehlern aus (Rate-Limit /
  Versand fehlgeschlagen: „bitte direkt an … schreiben") – die nennen jetzt
  konsistent `mandant@nsbb.de`.
* Die **sichtbare** Kontaktadresse auf der Seite (Footer, Kontaktseite, JSON-LD)
  bleibt `info@nsbb.de` – es wurde nur der Formular-Empfänger geändert.
* Voraussetzung für die Zustellung: `mandant@nsbb.de` muss (wie info@) als echtes
  Postfach/Alias bei DATEV existieren (Kunde/A2).

---

## [2026-07-21] Kundenkorrekturen: Kontakttext, Footer, Maps, Digital-Seite

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · Rückmeldung des Kunden (Mobil + Desktop)

Vier gemeldete Korrekturen, alle in `assets/js/app.js`:

1. **Kontaktformular-Bestätigung** (`app.js:3646`): Der Erfolgstext stammte noch
   aus der `mailto:`-Zeit („… Bitte senden Sie die geöffnete E-Mail ab."). Seit H1
   sendet das Formular echt über `contact.php`. Neu: „Ihre Anfrage ist bei uns
   eingegangen. Wir melden uns schnellstmöglich bei Ihnen." (DE) bzw. „We have
   received your enquiry and will get back to you as soon as possible." (EN).
2. **Footer „Cookie-Einstellungen" verzogen** (`app.js:530`): Der `<button>` saß
   gegenüber den Impressum/Datenschutz-`<a>`s versetzt, weil dem inneren Flex-
   Container `align-items` fehlte (und beim Umbruch auf Mobil auffiel). Ergänzt:
   `alignItems:'center'`, `flexWrap:'wrap'`, Zeilen-Gap (`gap:'8px 16px'`).
3. **Maps „Route planen"** (`app.js:3828–3830`): Query von der reinen Adresse auf
   `NSBB+Steuerberatung+Berlin` bzw. `…+K%C3%B6ln` umgestellt – der Link landet
   jetzt auf dem NSBB-Objekt statt auf einem anonymen Adresspunkt. Darstellung
   („Route planen · in Google Maps öffnen") und `aria-label` unverändert.
4. **Digitale-Kanzlei-Überschriften auf Mobil** (`app.js:2654`, `2713`): Beide
   `<h2>` hatten inline `whiteSpace:'nowrap'` → die langen deutschen Titel wurden
   auf schmalen Screens abgeschnitten. `nowrap` entfernt; die `clamp()`-Schriftgröße
   skaliert weiter. *Nicht angefasst:* die dritte Digital-Überschrift („In drei
   Schritten zu digitaler Zusammenarbeit.", `app.js:2732`) – die bricht bewusst per
   `<br>` in zwei Zeilen um und wurde vom Kunden nicht bemängelt.

`node --check` fehlerfrei; `app.js` geändert → `?v=20260722` + neu vorgerendert
(Guard „aktuell", 41/41). Geprüft auf `nsbb.de/2026`.

**Geändert:** `assets/js/app.js` (4 Stellen), `index.html` (`?v`),
Vorrender-Cache + `build/` (neu erzeugt).

---

## [2026-07-20] Aufräumen: erzeugte Seiten wandern nach build/

**Bearbeiter:** Claude (Claude Code, Opus 4.8)

Der Wurzelordner war mit **40 erzeugten `<slug>.html`-Dateien** vollgestellt (alles
Build-Artefakte, ohnehin git-ignoriert). Diese landen jetzt in einem eigenen
Ordner **`build/`**. Der Wurzelordner enthält an HTML nur noch die Vorlage
`index.html`.

**Wichtig – die Adressen ändern sich NICHT.** Die flache Struktur (`/kontakt`
statt `/kontakt/`) bleibt: Die Paket-Skripte legen den `build/`-Inhalt **flach**
ins Server-Wurzelverzeichnis. Verifiziert: Im Test-ZIP liegen alle 41 Seiten flach
im Wurzel (kein `build/`-Unterordner), Trockenlauf gegen den Testserver zeigt
**null Unterschiede** zur bisherigen Auslieferung.

**Angenehmer Nebeneffekt:** `tools/seiten-generator.js` überschreibt die
Wurzel-`index.html` nicht mehr (schreibt `build/index.html`). Damit entfällt das
bisherige **„index.html vor dem Commit auf die Vorlage zurücksetzen"** – die
Wurzel-`index.html` bleibt dauerhaft die reine Vorlage.

* `sitemap.xml` bleibt bewusst im Wurzelordner (getrackt, siehe CLAUDE.md-Regel 8)
  – nur die vielen HTML-Seiten sind umgezogen.
* **Geändert:** `tools/seiten-generator.js` (Ausgabe → `build/`),
  `tools/staging-paket.sh` + `tools/upload-paket.sh` (sammeln aus `build/`,
  Paket bleibt flach), `.gitignore` (40 Einzel-Einträge → `/build/`), `README.md`.
  `node --check` / `bash -n` fehlerfrei; Test-Paketbau + Trockenlauf geprüft.

---

## [2026-07-20] A1 geklärt: SPF-Weg festgelegt + Kunden-Anleitung (PDF)

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO A1

Entscheidung (Kunde): Der Formularversand wird **über einen SPF-Eintrag** gelöst,
nicht über eine fremde Absenderdomain – so bleibt alles unter `nsbb.de`/DATEV.

Per DNS-Abfrage geklärt (wichtig, weil hier Annahmen kursierten):
* **Mail-Empfang** von nsbb.de liegt bei **DATEV** (MX `maildomain.datevnet.de`).
* **DNS-Zone** (und damit der SPF-Eintrag) liegt bei **1&1 / IONOS**
  (Nameserver `*.ui-dns.*`, SOA `1and1.com`) – **nicht** bei DATEV. Dort wird
  also geändert.
* Aktueller SPF: `v=spf1 include:maildomain._spf.datev.de ~all` (nur DATEV).
* Der oft genannte Include `_spf.kasserver.com` **existiert nicht** (DNS leer).
  Korrekt ist **`include:kasserver.com`** (dessen SPF listet u. a.
  `ip4:85.13.128.0/18`). Der Website-Server `w01f9274.kasserver.com` hat
  IP `85.13.162.222` – liegt in diesem Bereich, ist also abgedeckt. Verifiziert.
* Ziel-SPF: `v=spf1 include:maildomain._spf.datev.de include:kasserver.com ~all`.

**Neu:** `dokumente/Anleitung_SPF-Eintrag_nsbb.pdf` – ausführliche, einfache
Schritt-für-Schritt-Anleitung für den Kunden (was genau geändert wird, dass es
bei 1&1/IONOS passiert, Fallstricke, Prüfung, Rückgängigmachen). 3 Seiten, aus
HTML via Chrome erzeugt. Die eigentliche DNS-Änderung + der Zustelltest bleiben
beim Kunden/PL (A1).

---

## [2026-07-20] F2 Teil 2: FAQPage-Auszeichnung + echte interne Verlinkung

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO F2 (Vertiefung)

### FAQPage-Auszeichnung (maschinenlesbare Frage-Antwort-Paare)

12 Seiten haben Frage-Antwort-Bereiche (die FAQ-Seite und die Themenseiten zu
Wegzug, DBA, Grenzgänger, Erbschaft usw.). Diese sind jetzt als
**schema.org/FAQPage** ausgezeichnet – Suchmaschinen und KI-Systeme lesen die
Q&A-Paare direkt strukturiert.

Technisch sauber über die bestehende Vorrender-Strecke, **eine Datenquelle**:
* Neuer Hook `useFaqSchema(faqs)` in `app.js` hängt für die aktuelle Seite ein
  `<script type="application/ld+json">` (FAQPage) in den `<head>` – gespeist aus
  den FAQ-Daten der jeweiligen Seite (kein zweiter Datensatz). In allen 12
  FAQ-Komponenten aufgerufen.
* `tools/vorrendern.js` greift dieses Script beim Vorrendern ab und legt es als
  `<slug>.faq.json` im Cache ab; `tools/seiten-generator.js` setzt es in den
  statischen `<head>` – so steht die Auszeichnung **auch ohne JavaScript** im
  Roh-HTML (für Crawler, die kein JS ausführen). Gleiche `id` wie im Hook, damit
  die Anwendung zur Laufzeit genau diesen Block ersetzt statt zu duplizieren.

*Hinweis zur Einordnung:* Googles **sichtbare** FAQ-Rich-Results sind seit 2023
auf Behörden-/Gesundheitsseiten beschränkt. Der Nutzen liegt daher vor allem bei
**KI-Systemen** (ChatGPT, Perplexity, AI Overviews), **Bing** und dem allgemeinen
maschinellen Verständnis der Inhalte – nicht in aufklappbaren Google-Kästen.

### Echte interne Verlinkung (Footer)

Die Hauptnavigation nutzt aufklappbare Menüs (Buttons) – die sind im
vorgerenderten HTML **zu**, ihre Unterlinks also für Crawler nicht sichtbar.
Deshalb im **Footer** eine echte Navigations-Linkleiste ergänzt: `<a href>` zu
allen Hauptseiten (Unternehmen, International, Privat, Digitale Kanzlei, Über uns,
Karriere, Kanzleinachfolge, TGS, Kontakt) plus die bereits vorhandenen
FAQ-/Impressum-/Datenschutz-Verweise auf echte Links umgestellt.

Die Links stehen **fest im Roh-HTML** (Crawler folgen ihnen, Besucher ohne JS
nutzen sie), lösen mit JavaScript aber die normale SPA-Navigation aus (kein
Neuladen). „Cookie-Einstellungen" bleibt bewusst ein Button (Aktion, keine Seite).

### Geprüft (Testserver `nsbb.de/2026`)

| Prüfung | Ergebnis |
|---|---|
| FAQPage im statischen `<head>` (z. B. intl-wegzug) | vorhanden, 5 Fragen, valides JSON |
| FAQPage zur Laufzeit (nach JS) | **genau 1** Block (kein Duplikat) |
| Footer-Links im Roh-HTML | 12 interne `<a href>`, Basis korrekt (`/2026/…`) |
| Footer-Link-Klick | SPA-Navigation ohne Neuladen, Titel/H1 wechseln |
| Konsole | 0 Fehler |
| Vorrendern | 41/41, davon 12 mit FAQ-Auszeichnung |

`node --check` fehlerfrei; `app.js` geändert → `?v=20260721` + neu vorgerendert,
Guard bestätigt aktuell.

**Geändert:** `assets/js/app.js` (Hook `useFaqSchema` + 12 Aufrufe, Footer-
Linkleiste + Umstellung auf `<a>`), `tools/vorrendern.js` (FAQ abgreifen),
`tools/seiten-generator.js` (FAQ in `<head>` einsetzen), `index.html` (`?v`),
Vorrender-Cache (Snapshots + 12 `.faq.json` + Manifest).

---

## [2026-07-20] H1 Technische Restpunkte (Bewerbung, Datei-Upload, Anfragenummer, toter Code)

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO H1

### Richtigstellung eines früheren Fund-Verdachts

In einer vorherigen Analyse hieß es, „das Bewerbungsformular versendet nichts,
meldet aber Erfolg". Das betraf die Komponente **`KarriereBewerbungsform`** –
die sich beim genaueren Hinsehen als **toter Code** herausstellte: **nirgends
gerendert** (0 Verwendungen). Das **tatsächlich genutzte** Formular ist
**`KarriereForm`** (auf allen fünf Karriere-Unterseiten) und dieses **hat schon
immer korrekt an `contact.php` gesendet**. Es gab also **keinen Datenverlust**
bei echten Bewerbungen. Der irreführende tote Code wurde entfernt (80 Zeilen).

### Datei-Upload für Bewerbungen (der eigentliche H1-Punkt)

`KarriereForm` konnte bisher keinen Lebenslauf anhängen. Jetzt:

* **Formular** (`app.js`): optionales Datei-Feld (PDF, DOC, DOCX, JPG, PNG,
  max. 5 MB) mit Größenprüfung; Versand als `FormData` (multipart) statt JSON,
  plus ein Honeypot gegen Bots (hatte das Karriereformular vorher nicht).
* **Server** (`contact.php`): nimmt jetzt **multipart** UND JSON an; prüft die
  Datei (Endung-Whitelist, Größe, `is_uploaded_file`), säubert den Dateinamen
  und hängt sie als **MIME-`multipart/mixed`** an die Mail an die Kanzlei an.
  Das Kontaktformular (JSON) bleibt unverändert.

### Anfragenummer serverseitig

Die fortlaufende Nummer wurde bisher **pro Browser** im `localStorage` gezählt –
zwei Interessenten sendeten so beide „Anfrage #1". Jetzt vergibt **`contact.php`**
die Nummer (dateibasierter Zähler mit `flock`), kanzleiweit eindeutig, und stellt
sie in Betreff und Text der Kanzlei-Mail. Der Client-Zähler (`getNextNr`) wurde
entfernt.

### Zurückgestellt

* **Portal-Umweg** (`app.js`, eigener `createRoot` statt `createPortal`): rein
  interne Aufräumarbeit ohne sichtbaren Effekt. Genau daran hängen die in E1
  frisch geprüften Dinge (Fokus-Falle im Menü, `role="dialog"`), daher
  **Regressionsrisiko > Nutzen** – bewusst nicht angefasst.

### Geprüft (Testserver `nsbb.de/2026`, ohne echte Mails zu versenden)

Getestet über den Honeypot (kurzschließt auf Erfolg **vor** dem Versand) und über
Validierungsfehler (brechen **vor** dem Versand ab) – es ging **keine Testmail**
an die Kanzlei-Postfächer. Der echte Zustell-Test bleibt A1 (Projektleitung).

| Prüfung | Ergebnis |
|---|---|
| Multipart-Parsing + PHP-Syntax | `{success:true}` (Honeypot), kein 500 |
| E-Mail-Validierung | ungültige Adresse → HTTP 422 |
| Datei-Validierung | `.txt` (nicht erlaubt) → HTTP 422 „Dateiformat nicht erlaubt" |
| JSON-Pfad (Kontaktformular) | weiterhin `{success:true}` |
| Formular im Browser | Datei-Feld + Honeypot da, 1× Header (saubere Übernahme), 0 Konsolenfehler |

`node --check` fehlerfrei; `app.js` geändert → `?v=20260720z` + neu vorgerendert
(die Karriere-Snapshots enthalten jetzt das Datei-Feld), Guard bestätigt aktuell.
`tools/staging-paket.sh` an die neue Betreffzeile angepasst.

**Geändert:** `assets/js/app.js` (KarriereForm + Datei-Upload + Honeypot,
Client-Anfragenummer entfernt, toter Code entfernt), `contact.php` (multipart +
Anhang + Anfragenummer), `index.html` (`?v`), `tools/staging-paket.sh`,
Vorrender-Cache (5 Karriereseiten + Manifest).

---

## [2026-07-20] F2 GEO/KI-Maßnahmen (Teil 1)

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO F2

Aufbauend auf F1 (Vorrendern) drei maschinenlesbare Signale für Suchmaschinen und
KI-Systeme ergänzt – **ohne Änderung an `app.js`** (kein `?v`-Hochzählen, kein
erneutes Vorrendern nötig; alles betrifft den `<head>` bzw. neue Dateien).

### 1. Personen-Auszeichnung auf „Über uns" (`schema.org/Person`)

Der `tools/seiten-generator.js` erzeugt für `/ueber-uns` einen zusätzlichen
`ld+json`-Block mit den vier Kanzlei-Personen (Name, Position, Standort,
Verknüpfung zur Organisation über `worksFor`). Quelle ist das `team`-Array in
`app.js` – kein zweiter Datensatz. **Fail-safe:** Werden weniger als zwei
Personen erkannt, wird gar nichts ausgegeben (fehlerhafte Auszeichnung ist
schlechter als keine). Belegt Fachautorschaft/Vertrauen (E-E-A-T) – bei Finanz-
und Rechtsthemen ein starkes Signal.

### 2. Organisation angereichert (`knowsAbout`, `slogan`)

Der zentrale `@graph` in `index.html` (gilt für alle Seiten) nennt jetzt neun
Kompetenzfelder (`knowsAbout`: Wegzugsbesteuerung, DBA, internationales
Steuerrecht, Erbschaft/Schenkung mit Auslandsbezug, Gestaltungsberatung,
Kanzleinachfolge, digitale Buchhaltung …) und den Slogan. Hilft KI-Systemen zu
verstehen, wofür die Kanzlei steht.

### 3. `llms.txt`

Neue Datei `llms.txt` (Wurzel, wird ausgeliefert): eine kompakte, aktuell
gehaltene Zusammenfassung der Kanzlei für KI-Systeme – Standorte, Öffnungszeiten,
Leistungen und **Kurzantworten zu den Schwerpunktthemen** (Wegzugsbesteuerung,
DBA, Grenzgänger, Erbschaft …) als klarer Text. Wachsende Konvention; deckt die
Themen-Q&A ab, solange die Seiten selbst noch keine `FAQPage`-Auszeichnung haben.
In `staging-paket.sh` + `upload-paket.sh` mit ins Paket aufgenommen.

### Geprüft

* 42 `ld+json`-Blöcke über alle 41 Seiten – **alle valides JSON** (Google straft
  fehlerhafte Auszeichnung ab).
* `/ueber-uns`: 4 Personen korrekt (Guido H. Siebert · Geschäftsführer · Berlin;
  Maximilian Siebert · Prokurist · Köln; Isabell Schramm · Prokuristin · Berlin;
  Hanna Richrath · Prokuristin · Köln).
* Startseite: `slogan` + 9 `knowsAbout`-Themen.

### Bewusst zurückgestellt (siehe TODO/Bericht)

* **`FAQPage`-Auszeichnung**: Die Frage-Antwort-Daten liegen verteilt in vielen
  Seiten-Komponenten; eine robuste Auszeichnung braucht die Abnahme des Inhalts
  zur Laufzeit (Erweiterung der Vorrender-Strecke) statt fragiler Textanalyse –
  eigener, sauber umzusetzender Schritt. Inhaltlich sind die Antworten über
  `llms.txt` bereits maschinenlesbar.
* **Echte interne Verlinkung** (`<a href>` statt `<button>` in der Navigation):
  breiter Eingriff in `app.js` + erneutes Vorrendern; als eigener Schritt sinnvoll.
* **KI-Crawler-Zugriff**: `robots.txt` erlaubt weiterhin alle (passt zum Ziel
  „KI-Sichtbarkeit"); ob `GPTBot`/`ClaudeBot` o. Ä. eingeschränkt werden, ist eine
  Geschäftsentscheidung des Kunden.

**Neu:** `llms.txt`. **Geändert:** `index.html` (Organisation angereichert),
`tools/seiten-generator.js` (Personen-Auszeichnung), `tools/staging-paket.sh`,
`tools/upload-paket.sh` (llms.txt ins Paket). `app.js` unverändert.

---

## [2026-07-20] F1 Vorrendern (Pre-Rendering, Stufe 2)

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO F1

### Problem

Die Anwendung baut ihren Inhalt erst im Browser per JavaScript auf. Das
ausgelieferte Roh-HTML enthielt nur den Ladebildschirm – rund 200 Zeichen
sichtbarer Text auf jeder der 41 Seiten. Google rendert JavaScript zwar, aber
verzögert; Bing, die Link-Vorschau (LinkedIn/WhatsApp) und vor allem KI-Crawler
(GPTBot, PerplexityBot, ClaudeBot) führen oft **gar kein** JavaScript aus und
sehen dann praktisch nichts. F1 war laut TODO die Voraussetzung für fast alle
GEO/KI-Maßnahmen (Abschnitt 5).

### Lösung: vorgerenderter Inhalt im Roh-HTML

Neues Werkzeug **`tools/vorrendern.js`** lädt jede Seite einmal in einem
kopflosen Google Chrome, lässt React fertig rendern und legt den erzeugten
`#root`-Inhalt in **`tools/prerender-cache/<slug>.html`** ab (plus
`manifest.json`). **`tools/seiten-generator.js`** setzt diesen Inhalt beim
Paketbau in jede Seite ein. Der volle Text steht damit schon im Roh-HTML –
ohne dass Besucher-Browser oder Crawler JavaScript ausführen müssen.

Ergebnis: pro Seite jetzt **ca. 900–11 000 Zeichen** sichtbarer Text im
Roh-HTML statt ~200 (z. B. Datenschutz 11 222, Startseite 4 577, DBA 3 369).

### Wie es funktioniert (bewusst ohne jede Fremd-Bibliothek – CLAUDE.md)

* **Kein Node-SSR möglich:** die `react-bundle.js` exportiert nur
  `createRoot`/`hydrateRoot`, kein `renderToString`. Also muss ein echter
  Browser rendern.
* **Lokaler Server** bildet die `.htaccess`-Adressen nach: `/leistungen` liefert
  den leeren Rumpf, die **Adresse bleibt** `/leistungen` (würde man
  `/leistungen.html` laden, ergäbe der Router „home", siehe app.js:5488).
* **Steuerung per DevTools-Protokoll (CDP)** über den Node-eigenen `WebSocket` –
  kein Puppeteer. Port wird aus `DevToolsActivePort` gelesen, nicht fest verdrahtet.
* **Vor dem Rendern** wird im `localStorage` Deutsch (`nsbb_lang=DE`) und
  „nur notwendige" Cookies hinterlegt. Das erzwingt die **deutsche (kanonische)**
  Fassung und blendet den **Cookie-Banner aus der Momentaufnahme** aus. (Google
  wird ohnehin nie geladen – GTM hängt an einer gespeicherten Einwilligung, die
  ein frisches Profil nie hat; im Test bestätigt: 0 Google-Requests.)
* **Fertig-Erkennung** wartet, bis Ladebildschirm weg, genug Text vorhanden,
  Textlänge stabil **und Titel + Sprache genau dieser Seite** stimmen. Sonst
  wird nichts geschrieben (kein falscher/leerer Inhalt).
* Vor der Aufnahme wird die Einblende-Klasse `.fade-up.visible` entfernt, damit
  die Momentaufnahme **deterministisch** ist und exakt dem entspricht, was React
  beim Übernehmen erneut rendert.

### Einbau ins Seiten-Gerüst (bewusst konservativ)

In `index.html` sitzen im `#root` zwei feste Marker `<!--SSR:START-->` /
`<!--SSR:END-->` **hinter** dem Ladebildschirm. Der Generator setzt den Snapshot
zwischen die Marker (idempotent, per Ersetzungs-**Funktion** wegen möglicher
`$`-Zeichen). Damit:

* **Besucher mit JavaScript** sehen unverändert den Ladebildschirm; die Anwendung
  (`createRoot`) räumt `#root` beim ersten Rendern leer und übernimmt – **kein
  sichtbarer Unterschied, kein Flackern.** Im Test bestätigt (home, leistungen,
  kontakt): nach der Übernahme genau **1×** Header/Footer/Main, `#root` hat genau
  1 Kind, Marker weg, **0 Konsolenfehler**, Cookie-Banner erscheint korrekt.
* **Crawler/KI** (kein JS) lesen den Text aus dem Quelltext.
* **Besucher ohne JavaScript** bekommen per `<noscript>` den Ladebildschirm
  ausgeblendet und `.fade-up` sichtbar geschaltet – sie sehen den Inhalt statt
  eines stehenden Spinners.

Bewusst **createRoot-Übernahme statt Hydration**: die Anwendung ist nicht
hydrations-sicher (Sprache aus `navigator`/`localStorage`, `Date.now`,
`key:page+lang`-Remount). `app.js` bleibt **unangetastet** – kein `?v`-Hochzählen
nötig.

### Basis-Pfad, Wiederholbarkeit, Aktualität

* Snapshot **einmal** unter Basis „/" aufgenommen. Die relativen Bildpfade
  (`assets/…`) werden vom Generator wie gehabt auf `/assets/` bzw. `/2026/assets/`
  umgeschrieben – **derselbe Cache** passt für Live und Test. Interne Navigations-
  Links sind `<button>`, keine `<a href>`, stehen also nicht im Snapshot (echte
  interne Verlinkung bleibt eine eigene Aufgabe, siehe TODO Abschnitt 2 / F2).
* `index.html` ist Vorlage **und** Startseite und wird als **saubere Vorlage**
  (leere Marker, Basis „/") eingecheckt; der Home-Inhalt liegt wie bei allen
  Seiten im Cache und wird beim Bauen eingesetzt.
* **`tools/vorrender-aktuell.js`** vergleicht den `app.js`-Hash im Manifest mit
  dem aktuellen Stand. `staging-paket.sh` und `upload-paket.sh` **brechen ab**,
  wenn der Cache veraltet ist – so kann kein alter Inhalt live gehen. Der
  Generator warnt zusätzlich.

### Ablauf bei Inhaltsänderungen

Nach inhaltlichen Änderungen an `app.js`:
`node tools/vorrendern.js` → `node tools/seiten-generator.js "/"`. (Chrome muss
installiert sein; Pfad notfalls über `CHROME_BIN`.)

### Geprüft

| | Ergebnis |
|---|---|
| 41/41 Seiten vorgerendert | 0 Fehler, 900–11 222 Zeichen Text |
| `createRoot`-Übernahme (home/leistungen/kontakt) | 1× Header/Footer/Main, 0 Duplikate, 0 Konsolenfehler |
| Cookie-Banner für echte Besucher | erscheint (Snapshot bleibt bannerfrei) |
| Google-Requests beim Vorrendern | 0 |
| Idempotenz Generator (2× Lauf) | Dateien identisch |
| Staleness-Guard | meldet „aktuell", bricht bei geändertem app.js ab |
| `node --check` aller Tools | fehlerfrei |

### Nachgehärtet nach adversarialer Code-Review

Eine Mehr-Perspektiven-Review des Werkzeugs fand zwei Lücken im **Sicherheitsnetz**
(nicht in der Website selbst) – beide behoben:

* **Fehlgeschlagene Seite hinterließ alten Stand.** Schlug beim erneuten
  Vorrendern eine einzelne Seite fehl, blieb ihre alte Momentaufnahme liegen,
  während das Manifest schon den neuen `app.js`-Stand vermerkte – der Wächter
  (nur Hash-Vergleich) hätte sie durchgewunken. Jetzt: der vollständige Lauf
  **leert den Cache zuerst**, jede Seite wird vor dem Rendern einzeln entfernt,
  und der **Generator setzt nur noch ein, was im Manifest steht** (Waisen-Dateien
  werden ignoriert). Eine fehlgeschlagene Seite hinterlässt damit nichts
  Veraltetes.
* **Wächter prüfte nur den Hash, nicht die Vollständigkeit.** Das Manifest wurde
  auch bei Teilfehlern geschrieben. Jetzt trägt ein vollständiger Lauf ein Flag
  `vollstaendig` und die Sollzahl `seitenErwartet`; `tools/vorrender-aktuell.js`
  **bricht ab**, wenn der Lauf unvollständig war oder die Seitenzahl nicht zu
  `validPages` passt. Teilläufe (mit Argumenten, nur zur Ansicht) fassen das
  Manifest nicht mehr an. Im Test bestätigt: Wächter meldet bei vollständigem
  Cache „ok", bei fehlender Seite Abbruch (Exit 1).
* **Kleinere Robustheit:** Prüfung auf Node ≥ 22 (globales `WebSocket`/`fetch`)
  mit klarer Meldung; Aufräumen des kopflosen Chrome auf allen Wegen
  (SIGTERM/SIGHUP/Ausnahmen, nicht nur SIGINT); CDP bricht bei Verbindungsabriss
  sofort ab statt bis zum Gesamt-Timeout zu hängen.
* **`<noscript>`-Hinweis korrigiert:** Der alte Text „Diese Website benötigt
  JavaScript" widersprach dem jetzt auch ohne JavaScript sichtbaren Inhalt. Neu:
  „Den Inhalt dieser Seite sehen Sie auch ohne JavaScript. Für Navigation und
  Formulare aktivieren Sie es bitte." Die direkten Kontaktdaten bleiben erhalten.

Als *False-Positive* eingestuft (bewusst nicht geändert): angeblicher
Path-Traversal im lokalen Vorrender-Server (bindet nur an 127.0.0.1, lädt
ausschließlich eigene Adressen) und das `--no-sandbox` von Chrome (lokales
Build-Werkzeug, lädt nur eigene, vertrauenswürdige Seiten).

**Neu:** `tools/vorrendern.js`, `tools/vorrender-aktuell.js`,
`tools/prerender-cache/` (41 Dateien + Manifest, wird mit eingecheckt, nicht
hochgeladen). **Geändert:** `tools/seiten-generator.js` (Einspielen +
Aktualitätswarnung), `tools/staging-paket.sh` + `tools/upload-paket.sh`
(Cache-Prüfung), `index.html` (Marker + `<noscript>`). `app.js` unverändert.

---

## [2026-07-20] E2 Bildmaße + E1 Barrierefreiheit

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO E2 + E1

### E2 – Bildmaße gegen Layout-Sprünge

`width`/`height`-Attribute an den beiden Logos (Nav 240×112, Footer 280×134).
Der Browser reserviert den Platz damit vor dem Laden – kein Nachspringen des
Layouts (Core Web Vital CLS).

Team- und Standortbilder brauchten nichts: Sie sind `position:absolute` mit
`width/height:100%` in Containern fester Höhe – der Container reserviert den
Platz bereits. Das Insights-Upload-Bild (variable Maße, deaktivierter Bereich)
bewusst ausgelassen.

### E1 – Barrierefreiheit

* **`aria-expanded`** (vorher 0 Treffer) an allen aufklappbaren Elementen:
  10 FAQ-Akkordeons, mobiles Untermenü, Desktop-Dropdown (mit `aria-haspopup`).
* **Fokus-Trap im mobilen Menü**: Solange es offen ist, bleibt der Tastaturfokus
  darin (Tab zykliert), Escape schließt, beim Öffnen springt der Fokus hinein.
* **`role="dialog"` + `aria-modal` + `aria-label`** an mobilem Menü,
  Team-Profil-Modal und Consent-Banner.

**Fund beim Testen:** Der Fokus-Trap griff zuerst nicht. Ursache: Das Menü
rendert über das Portal (eigener `createRoot`); beim Start des `useEffect` ist
das Panel-DOM noch nicht da, und der Effect brach bei `panelRef.current === null`
sofort ab. Behoben, indem `panelRef` erst **zur Laufzeit** (im Timer/Handler)
gelesen wird, nicht beim Effect-Start. Danach landet der Fokus zuverlässig im
Menü (im Browser bestätigt: 13 fokussierbare Elemente, Trap aktiv).

### Geprüft (Browser, Server)

| | Ergebnis |
|---|---|
| FAQ-Akkordeon `aria-expanded` | togglet false→true |
| Desktop-Dropdown | `aria-expanded` + `aria-haspopup` |
| Mobiles Menü | `role=dialog`, Fokus landet drin, Trap aktiv, Escape schließt |
| Team-Modal | `role=dialog`, Label „Profil: …", Escape schließt |
| Logo-Bildmaße | `width`/`height`-Attribute gesetzt |

`node --check` fehlerfrei, keine Konsolenfehler.

---

## [2026-07-20] Öffnungszeiten eingetragen · D2 Datenschutz vervollständigt

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO D2 + Öffnungszeiten (B1-Rest)

### Öffnungszeiten (strukturierte Daten)

Vom Kunden geliefert und in `index.html` (JSON-LD) für **beide** Standorte
eingetragen – als zwei `OpeningHoursSpecification`-Einträge, weil Freitag abweicht:
* Mo–Do 08:00–17:30
* Fr 08:00–16:30
* Sa/So: nicht aufgeführt = geschlossen (schema.org-Konvention)

Der Platzhalter-Kommentar über dem JSON-LD ist entfernt. Annahme: gleiche Zeiten
für Berlin und Köln (im Code-Kommentar vermerkt).

### D2 – Datenschutzerklärung vervollständigt

Drei Bausteine ergänzt (`assets/js/app.js`, DE + EN):
* **Auftragsverarbeitung** – Hinweis auf den AVV mit All-Inkl (Abschnitt 2).
* **Server-Logdateien** – neuer Abschnitt: welche Zugriffsdaten der Provider
  automatisch erfasst (Browsertyp, Referrer, IP, Zeitpunkt …), Rechtsgrundlage
  Art. 6(1)(f) DSGVO (Abschnitt 4).
* **Formular-Spam-Schutz** – der `.formlimit`-Mechanismus: IP nur als
  nicht rückrechenbarer Hash, max. 1 Stunde (beim Kontaktformular).

Zusammen mit den Google-Bausteinen aus G1 ist die Datenschutzerklärung damit auf
dem Stand der Technik: Google Maps kommt nicht mehr vor (entfernt), Consent/Ads
und die serverseitige Verarbeitung sind beschrieben.

### Geprüft

Server (`/2026/datenschutz`): Auftragsverarbeitung, Server-Logdateien,
Log-Inhalte und Spam-Schutz-Hash werden genannt; Google Maps nicht mehr; keine
Konsolenfehler. Öffnungszeiten im JSON-LD valide vom Server. `node --check` ok.

---

## [2026-07-20] Funktionsfähiger Consent-Banner + Google Tag Manager

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO G1 · GTM-NNQTHD76
**Kein Rechtsrat** – Consent-Text und Datenschutz-Bausteine sind anwaltlich
freizugeben.

### Richtungswechsel – bewusst

In der vorigen Runde wurde Google Maps entfernt, um „0 fremde Ressourcen" zu
erreichen. Diese Runde führt Google Ads ein: **Nach Einwilligung lädt die Seite
von Google** (GTM, doubleclick). Das ist die gewollte Folge davon, dass Ads
geschaltet werden sollen – **vor** der Einwilligung bleibt es bei 0 fremden
Ressourcen.

### Consent-Banner (ersetzt die Attrappe)

Der alte Banner setzte nur ein localStorage-Flag und steuerte nichts. Der neue:
* **Drei Kategorien** – notwendig (fest), Statistik, Marketing – mit Erklärungen.
* Gleichwertige Buttons **„Nur notwendige" / „Auswahl speichern" / „Alle
  akzeptieren"** (kein Dark Pattern).
* **Widerruf** über den neuen Fußzeilen-Link „Cookie-Einstellungen" – öffnet den
  Banner erneut mit dem aktuellen Stand.
* Entscheidung in `localStorage` (`nsbb_consent_v1`).

### GTM – erst nach Einwilligung (Entscheidung Projektleitung)

* **Google Consent Mode v2**: beim Start Default auf `denied` (alle Signale).
* GTM (`GTM-NNQTHD76`) wird **erst nachgeladen**, wenn Statistik oder Marketing
  zugestimmt wurde – nicht mit dem „advanced"-Vorabladen. Vor Einwilligung geht
  kein Byte an Google.
* Bei Einwilligung: `consent update` auf `granted` + GTM-Script injiziert.

### CSP – Google-Allowlist, mit einem Kompromiss

`script-src`, `img-src`, `connect-src`, `frame-src` um die Google/doubleclick-
Domains erweitert.

> ⚠️ **`'unsafe-inline'` bei `script-src` war nötig.** GTM injiziert für das
> Ads-Conversion-Tracking Inline-Skripte; ohne `'unsafe-inline'` blockiert die
> CSP sie (im Browser reproduziert: 3 Verstöße, u. a. `script-src-elem ←
> inline`). Nonce/Hash scheiden bei GTMs dynamischen Inline-Skripten aus. Der
> Kompromiss (schwächerer Schutz gegen eingeschleuste Skripte) ist die bewusste
> Folge der Ads-Entscheidung und in der `.htaccess` dokumentiert. Wird das
> Ads-Tracking je entfernt, sollte `'unsafe-inline'` wieder raus.

Die Allowlist erlaubt **nur Google**. Andere GTM-Tags (Meta, LinkedIn) würden
blockiert – gewollt: nichts lädt unbemerkt.

### Datenschutzerklärung – Bausteine ergänzt

Abschnitt 5 um **Einwilligung/Consent Mode** und **Google Ads/Conversion**
erweitert: Rechtsgrundlagen (Art. 6(1)(a) DSGVO, § 25 TDDDG), USA-Übermittlung
(Standardvertragsklauseln, Data Privacy Framework), Widerruf. Mit einem
Code-Kommentar „vom Fachanwalt prüfen lassen" markiert.

### Geprüft (im Browser, auf dem Server)

| Zustand | Ergebnis |
|---|---|
| Erstbesuch, vor Wahl | Banner sichtbar, GTM nicht geladen, **0 Google-Requests** |
| „Alle akzeptieren" | GTM lädt, `consent update` granted, **0 CSP-Verstöße** |
| „Nur notwendige" | kein GTM, 0 Google-Requests, consent `denied` |
| Widerruf (Fußzeile) | Banner öffnet in Detailansicht mit aktuellem Stand |
| Datenschutzseite | nennt Consent, Ads, USA, TDDDG, Widerruf |

`node --check` fehlerfrei, CSP-Syntax gegen Apache geprüft.

### Offen

* **Ads-Conversion-Aktion im GTM konfigurieren** (Conversion-ID + Label) –
  passiert im GTM-Interface, nicht im Code. Ohne das misst GTM keine Conversions.
* **Rechtliche Abnahme** von Banner und Datenschutztext.
* Sensible Seiten werden **nicht** vom Tracking ausgenommen (Entscheidung
  Projektleitung).

---

## [2026-07-20] Google Maps entfernt · Roadmap angelegt

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO D1 · Kundenwunsch

### Google Maps ersatzlos entfernt

Die Kontaktseite bettete je Standort eine Google-Maps-Karte (`<iframe>`) ein.
Diese lud beim Seitenaufruf **ungefragt von Google** und übertrug die IP-Adresse
jedes Besuchers an einen US-Server – bei einer Kanzlei ein Datenschutzrisiko und
der Auslöser für den Cookie-Banner.

* **`assets/js/app.js`**: Der Karten-Container (iframe + „Größere Karte"-Link)
  ist ersetzt durch eine klickbare Fläche **„Route planen · in Google Maps
  öffnen"**. Sie lädt **nichts automatisch** und öffnet Maps erst nach aktivem
  Klick in einem neuen Tab (saubere `maps/search`-API-URL statt der langen
  place-URL). Adresse, Telefon und der Bewertungslink (B2) bleiben sichtbar.
* **`.htaccess`**: CSP von `frame-src https://www.google.com` auf
  **`frame-src 'none'`** verschärft. Die Seite bettet keine fremden Inhalte
  mehr ein.

### Folgen

* **Im Browser bestätigt: 0 Google-Ressourcen** werden beim Aufruf der
  Kontaktseite geladen. Die Website lädt im Normalbetrieb von **keinem fremden
  Server** mehr nach.
* **Der Cookie-Banner kann damit entfallen** – es lädt nichts
  Einwilligungspflichtiges mehr. Bewusst **nicht** eigenmächtig entfernt: das
  ist eine rechtliche Entscheidung (TODO, Abschnitt 6).

### Neu: `ROADMAP.md`

Für zurückgestellte Vorhaben, abgegrenzt von `TODO.md` (vor Livegang) und
`changelog.md` (erledigt). Enthält:
1. **Zwei-Klick-Karte** – die spätere, datenschutzkonforme Art, wieder eine
   *sichtbare* Karte einzubinden (Vorschaubild → Karte erst nach Klick).
   Mit Aufwand, Voraussetzungen und der Empfehlung, es nur zu tun, wenn der
   Kunde die interaktive Karte wirklich will.
2. **Redaktionsbereich / Adminzugang** – wird erst nach der Liveschaltung
   benötigt. Verweist auf `dokumente/Redaktionsbereich-Konzept.md`.

### Geprüft

Server (`/2026/kontakt`): 0 iframes, 2 „Route planen"-Links mit korrekten
Ziel-URLs, 0 automatisch geladene Google-Ressourcen, CSP `frame-src 'none'`
ausgeliefert. `node --check` fehlerfrei.

---

## [2026-07-20] C1 + C2 + B2: Beschreibungen, Vorschaubild, Google-Business-Profile

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO C1/C2/B2

### C1 – Eigene Beschreibung für alle 41 Seiten

Die 23 fehlenden ergänzt (`tools/seiten-generator.js`, `BESCHREIBUNG`). Jede am
tatsächlichen Seiteninhalt orientiert – dafür die Hero-Untertitel und ersten
Absätze der Seiten gelesen, nicht den Titel wiederholt. Auf dem Server
stichprobenartig geprüft: alle verschieden.
*`home` bleibt mit 212 Zeichen bewusst lang (bestehender Marketing-Claim);
Google kürzt bei ~160.*

### C2 – Vorschaubild (og:image)

* **`assets/images/og-image.jpg`** (1200×630): Logo auf Markenhintergrund
  mit Unterzeile „Steuerberatung · Berlin & Köln". Es gibt keine Fotos –
  daher aus dem Logo aufgebaut, wie vom Kunden gewünscht.
* **`tools/og-image-bauen.py`** (neu) – erzeugt es reproduzierbar; neu ausführen,
  wenn sich das Logo ändert.
* Als **JPG**, nicht WebP: LinkedIn u. a. stellen WebP-Vorschaubilder nicht
  zuverlässig dar.
* `og:image`, `og:image:width/height/alt`, `twitter:image` in `index.html`.
  Der Generator setzt die absolute URL je Basis (live `/`, Test `/2026/`).

### B2 – Google Business Profile verknüpft

Die zwei vom Kunden gelieferten Kurzlinks aufgelöst (Knowledge-Graph-IDs
`/g/11qpl7gh9y` Berlin, `/g/11lkz0nrsq` Köln – dieselben, die schon in den
Maps-URLs im Code stehen; bestätigt die Zuordnung). Verknüpft an **zwei**
Stellen:
* **`sameAs`** im JSON-LD je Standort – maschinenlesbar für Suchmaschinen/KI.
* **Sichtbarer Link** „Auf Google ansehen & bewerten" auf der Kontaktseite.

  Dabei entdeckt: `googleBusiness` war ein **totes Feld** – definiert, aber
  nirgends angezeigt. Jetzt eingebunden (erscheint nur, wenn eine URL gesetzt
  ist). Führt Besucher zu Bewertungen – der stärkste Hebel für die lokale
  Auffindbarkeit.

### Nebenbei: og:url-Idempotenz auch für die Domain-Ersetzung

Der Generator normalisiert jetzt auch `og:image`/`twitter:image`-URLs erst auf
die nackte Domain, bevor er die Basis setzt – sonst wäre beim Wechsel zwischen
`/` und `/2026/` derselbe Idempotenz-Fehler wie zuvor bei den Asset-Pfaden
entstanden.

### Geprüft

Auf dem Server (`/2026/`): og:image erreichbar (200, image/jpeg), URL trägt
korrekt `/2026/`; Beschreibungen stichprobenartig verschieden; `sameAs` im
JSON-LD valide; beide Bewertungs-Links im DOM mit korrektem Ziel und
`target="_blank"`. Generator idempotent, `node --check` fehlerfrei.

### Offen

> `sameAs` nutzt die `share.google`-Kurzlinks (vom Kunden geliefert). Sie
> funktionieren, sind aber Weiterleitungen – Google folgt bei `sameAs` nicht
> immer. Unkritisch; falls gewünscht, später durch die kanonische Maps-URL
> ersetzen. Der sichtbare Button ist davon unberührt.

---

## [2026-07-20] Strukturierte Daten je Standort (schema.org) + zwei Aufräum-Fixes

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · TODO B1

### Strukturierte Daten (`index.html`, JSON-LD)

Vorher: `ProfessionalService` mit 4 Feldern. Jetzt ein `@graph` aus drei
verknüpften Knoten:
* **Organisation** (`Organization` + `AccountingService`): Name, Logo,
  Gründer, `areaServed` Deutschland, Sprachen DE/EN.
* **Standort Berlin** (`AccountingService`): Berlepschstr. 1, 14165 Berlin,
  Koordinaten 52.4294067 / 13.2565013, Telefon.
* **Standort Köln**: Holzmarkt 2/2A, 50676 Köln, Koordinaten
  50.9286278 / 6.9632448, Telefon.

Die Koordinaten stammen aus den bereits im Code hinterlegten Google-Maps-URLs
der Standorte – nicht geschätzt. Das ist der größte Einzelhebel für die lokale
Auffindbarkeit in Berlin und Köln und die Grundlage für die Darstellung als
Wissenskarte.

> **[!] Öffnungszeiten sind Platzhalter** (Mo–Fr 09:00–17:00). Ein deutlich
> sichtbarer Kommentar über dem JSON-LD weist darauf hin: durch die echten
> Zeiten ersetzen oder den `openingHoursSpecification`-Block entfernen. Falsche
> Zeiten sind schlechter als keine.
>
> `sameAs` (Google Business Profile, LinkedIn) bewusst weggelassen, bis die
> URLs vorliegen (TODO B2) – nichts erfinden.

### Nebenbei gefunden und behoben

**1. og:url-Dubletten.** Die lokale `index.html` hatte **17 `og:url`-Tags**
hintereinander. Ursache: `tools/seiten-generator.js` fügte `og:url` nach
`og:type` ein, ohne ein vorhandenes zu entfernen – bei jedem Lauf über dieselbe
Datei kam eins dazu. Der Generator entfernt jetzt erst alle `og:url`, dann setzt
er genau eines (dreimal hintereinander getestet: stabil bei 1). **Die
ausgelieferten Seiten waren nicht betroffen** (Paketbau erzeugt frisch), nur die
Projekt-`index.html`.

**2. Generierte Seiten aus Git genommen.** Die 40 `<slug>.html` sind
Build-Artefakte (entstehen bei jedem Paketbau aus `app.js` + `index.html`).
Sie blähten jeden Commit um 40 Dateien auf. Jetzt in `.gitignore`; `index.html`
bleibt als Vorlage getrackt.

### Geprüft

Auf dem Server (`/2026/`): JSON-LD valide, vom Server ausgeliefert, alle
Google-Pflichtfelder je Standort (name, address, geo, telephone) vorhanden.
Generator dreimal idempotent. `node --check` fehlerfrei.

---

## [2026-07-20] Englischer Hero-Text auf 5 Zeilen angeglichen

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · Hinweis der Projektleitung
**Grund:** Der Einleitungstext auf der Startseite lief im Deutschen über 5
Zeilen, im Englischen nur über 4. Beim Sprachwechsel sprang der Hero.

### Geändert (`assets/js/app.js`, EN `heroSub`)

| | vorher | nachher |
|---|---|---|
| Zeichen | 171 | 222 (DE: 212) |
| Zeilen | 4 | **5** (wie DE) |
| letzte Zeile | – | „German and international tax law." (33 Z., DE: 32) |

Neuer Text:
> We support entrepreneurs, owner-managed companies and private individuals
> with growth, structuring and tax-related decisions – from day-to-day advisory
> work through to complex questions of German and international tax law.

Zwei inhaltliche Verbesserungen nebenbei:
* **„owner-managed companies"** trifft die Zielgruppe genauer als „companies".
* **„German and international"** statt „national and international" – einem
  ausländischen Leser sagt das mehr, weil klar wird, um welches Steuerrecht
  es geht.

### Vorgehen

Die Zeilenzahl hängt nicht an der Zeichenzahl allein, sondern an den
Umbruchpunkten: Eine Fassung mit 206 Zeichen ergab 4 Zeilen, eine mit 203 schon
5. Es wurden deshalb rund 20 Formulierungen direkt im Browser durchgemessen,
statt zu schätzen.

Eine erste Lösung (208 Zeichen) erreichte zwar 5 Zeilen, ließ aber nur „law."
allein auf der letzten Zeile stehen – schlechter Satz. Die jetzige Fassung hat
eine praktisch gleich volle Schlusszeile wie die deutsche.

### Geprüft

Zeilenzahl bei **1440, 1280 und 768 px** – in allen Fällen DE und EN gleich
5 Zeilen. Auf dem Server gegengeprüft.

> **Hinweis für spätere Änderungen:** Wer diesen Text anpasst, sollte die
> Zeilenzahl nachmessen. Ein Wort mehr oder weniger kippt den Umbruch.
> Robuster wäre eine Mindesthöhe für den Absatz – das würde unabhängig von der
> Textlänge wirken, wurde hier aber nicht gemacht, weil der Auftrag lautete,
> den Text zu erweitern.

---

## [2026-07-20] Echte Adressen statt Hash-Navigation (Stufe 1)

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Projektleitung
**Vorher:** `nsbb.de/#kontakt` · **Jetzt:** `nsbb.de/kontakt`

### Warum

Das `#kontakt` sah aus wie ein Anker, war aber ein Zustandsmarker: JavaScript
las ihn aus und rendert eine andere Seite. Für Suchmaschinen existierte damit
**eine einzige Adresse** – alle 40 Unterseiten waren unsichtbar und konnten
nicht ranken. Deshalb hatte die `sitemap.xml` nur einen Eintrag.

### Drei Teile, die zusammengehören

1. **`assets/js/app.js`** – `pushState`/`popstate` statt `location.hash`.
   Basis-Pfad-bewusst über `<meta name="app-base">` (live `/`, Testadresse
   `/2026/`). Alte Fragment-Adressen werden weiter verstanden und einmalig auf
   die echte Adresse umgeschrieben – geteilte Links laufen nicht ins Leere.
   `canonical` wird je Seite mitgeführt, aber **nur im Live-Betrieb**.
2. **`tools/seiten-generator.js`** (neu) – erzeugt für jede der 41 Seiten eine
   Datei `<slug>.html` mit eigenem Titel, Beschreibung, canonical, hreflang und
   og:url. Titel und Seitenliste werden aus `app.js` gelesen, damit keine
   zweite Liste auseinanderlaufen kann. Erzeugt zugleich die vollständige
   `sitemap.xml` (41 statt 1 Adresse).
3. **`.htaccess`** – `RewriteBase`, `/kontakt` → `kontakt.html` intern,
   `/kontakt.html` → `/kontakt` per 301, Auffangregel für unbekannte Adressen.

### Warum Teil 2 nicht optional war

Ohne eigene Metadaten je Seite hätte Google 41 Adressen mit identischem Titel,
identischer Beschreibung und identischem canonical bekommen – und sie als
Dubletten gewertet, bis das JavaScript-Rendering nachzieht. Die Umstellung wäre
technisch erfolgt, aber **SEO-technisch nicht vertretbar** gewesen.

### Vier Fehler, die beim Testen auffielen

| Fehler | Wirkung | Behebung |
|---|---|---|
| Ordner statt Dateien | Apache leitete `/kontakt` per 301 auf `/kontakt/` um | flache `<slug>.html` |
| `REDIRECT_STATUS`-Prüfung | Weiterleitungsschleife auf sich selbst | Prüfung über `THE_REQUEST` |
| Fehlende `RewriteBase` | Umleitung auf den Dateisystempfad | `RewriteBase` gesetzt, im Testpaket auf `/2026/` |
| **Generator nicht wiederholbar** | Nach einem Lauf mit `/` suchten die Seiten ihre Dateien unter `/assets/` statt `/2026/assets/` → 404, ewiger Ladebildschirm | Pfade werden erst normalisiert, dann gesetzt |

Der letzte war der unangenehmste: Er trat erst auf, als der Generator zweimal
mit unterschiedlicher Basis lief – lokal unauffällig, auf dem Server tot.

### Geprüft

* Gegen lokales Apache in **beiden** Fällen (Wurzel und Unterverzeichnis, mit
  einer WordPress-`.htaccess` darüber).
* Auf dem Server: **alle 41 Adressen liefern HTTP 200 mit 41 verschiedenen
  Titeln.** `/kontakt.html` → 301 auf `/kontakt`. Unbekannte Adressen landen
  bei der Anwendung statt bei einem 404.
* Im Browser: Direktaufruf einer Unterseite, Navigation über das Menü,
  Zurück- und Vorwärts-Button – Adresse und Titel laufen synchron.
* Die alte WordPress-Seite bleibt unberührt.

### Offen

Der sichtbare **Inhalt** entsteht weiterhin per JavaScript. Google rendert das,
aber verzögert; andere Crawler (LinkedIn-Vorschau, Bing, KI-Crawler) sehen
teils nichts. Die vollständige Lösung wäre Vorrendern (Stufe 2) – der
Generator ist die Grundlage dafür und müsste nur den fertigen Inhalt
mitschreiben.

---

## [2026-07-20] Todo-Liste abgearbeitet + Consent-Konzept

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Projektleitung

### Umgesetzt

* **Seitentitel für alle 41 Seiten**, in DE **und** EN. Vorher trugen 28 Seiten
  denselben Titel, und die Tabelle war gar nicht sprachabhängig – `lang` stand
  zwar als Abhängigkeit im Effekt, wurde aber nicht ausgewertet.
* **Formularfelder:** `autoComplete` für E-Mail, Telefon, Vor- und Nachname,
  `inputMode` für die passende Handy-Tastatur, Beschriftungen über `id`/`htmlFor`
  verknüpft, `aria-required` / `aria-invalid` / `aria-describedby` ergänzt.
  Betrifft Kontakt- und Karriereformular.
* **Sprachwahl wird gemerkt** (localStorage). Reihenfolge: `?lang=en` in der
  Adresse schlägt gespeicherte Wahl, diese schlägt Browsersprache. Damit greift
  auch der `hreflang`-Verweis, der bisher ins Leere zeigte.

### Nebenbei gefunden: FAQ-Seite war nicht direkt erreichbar

`faq` fehlte in `validPages`. Die Seite ist im Footer verlinkt und im Router
registriert, aber wer `#faq` aufrief oder die Seite neu lud, landete auf der
**Startseite**. Ein Wort in einer Liste – behoben und geprüft.

### Kein Handlungsbedarf bei den Formularen

Vorgabe der Projektleitung, Ist-Zustand geprüft:
* Kanzleinachfolge → öffnet bereits das Mailfenster (`mailto:`) ✔
* Karriere → sendet bereits über `contact.php` ✔
* Kontakt → sendet bereits über `contact.php` ✔

### Neu: `dokumente/Consent-und-Tracking-Konzept.md`

Rechtliche Einordnung und Entscheidungsvorlage für Cookie-Banner, Google
Analytics und Conversion-Tracking. Kernpunkte:

* Der bestehende Banner ist **nicht haltbar**, sobald Einwilligungspflichtiges
  dazukommt: nur „Akzeptieren", kein Ablehnen, kein Widerruf, und er steuert
  technisch nichts.
* Google Consent Mode v2 ist seit März 2024 Pflicht, sonst liefert Google Ads
  keine Conversion-Daten aus dem EWR.
* Die **Content-Security-Policy müsste erweitert werden** – sie erlaubt derzeit
  ausschliesslich eigene Skripte (`script-src 'self'`). Analytics würde stumm
  blockiert.
* Drei Wege gegenübergestellt: eigener Banner, fertiges Consent-Werkzeug,
  oder Statistik ohne Einwilligung (Matomo/Plausible – dann kein Google-Ads-
  Conversion-Tracking).
* Hinweis zur Besonderheit einer Steuerkanzlei: Wer Seiten zu Wegzugsbesteuerung
  oder Kanzleinachfolge liest, gibt Hinweise auf seine Lebenssituation.
  Empfehlung, diese Seiten auch bei erteilter Einwilligung vom Tracking
  auszunehmen.

### Geprüft

Am Server (`?v=20260720g`): Titel greifen in beiden Sprachen, Formular hat
Autovervollständigung und verknüpfte Beschriftungen, Sprache überlebt das
Neuladen, FAQ per Direktaufruf erreichbar. Keine Konsolenfehler.

---

## [2026-07-20] Vorbereitung der Kundensichtung: Admin-Feld raus, Insights aus dem Menü

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Projektleitung
**Anlass:** Prüfung der Testfassung vor der Sichtung durch den Kunden.

### Entfernt: Admin-Feld und Klartext-Passwort

Auf der Insights-Seite lag ein Eingabefeld „Admin-Code", sichtbar für **jeden
Besucher**. Das Passwort stand im Klartext im ausgelieferten JavaScript und war
über „Seitenquelltext anzeigen" lesbar.

* `assets/js/app.js` – Passwortvergleich entfernt, Redaktionsleiste über einen
  Schalter stillgelegt (`REDAKTION_SICHTBAR = false`).
* **Am Server gegengeprüft:** Das Passwort ist in der ausgelieferten Datei nicht
  mehr enthalten (0 Treffer).

Der Bereich hatte ohnehin keine Funktion: Angelegte Beiträge lagen nur im
Arbeitsspeicher und waren beim nächsten Aufruf weg.

### Insights aus der Navigation genommen

Die Seite verspricht „Wissen, das weiterhilft", bietet fünf Themenfilter und
enthält **null Beiträge**. Eine leere Rubrik weckt eine Erwartung und
enttäuscht sie im selben Moment.

Der Eintrag ist in `app.js` auskommentiert – **eine Zeile entkommentieren
genügt**, um ihn zurückzuholen. Die Seite selbst bleibt bestehen und ist über
`#insights` erreichbar. Wirkt gleichzeitig für Desktop- und Mobilmenü, da beide
dieselbe Definition nutzen.

> Für den Kunden dokumentiert in `dokumente/Todo-vor-Kundensichtung.md`,
> Abschnitt „Der Kunde muss entscheiden".

### Neu: zwei Dokumente

* **`dokumente/Todo-vor-Kundensichtung.md`** – gemeinsame Abarbeitungsliste:
  erledigt / vor der Sichtung zu klären / Kundenentscheidungen / Livegang.
* **`dokumente/Redaktionsbereich-Konzept.md`** – drei Wege zu einem
  zugriffssicheren Redaktionsbereich mit Aufwand und Empfehlung. Kernsatz: Im
  Browser lässt sich nichts geheim halten, jede Zugangskontrolle muss
  serverseitig laufen.

### Gefunden: Formularmails werden voraussichtlich im Spam landen

Der SPF-Eintrag von `nsbb.de` lautet `v=spf1 include:maildomain._spf.datev.de
~all` – er autorisiert **nur DATEV** zum Versand. `contact.php` läuft aber auf
dem All-Inkl-Server, und die Empfänger (`info@`, `karriere@`) liegen bei DATEV.

Kein DMARC-Eintrag vorhanden. Zwei Auswege in der Todo-Liste beschrieben:
SPF beim Registrar ergänzen (ein Eintrag, ändert nichts am Empfang) oder
`contact.php` auf DATEV-SMTP umstellen (~2 Std).

**Entscheidung der Projektleitung:** DATEV bleibt für Mails zuständig, All-Inkl
bekommt nur den A-Record. Der Sendetest erfolgt manuell.

### Ebenfalls gefunden

Die `robots.txt` in `/2026/` wird von Suchmaschinen **nicht gelesen** – sie gilt
nur im Wurzelverzeichnis der Domain, und die dortige (von Yoast erzeugte)
erlaubt alles. Der Schutz der Testfassung hängt damit allein am
`X-Robots-Tag: noindex`. Der wirkt, ist aber eine Schicht statt zwei.
**Entscheidung: so belassen**, kein Verzeichnisschutz.

### Geprüft

* Testfassung neu übertragen (`?v=20260720e`), nur die zwei geänderten Dateien.
* Am Server: Menü ohne „Insights", Admin-Feld nicht mehr vorhanden, Passwort
  nicht mehr im Quelltext, keine Konsolenfehler.
* Leistung vom echten Server gemessen: Antwortzeit 0,11 s, Brotli aktiv
  (`app.js` 477 → 95 KB, `react-bundle.js` 571 → 98 KB, `style.css` 15,5 → 4,3 KB).

---

## [2026-07-20] Testfassung live auf dem All-Inkl-Server + kritische Domain-Korrektur

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · SSH-Zugang durch Projektleitung
**Testadresse:** https://nsbb.de/2026/ (noindex, alte Seite unberührt)

### ⚠️ Kritisch: Weiterleitungsrichtung war falsch herum

Am Live-System geprüft: Die bestehende Website läuft auf **`nsbb.de` OHNE www**,
`www.nsbb.de` leitet per 301 dorthin um.

Unsere `.htaccess` erzwang bis hierher **www** – also genau die Gegenrichtung.
Beim Livegang wäre daraus eine **Weiterleitungsschleife** geworden
(`nsbb.de → www.nsbb.de → nsbb.de → …`) und die Seite wäre nicht mehr
erreichbar gewesen. Zusätzlich sind sämtliche Suchmaschinen-Einträge und
Verweise seit Jahren auf `nsbb.de` ohne www eingespielt.

**Umgestellt auf `https://nsbb.de` (ohne www):** `.htaccess`, `canonical`,
`hreflang`, JSON-LD, `sitemap.xml`, `robots.txt`, Fusszeilen in `contact.php`.

### Vorgefunden

* Die aktuelle Seite ist eine **WordPress-Installation** – rund 19.000 Dateien,
  2,1 GB, in `/www/htdocs/w01f9274/nsbb.de`.
* Ein Verzeichnis `2026.nsbb.de` existiert bereits (Subdomain im KAS angelegt),
  enthält aber nur eine Platzhalterseite. **Es fehlt der DNS-Eintrag** – ohne
  A-Record beim Registrar nicht erreichbar.
* `w01f9274.kasserver.com` ist **nicht** als Webadresse aktiv (HTTP 503) –
  der ursprünglich angedachte Weg über die kasserver-Adresse entfällt damit.
* PHP auf dem Server: **8.3.29** – passt.

### Notbremse in `tools/deploy.sh` ergänzt

Das Live-Verzeichnis enthält WordPress. Ein `deploy.sh live` hätte mit
`--delete` die komplette Installation entfernt. Das Skript sucht jetzt vor
jeder Übertragung nach `wp-config.php`, `wp-admin`, `wp-includes` (und
Typo3/Joomla-Kennungen) und **bricht ab**, solange dort eine fremde Anwendung
liegt. Erst nach Sicherung und Entfernen der alten Seite ist ein
Live-Deployment möglich.

### Testfassung übertragen

`tools/deploy.sh test` → `/www/htdocs/w01f9274/nsbb.de/2026`, 22 Dateien.
Gewählt wurde das Unterverzeichnis, weil Subdomain (kein DNS) und
kasserver-Adresse (503) ausfallen.

### Geprüft – auf dem echten Server, von aussen

| Prüfung | Ergebnis |
|---|---|
| `https://nsbb.de/2026/` und alle Assets | HTTP 200 |
| Weiterleitung auf die alte Seite | keine |
| `X-Robots-Tag: noindex` | aktiv |
| Rendering, Schriften, Navigation | fehlerfrei |
| Team-Profile öffnen/schliessen (ESC) | funktioniert |
| Zurück-Button | Seite folgt der Adresse |
| `ReactDOM.createPortal` | vorhanden (Bundle-Fix wirkt) |
| CSP-Verstösse / Konsolenfehler | keine |
| `contact.php`: GET, ungültige E-Mail, leere Nachricht, kaputtes JSON | 405 / 422 / 422 / 400 |
| **Alte WordPress-Seite** | unverändert erreichbar |

Die WordPress-Rewrites der übergeordneten `.htaccess` stören das
Unterverzeichnis nicht (sie schliessen existierende Dateien und Verzeichnisse
aus). Die Schutzregel im Testpaket greift zusätzlich.

### Offen

> **Der echte Sendetest der Formulare steht noch aus.** Er löst Mails an
> `info@nsbb.de` und `karriere@nsbb.de` aus und sollte bewusst durch die
> Projektleitung erfolgen. Voraussetzung: `mail@nsbb.de` muss im KAS als
> Postfach oder Alias existieren, sonst landen die Mails im Spam.

---

## [2026-07-20] Testbetrieb ohne Subdomain: Schutz gegen geerbte Weiterleitungen

**Bearbeiter:** Claude (Claude Code, Opus 4.8)
**Anlass:** Die Domain ist nicht bei All-Inkl registriert und es zeigt nur ein
einzelner A-Record dorthin – kein Wildcard. Eine Subdomain `test.nsbb.de` ist
damit ohne DNS-Eingriff beim Registrar nicht möglich.

### Untersucht

Zwei Wege ohne DNS-Änderung, beide nachgestellt:

* **kasserver-Adresse von All-Inkl** (`wXXXXXXX.kasserver.com`) – funktioniert
  unabhängig vom Registrar, eigenes SSL-Zertifikat, keine Wechselwirkung mit
  der alten Seite. **Empfohlen.**
* **Unterverzeichnis der Live-Domain** (`nsbb.de/test/`) – funktioniert
  ebenfalls: relative Pfade, Hash-Navigation, Team-Profile, Schriften, Bilder
  und `contact.php` laufen im Unterverzeichnis einwandfrei (im Browser geprüft).

### Gefunden: Unterverzeichnis kann von der alten Seite gekapert werden

Apache wendet die `.htaccess` übergeordneter Verzeichnisse mit an. Nachgestellt
mit einer alten Seite, die alles hart umleitet:

| | ohne Schutzregel | mit Schutzregel |
|---|---|---|
| `/test/` | **301 → www.nsbb.de** | 200 |
| `/test/assets/js/app.js` | – | 200 |
| `/test/contact.php` | – | 200 |

Jeder Aufruf der Testseite wäre auf der alten Seite gelandet – und weil es ein
301 ist, hätte der Browser sich das gemerkt.

### Behoben

`tools/staging-paket.sh` setzt jetzt eine Schutzregel in die Test-`.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^ - [L]
</IfModule>
```

Ein eigenes `RewriteEngine On` setzt geerbte Rewrite-Regeln ausser Kraft. Auf
einer eigenen Testadresse schadet die Regel nicht – sie ist deshalb immer drin.

**Hinweis:** Header (z. B. `X-Frame-Options`) der übergeordneten Seite wirken
weiterhin mit hinein. Das ist unkritisch, weil unsere eigenen Header gewinnen,
sollte man bei der Fehlersuche aber wissen.

### Angepasst

`dokumente/Testbetrieb-All-Inkl.md` – Schritt 1 beschreibt jetzt beide Wege mit
Vor- und Nachteilen statt der nicht nutzbaren Subdomain.

---

## [2026-07-20] Kundenstand zusammengeführt, Formulare in Betrieb genommen, Upload-Paket

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Projektleitung
**Ziel:** Die Website lauffähig auf den All-Inkl-Webspace bringen.

> 📄 Eine ausführliche Fassung für die Übergabe – was zwingend angepasst werden
> musste und warum – liegt in
> `dokumente/Pflichtanpassungen_nach_Kundenstand_2026-07-20.md`.

### 1. Kundenstand eingespielt und zusammengeführt

Der Kunde hat in fünf Runden gearbeitet und **alles im Changelog dokumentiert** –
der Mechanismus hat gehalten. Übernommen wurden: kompakte Menüleiste,
vereinheitlichte Hero-Sections, größere Schriften, überarbeiteter
Sprachumschalter mit SVG-Flaggen, DE/EN-Abgleich (184 Schlüssel geprüft),
lesbarerer Footer.

Zwei Konflikte, beide trivial (dieselbe Stelle von beiden Seiten geändert):
* `index.html` – Cache-Version, aufgelöst auf einen neuen, höheren Wert.
* `changelog.md` – **beide** Eintragsblöcke behalten, nach Datum sortiert.

**Besonderheit:** Wir haben denselben `createPortal`-Fehler unterschiedlich
gelöst. Der Kunde hat ihn regelkonform in `app.js` umgangen (`Portal`-Komponente
über `createRoot`), hier wurde die Wurzelursache im Bundle behoben. Beides hat
den Merge überlebt, zur Laufzeit greift der Workaround des Kunden. Funktioniert
nachweislich – als offener Punkt notiert, nicht angefasst.

### 2. Formulare in Betrieb genommen (`contact.php` neu)

Bis hierher waren **beide** Formulare funktionslos: Das Karriereformular postete
an eine nicht existierende Datei, das Kontaktformular öffnete einen
`mailto:`-Link und meldete unabhängig vom Ergebnis „Vielen Dank".

* **`contact.php` neu erstellt.** Bedient beide Formulare.
  Kontakt → `info@nsbb.de`, Bewerbungen → `karriere@nsbb.de`, Absender
  `mail@nsbb.de`, Reply-To auf den Absender, Eingangsbestätigung in DE/EN.
* **Schutz:** Header-Injection abgewehrt (Zeilenumbrüche aus Kurzfeldern),
  Honeypot, Rate-Limit (5/Stunde/IP, IP nur als Hash), Längengrenzen.
  Das Limit zählt erst nach erfolgreichem Versand – Tippfehler verbrauchen
  kein Kontingent.
* **`app.js`:** `buildMailto()` → `buildBody()`, `handleSubmit()` sendet per
  `fetch()`. **Erfolg wird nur noch bei Server-Bestätigung gemeldet**, sonst
  Fehlermeldung mit direkter E-Mail-Adresse. Absende-Button zeigt „Wird
  gesendet …" und ist währenddessen gesperrt. Honeypot-Feld ergänzt.

### 3. Zurück-Button repariert

Im Kundenstand fehlte der `hashchange`-Listener weiterhin – die Adresse sprang,
die Seite blieb stehen. Behoben (der Fix aus unserem Zweig ist erhalten
geblieben).

### 4. Korrekturen

* **React 18 → React 19** in allen vier Doku-Dateien. Die Laufzeit meldet
  `19.2.5`; die Falschangabe stammte aus der Kunden-README und war ungeprüft
  übernommen worden.
* `m.siebert@nsbb.de` als Formular-Empfänger aus der README entfernt.
  **Nicht angetastet:** dieselbe Adresse im Team-Profil von Maximilian Siebert –
  dort ist sie seine persönliche Kontaktadresse wie bei den drei Kolleginnen
  und Kollegen auch.

### 5. Upload-Paket

* `tools/upload-paket.sh` – schnürt ein ZIP mit **nur** den Dateien, die auf den
  Server gehören (23 Dateien, 600 KB). Prüft vorher Syntax und Verweise.
* `.gitignore` um `.formlimit/` ergänzt (Laufzeitdaten von `contact.php`).
* `.htaccess`: `dokumente/`, `tools/` gesperrt, `docx`/`sh` ergänzt.

**Cache-Version:** `?v=20260723` (Kunde) / `?v=20260717b` (wir) → **`?v=20260720d`**

### Geprüft

Ausgeführt, nicht nur gelesen:

* Alle 15 Hauptseiten – rendern fehlerfrei, keine Konsolenfehler.
* Mobiles Menü (375 px), Team-Profile (öffnen/X/Klick/ESC), Zurück- **und**
  Vorwärts-Button, Sprachumschalter.
* **Beide Formulare im Browser abgeschickt** – Mails nachweislich erzeugt,
  Empfänger-Routing, Reply-To und Umlaute im Betreff kontrolliert.
* `contact.php` gegen PHP 8.0 ausgeführt: falsche Methode, ungültige E-Mail,
  leere Nachricht, kaputtes JSON, Honeypot, Header-Injection, Rate-Limit,
  Routing, Spracherkennung.
* Gegen Apache 2.4: Kompression (app.js 474→105 KB, react-bundle 571→103 KB),
  Cache-Header, Zugriffsschutz, CSP ohne Verstöße.
* **Das fertige Upload-Paket ausgepackt und betrieben** – Auslieferung und
  Formularversand funktionieren daraus.

### Offen / Achtung

> ⚠️ **Im KAS zu erledigen, bevor die Seite live geht:** `mail@nsbb.de` als
> Postfach oder Alias anlegen (sonst Spam-Ordner), PHP 8.1+, SSL-Zertifikat
> (die HTTPS-Weiterleitung ist aktiv), danach beide Formulare testweise
> abschicken.

---

## [2026-07-19] Bugfix: Team-Profile (Über uns) und mobiles Menü öffneten nicht (createPortal fehlte)

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Kunde
**Grund:** Der Kunde meldete, dass sich die Team-Profile auf „Über uns" nicht
öffnen lassen. Im Browser reproduziert: Beim Klick wirft die Seite intern
`ReactDOM.createPortal is not a function` – für den Besucher „passiert nichts".

Cache-Version: `?v=20260722` → `?v=20260723`. `node --check`: fehlerfrei.

### Ursache
Die ausgelieferte `assets/js/vendor/react-bundle.js` setzt
`window.ReactDOM = __require__('react-dom-client')`. Dieses Client-Modul enthält
`createRoot`, **aber nicht** `createPortal`. Der App-Code nutzt aber
`ReactDOM.createPortal` an zwei Stellen – dadurch waren **beide** Portale defekt:
* das **Profil-Modal** auf „Über uns" (`app.js:2918`) und
* das **mobile Menü** (`app.js:183`).
Ein reiner Bundle-Fehler, der beide Overlays lahmlegte.

### Geändert (`assets/js/app.js`) – Bundle NICHT angefasst (Regel 2)
* Neue kleine Komponente **`Portal`** (vor `MobileMenu`): rendert ihre Kinder über
  das im Bundle vorhandene `ReactDOM.createRoot` in ein an `document.body`
  angehängtes `<div>` und räumt beim Schließen wieder auf. Funktional identisch
  zu einem React-Portal (liegt außerhalb der `transform`-Container wie
  `.page-enter`, daher bleibt `position:fixed` viewport-zentriert).
* Beide `ReactDOM.createPortal(x, document.body)`-Aufrufe → `e(Portal, null, x)`
  (MobileMenu und Profil-Modal).

### Geprüft (Playwright/Chromium)
* **Über uns, Desktop DE + EN:** alle **4** Profilkarten öffnen das Modal
  (Foto, Name, Titel, Zitat, Fachgebiete, Sprachen, Werdegang, Kontakt).
  Schließen per **X**, **Hintergrund-Klick** und **ESC** funktioniert.
* **Mobiles Menü (390px):** Hamburger öffnet das Panel (Navigation, CTA, Kontakt,
  Sprachumschalter) – war vorher durch denselben Bug ebenfalls defekt.
* **Keine** `createPortal`-Fehlermeldung mehr, keine Konsolen-/Seitenfehler.

### Offen / Achtung (für die Projektleitung)
* Die **Wurzelursache** liegt in `react-bundle.js` (exponiert `react-dom-client`
  statt des vollen `react-dom` inkl. `createPortal`). Der Fix in `app.js` ist ein
  bewusst regel-konformer Workaround, damit nichts am Fremd-Bundle geändert werden
  muss. Sauberer wäre langfristig, das Bundle so zu erzeugen, dass
  `window.ReactDOM` das volle `react-dom` ist – dann könnte der `Portal`-Workaround
  wieder entfallen. Das betrifft `react-bundle.js` und liegt bei der Projektleitung.

---

## [2026-07-19] Feinschliff vor Übergabe: Hero-Sections überall gleich, Schriftgrößen angehoben

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Kunde
**Grund:** Letzter Feinschliff vor der Übergabe an die Projektleitung. Alle
Hero-Sections sollen dieselbe Struktur/Größe haben, und zu kleine Schriften
sollen angehoben werden (Lesbarkeit, v. a. Mobil). Analyse + Plan waren
freigegeben. Keine inhaltlichen Textänderungen außer minimalen, zur einheitlichen
Struktur nötigen Kurz-Untertiteln (vom Kunden freigegeben).

Cache-Version: `?v=20260721` → `?v=20260722`. `node --check`: fehlerfrei.

### Geändert

**1. Verbliebene Hero-Sections auf den einheitlichen `fit:true`-Standard gebracht**
(`assets/js/app.js`) – bisher wichen noch ab:
* **Branchen-Übersicht** (`LeistungenBranchenPage`): `fit:true` + String-Untertitel
  → 2-Zeilen-Array (in Runde 2 übersehen, jetzt nachgezogen).
* **5 Karriere-Stellenseiten** (Steuerberater/in, Steuerfachwirt/in,
  Steuerfachangestellte/r, Bilanzbuchhalter/in, Initiativbewerbung): `fit:true`,
  Einzeltitel beibehalten (kein erfundener Akzent), Untertitel als 2-Zeilen-Array
  (Zeile 1 = bestehendes „Voll-/Teilzeit · Berlin oder Köln" bzw. „Alle
  Positionen · …", Zeile 2 = kurzer Zusatz „Moderne, digitale Kanzlei mit echten
  Perspektiven." / „A modern, fully digital firm with real prospects.").
* **Impressum**: `fit:true` + Untertitel „Angaben gemäß § 5 TMG und
  berufsrechtliche Informationen." (EN „Information pursuant to § 5 TMG and
  professional regulations.").
* **Datenschutz**: `fit:true` + Untertitel „Wie wir mit Ihren personenbezogenen
  Daten umgehen." (EN „How we handle your personal data.").
* **Startseite** bleibt bewusst der größere Landing-Hero.

**2. Gleiche Hero-Höhe auf allen Breiten** (`assets/css/style.css`)
Die Mindesthöhe-Reserve `.hero-fit-body` galt bisher nur auf Mobil. Da die neu
angeglichenen Seiten Einzeltitel (1 statt 2 Titelzeilen) haben, wurde sie auf
**alle Breiten** erweitert (`min-height:224px`, Mobil 218px). Dadurch ist jeder
`fit:true`-Hero exakt gleich hoch.

**3. Schriftgrößen angehoben (Lesbarkeit, v. a. Mobil)**
* `assets/css/style.css`: Eyebrow-Label-Klasse `.label` `0.7rem` → `0.75rem`
  (wirkt zentral an ~65 Stellen).
* `assets/js/app.js`: alle 7 Inline-10px-Uppercase-Labels → 11px; sechs 12px-
  Beschreibungs-/Fließtexte → 13px (internationale Themen-Karten, Digital-Tools,
  Team-Lebensläufe, Kanzleinachfolge-Statistik, Datenschutz-Einwilligung im
  Formular, Anfahrtsbeschreibungen). Bewusst klein belassen: Meta-/Hinweistexte
  (Zeichenzähler, Formular-Hinweise, Statistik-Unterzeilen, 11px).

### Geprüft
* `node --check assets/js/app.js`: fehlerfrei.
* Playwright/Chromium, echte Seiten-Reloads, Cookie-Banner aus, 9 repräsentative
  Seiten (inkl. der neu angeglichenen Branchen/Karriere/Impressum/Datenschutz)
  bei 320/375/768/1440px in DE **und** EN:
  * **Hero-Höhe identisch** über alle Seiten und beide Sprachen: 375px = 426,
    768px = 464, 1440px = 464 (spread 0). Kein horizontaler Überlauf/Abschneiden.
  * Nur bei sehr schmalen **320px** minimale Abweichung, wenn der längste Titel
    (DBA) bzw. der längste Untertitel (BWL) auf DE umbricht – kein Abschneiden.
* Schriftänderungen visuell geprüft (intl. Karten, Team, Datenschutz/Impressum-
  Heroes): lesbarer, Layout intakt, keine Konsolen-/Seitenfehler.

### Offen / Achtung
* 320px bleibt der einzige Rand-Sonderfall (extrem schmale Alt-Geräte); alle
  gängigen Handybreiten (≥360px) sind exakt einheitlich.
* Startseite (Landing) und die Menü-/Flaggen-Anpassungen der Vorrunden bleiben.

---

## [2026-07-19] Kundenwunsch (Runde 3): Sprachumschalter – Abstand DE/EN reduziert, Flaggen verbessert

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Kunde
**Grund:** Im Sprachumschalter standen DE und EN zu weit auseinander, und die
Flaggen waren zu klein/unsauber. **Keine inhaltliche Änderung an Texten.**

Cache-Version: `?v=20260720` → `?v=20260721` (in `index.html`).
`node --check assets/js/app.js`: fehlerfrei.

### Geändert (`assets/js/app.js`)

**1. Abstand DE/EN deutlich reduziert (Desktop-Umschalter).**
Ursache des großen Abstands war die globale CSS-Regel `button { min-height:44px }`
(Touch-Target): jede der beiden gestapelten Schaltflächen war 44px hoch, der
Umschalter-Block also **87px**. Für die **Desktop**-Umschalter-Buttons (reine
Maus-Bedienung) wird `min-height` jetzt per Inline-Style auf `auto` gesetzt,
Padding auf `1px 6px`, `line-height:1`, Zeilenabstand 2px. Der Block ist damit nur
noch **28px** hoch, DE und EN stehen dicht untereinander (2px). Der **mobile**
Umschalter im aufklappbaren Menü behält seine 44px-Touch-Targets (Finger-Bedienung).

**2. Flaggen verbessert.**
Neu: zwei kleine, rein vektorielle SVG-Komponenten `FlagDE` und `FlagEN` (keine
externen Assets), an allen vier Stellen (Desktop + MobileMenu) genutzt:
* Deutschland: saubere Schwarz-Rot-Gold-Streifen (#000000 / #DD0000 / #FFCE00).
* Union Jack: korrektere Geometrie (viewBox 50×30 = Seitenverhältnis 5:3),
  kräftigere weiße/rote Diagonalen und Kreuzbalken, abgerundete Ecken.
* Etwas größer gerendert (18–20px statt 14px) → deutlich schärfer und klar
  erkennbar. Die aktive Sprache bleibt in Akzentgrün hervorgehoben.

### Geprüft
* `node --check assets/js/app.js`: fehlerfrei.
* Chromium/Playwright, 3-fache Auflösung: Desktop-Umschalter-Höhe von 87px auf
  28px reduziert (DE/EN-Abstand 2px, gemessen), Flaggen scharf und erkennbar;
  Mobil-Header ebenso geprüft. Aktive Sprache korrekt grün.

### Offen / Achtung
* Die Desktop-Umschalter-Buttons sind jetzt kleiner als 44px – bewusst, weil sie
  am Desktop mit der Maus bedient werden. Der Touch-Umschalter (mobiles Menü)
  bleibt bei 44px.

---

## [2026-07-19] Kundenwunsch (Runde 2): Menüleiste kompakt, Hero-Sections vereinheitlicht (kein Springen/Abschneiden), DE/EN-Abgleich

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Kunde
**Grund:** Zweite Rückmeldung des Kunden. Die Menüleiste war zu weit
auseinandergezogen; die Hero-Sections „sprangen" beim Seitenwechsel und wurden
auf Mobil teils abgeschnitten. Zusätzlich vollständige DE/EN-Prüfung gewünscht.
Vorgehen war ein freigegebener Analyse-/Umsetzungsplan (Auswahl des Kunden:
Menüleiste linksbündig-kompakt · Hero-Option B · DE/EN „beides").

Cache-Version: `?v=20260719` → `?v=20260720` (in `index.html`).
`node --check assets/js/app.js` nach jedem Schritt: fehlerfrei.

### Geändert

**1. Menüleiste kompakt** (`assets/js/app.js` Funktion `Nav`; `assets/css/style.css`)
Die drei Gruppen (Logo · Menü · DE-EN+Kontakt) waren per
`justify-content:space-between` maximal auseinandergezogen. Jetzt linksbündig
kompakt:
* Neue CSS-Klasse `.nav-inner`: Mobil weiterhin `space-between` (Hamburger sitzt
  rechts), ab Desktop (`min-width:1024px`) `flex-start` – alles rückt links
  zusammen. Der äußere `gap` wurde 24px → 14px reduziert.
* Der DE/EN-Umschalter steht enger untereinander (`gap` 2px → 0px, Button-Padding
  `2px 6px` → `1px 6px`, `lineHeight:1.05`), die rechte Gruppe enger (`gap`
  12px → 9px).
* Kein Springen beim Sprachwechsel: das bestehende Grid-Overlay pro Menü-Button
  (reserviert die max. Breite aus DE+EN) bleibt. Header-Höhe DE = EN = 120px,
  Button-Positionen identisch (im Browser verifiziert). Bewusste Nebenwirkung:
  auf breiten Bildschirmen bleibt rechts eine freie Fläche (Folge des kompakten
  Linkspackens).

**2. Hero-Sections vereinheitlicht – kein Springen, kein Abschneiden**
(`assets/js/app.js` Komponente `PageHero`; `assets/css/style.css`)
Ursache der Uneinheitlichkeit: Es gab zwei Hero-Systeme. `fit:true` erzwang
zweizeilige Titel mit `white-space:nowrap` → lange Titel liefen auf Mobil über
den Rand (Abschneiden) und der Untertitel schrumpfte auf ~9,6px. `fit:false`
nutzte 40px-Titel mit freiem Umbruch → je nach Textlänge unterschiedlich hohe
Heroes (Springen). Vereinheitlicht:
* `fit:true`-Zweig: `nowrap` entfernt (Titel dürfen umbrechen statt
  abzuschneiden), `text-wrap:balance` + `overflow-wrap:break-word`. Titel-Größe
  `clamp(1.55rem,5.2vw,2.9rem)` (Desktop-Max so gewählt, dass auch der längste
  Titel „Doppelbesteuerungsabkommen:" einzeilig bleibt), Untertitel lesbar
  `clamp(0.95rem,2.1vw,1.1rem)` (vorher min 0,6rem).
* Neue Klasse `.hero-fit-body` mit `min-height:218px` **nur auf Mobil**
  (`max-width:767px`): reserviert eine konsistente Höhe, damit Seiten mit 2- vs.
  3-zeiligem Untertitel gleich hoch sind. Ab Tablet sind die Heroes ohnehin
  einheitlich.
* **Verifiziert im Browser** (Chromium, je Seite mit echtem Reload) bei 320 /
  375 / 414 / 768 / 1440 px in **DE und EN**: Hero-Höhe über alle Seiten und
  beide Sprachen identisch (Abweichung 0px bei 375/414/768/1440), **kein
  horizontaler Überlauf/Abschneiden**. Einzige Rest-Abweichung: bei sehr schmalen
  320px bricht der eine längste Titel (DBA) auf DE um (+23px) – kein Abschneiden,
  nur minimal höher; 320px ist ein Rand-Sonderfall.

**3. 4 Leistungen-Unterseiten auf denselben Hero-Standard** (`assets/js/app.js`)
„Drei Bereiche", „Laufende Steuerberatung", „Gestaltungsberatung",
„Betriebswirtschaftliche Beratung" nutzten den abweichenden `fit:false`-Hero.
Jetzt `fit:true` und ihr String-Untertitel in ein 2-Zeilen-Array aufgeteilt
(reines Umbrechen, **kein** inhaltlicher Eingriff). Damit reihen sie sich in den
einheitlichen Standard ein.

**4. DE/EN-Abgleich (vollständig)**
* **Grenzgänger-Hero:** Die englische Fassung war „Cross-Border / Commuters."
  und ließ die Steuer-Frage weg. An die deutsche angeglichen →
  „Cross-Border Workers: / Where Do I Pay Tax?".
* **Begriffs-Vereinheitlichung „Grenzgänger" (EN):** Die Seite verwendete
  gemischt „worker(s)" (Übersichtskachel, Fließtext, FAQ) und „commuter"
  (Kontakt-Formular-Dropdown). Auf die vorhandene Mehrheit **„Cross-Border
  Worker(s)"** vereinheitlicht (Dropdown „commuter" → „worker"). Reine
  Übersetzungs-/Konsistenzänderung.
* **Ergebnis der Gesamtprüfung:** Das Übersetzungswörterbuch `T` hat in DE und EN
  exakt dieselben 184 Schlüssel (keine fehlende Übersetzung). Automatischer Scan
  aller Inline-`isDE ? … : …` (einfache, Array- und Template-Literale): **kein
  Deutsch auf der EN-Seite, kein Englisch auf der DE-Seite**. Die 5 in DE/EN
  identischen Werte sind bewusste Markenbegriffe („TGS International", „Insights",
  „Team", „Insights & Expertise"). Es waren also **keine inhaltlichen
  Korrekturen** nötig außer der Grenzgänger-Vereinheitlichung.

### Geprüft
* `node --check assets/js/app.js`: fehlerfrei.
* Chromium/Playwright, echte Seiten-Reloads, Cookie-Banner ausgeblendet:
  * Menüleiste Desktop 1440 DE **und** EN: kompakt links, Header-Höhe 120=120,
    keine Positions-/Breitenverschiebung beim Sprachwechsel; Mobil 375: Logo
    links, DE/EN + Hamburger rechts, kein horizontaler Überlauf.
  * Heroes 320/375/414/768/1440 px, DE **und** EN, 9 Seiten (u. a. DBA,
    Vermögensstrukturierung, BWL, Drei Bereiche, Kontakt, Team, Grenzgänger,
    Digital, Karriere): gleiche Höhe, kein Abschneiden, Untertitel lesbar.
* Keine Konsolen-/Seitenfehler.

### Offen / Achtung
* Bei sehr schmalen 320px ist der Hero „Doppelbesteuerungsabkommen" auf DE
  minimal höher (längster Titel bricht um). Kein Abschneiden. Bei Bedarf ließe
  sich die Titel-Mindestgröße weiter senken – dann würde der Titel aber überall
  etwas kleiner. Absichtlich nicht gemacht, um die Lesbarkeit zu halten.
* Startseite (großer Landing-Hero) und Impressum/Datenschutz (schlichter Hero
  ohne Untertitel) blieben wie vom Kunden gewünscht ausgenommen.
* Die 5 Karriere-Stellenseiten (eigener kürzerer Hero, Option C) wurden auf
  Kundenwunsch **nicht** angefasst.

---

## [2026-07-19] Kundenwunsch: Footer lesbarer, Info-Box weiß, kleine Schrift größer, Menüleiste durchgängig weiß, Nav verschlankt + Sprachumschalter

**Bearbeiter:** Claude (Claude Code, Opus 4.7) · beauftragt durch Kunde
**Grund:** Fünf inhaltliche/gestalterische Änderungswünsche aus der ersten
Kundenrückmeldung (siehe unten). Umgesetzt in einer Sitzung, damit der Ordner
möglichst schnell wieder als ZIP an die Projektleitung geht.

Cache-Version: `?v=20260717` → `?v=20260719` (in `index.html`).
`node --check assets/js/app.js` nach jedem Zwischenschritt: fehlerfrei.

### Geändert

**1. Footer – Schrift größer, deutlich mehr Kontrast** (`assets/js/app.js`, Zeilen 292–357)
Die Struktur des Footers ist unverändert. Angepasst wurden nur die Schriftgrößen
und die Textfarben, damit sich der Text vom fast-schwarzen Hintergrund
(`#1A1917`) besser abhebt.

* Labels (BERLIN / KÖLN): 10px → 12px, Opazität .3 → .7
* Fließtext (Adresse, Tagline): 12px → 14px, Opazität .5 → .82–.85
* Links (Telefon, E-Mail, FAQ, Impressum, Datenschutz): 12px → 13–14px,
  Opazität .38–.5 → .75–.85
* Copyright: 11px → 13px
* Trennlinien: rgba(255,255,255,.08) → .12 (leicht sichtbarer, aber weiterhin
  zurückhaltend)
* Kontakt-Button (Footer): 11px → 13px, Rahmenkontrast erhöht

**2. Internationales Steuerrecht – schwarze Info-Box → weiß**
(`assets/js/app.js`, Zeilen 883–898)
Die Info-Box direkt unter dem Hero (Berlin & Köln / TGS Global / 58 Länder /
Unternehmer & Privatpersonen) hatte einen schwarzen Hintergrund. Umgestellt auf
weiß mit dunklem Akzentgrün für die Werte und `--muted` für die Labels, plus
dezenter unterer Trennlinie (`#ECEAE6`) für die visuelle Abgrenzung zur
folgenden Sektion.

**3. Unternehmen-Kacheln – kleine Unterpunkte vergrößert** (`assets/js/app.js`)
* Zeile 668 (Kacheln „Steuerberatung für Unternehmen" und „Branchenlösungen"
  auf der Übersichtsseite `LeistungenUnternehmenPage`): Bullet-Items
  `text-xs` → `text-sm` (12px → 14px). Damit lesen sich „Laufende
  Steuerberatung / Gestaltungsberatung / Betriebswirtschaftliche Beratung"
  bzw. „E-Commerce & Onlinehandel / Bauunternehmen / …" wie der übrige
  Fließtext auf der Seite.
* Zeilen 704, 707 (Kacheln „Drei Bereiche" auf
  `LeistungenUnternehmenLeistungenPage`): analog `text-xs` → `text-sm`,
  Bullet-Punkte 5px → 6px angeglichen.

Die restlichen `text-xs`-Vorkommen im Code sind bewusst klein gehaltene
Sonderformen (Pill-Badges, Statistik-Untertitel, Overline-Labels wie „NETZWERK"
oder „WELTWEIT VERNETZT") – ein Vergrößern würde die Hierarchie zerreißen. Sie
bleiben deshalb wie sie sind. Sollte an einer konkreten Stelle davon eine
Textzeile trotzdem zu klein wirken, bitte gezielt melden.

**4a. Menüleiste bleibt immer voll weiß** (`assets/js/app.js`, Zeilen 195–206;
`assets/css/style.css`, Zeile 12)
Ursache des grauen Eindrucks: Der Header war halbtransparent
(`rgba(255,255,255,0.92–0.97)` + `backdrop-filter: blur(12px)`). Über dunklen
Sektionen (z. B. „Für die richtigen Mandanten" auf Leistungen/Unternehmen mit
schwarzem Hintergrund, oder der alte dunkle Hero auf Impressum/Datenschutz)
schimmerte der dunkle Untergrund durch → grauer Anschein. Umgestellt auf voll
deckendes `#ffffff`, `backdrop-filter` entfernt. Ergebnis: keine Farbmischung
mehr, die Menüleiste ist unabhängig vom Untergrund immer weiß.
(Betrifft die gesamte Website, nicht nur einzelne Seiten.)

**4b. Impressum + Datenschutz – Hero analog zu allen anderen Seiten**
(`assets/js/app.js`, Zeilen 3592ff und 3710ff)
Beide Seiten hatten einen eigenen dunklen Hero (`#1A1917`, Höhe 80/56 px, weiße
Überschrift). Ersetzt durch die bestehende `PageHero`-Komponente mit Label
„RECHTLICHES" / „LEGAL". Dadurch identische Höhe, Innenabstände, Typografie und
Hintergrundfarbe (`--offwhite`) wie „Über uns", „Leistungen", „Karriere" usw. –
die Seiten fügen sich jetzt in die Reihe ein.

**5. Nav-Umbau** (`assets/js/app.js`, Zeilen 158–281 und Übersetzungen 4541 /
4812)
* Menüpunkt **„Startseite" / „Home"** entfernt – Klick aufs Logo führt bereits
  zur Startseite.
* Menüpunkt **„Kontakt" / „Contact"** entfernt – rechts steht bereits der
  grüne CTA-Button.
* Der grüne CTA-Button heißt jetzt **„Kontakt" / „Contact"** statt „Kontakt
  aufnehmen" / „Contact us" (`t.navBook` in beiden Sprach-Blöcken).
* **Sprachumschalter neu:** DE und EN werden untereinander angezeigt, jeweils
  mit kleiner SVG-Flagge (Schwarz-Rot-Gold bzw. Union Jack, inline, keine
  externen Ressourcen) und aktuellem Sprachtext. Die aktive Sprache erscheint
  in Akzentgrün, die inaktive in Grau. Kein Toggle-Ratespiel mehr – der
  Besucher sieht beide Optionen.
* **Sprung DE/EN verhindert:** Jeder Nav-Button rendert das eigene Label
  sichtbar und das gegensprachige Label unsichtbar in derselben CSS-Grid-Zelle
  (`display:inline-grid; gridTemplateAreas:'"lbl"'`). Die Button-Breite ist
  damit `max(width_DE, width_EN)` und ändert sich beim Sprachwechsel nicht
  mehr – die Menüleiste bleibt in Position, Breite und Höhe stabil.
* **MobileMenu** (`assets/js/app.js`, Zeilen 68–155): Sprachumschalter analog
  angepasst (zwei kleine Buttons mit Flagge nebeneinander statt einem
  Toggle-Button). „Startseite" und „Kontakt" fehlen dort automatisch, weil sie
  aus dem gemeinsamen `nav`-Array entfernt sind.

### Geprüft

* `node --check assets/js/app.js` nach jedem Änderungspaket: fehlerfrei.
* Lokaler Server (`python3 -m http.server 8080`), Chromium via Playwright,
  Viewport 1440×900, Cookie-Banner ausgeblendet:
  * **Startseite DE + EN**: Kein „Startseite"/„Home"- und kein
    „Kontakt"/„Contact"-Eintrag mehr, Button rechts heißt „Kontakt" bzw.
    „Contact". Sprachumschalter zeigt DE (Schwarz-Rot-Gold) und EN (Union
    Jack), aktive Sprache in Akzentgrün. Wechsel DE ↔ EN: die Menüpunkte
    bleiben in Position (Grid-Overlay wirkt).
  * **Footer**: Text deutlich lesbarer als vorher, Struktur unverändert,
    schwarzer Hintergrund bleibt.
  * **Leistungen → Internationales Steuerrecht**: Die Info-Box (Berlin & Köln
    / TGS Global / 58 Länder / Unternehmer & Privatpersonen) ist weiß mit
    grünen Werten und dezenten Labels – schwarz ist verschwunden.
  * **Leistungen → Für Unternehmen** und **→ Drei Bereiche**: Bullet-Punkte
    („Laufende Steuerberatung", „E-Commerce & Onlinehandel", …) sind sichtbar
    größer und passen zur Beschreibungszeile darüber. Menüleiste bleibt beim
    Vorbeiscrollen an der schwarzen „Für die richtigen Mandanten"-Sektion
    strahlend weiß, kein Grau-Durchschimmern.
  * **Impressum + Datenschutz**: Kein dunkler Hero mehr, stattdessen der
    gleiche helle Hero mit „RECHTLICHES"-Label wie auf allen anderen Seiten.
* Keine Konsolen- oder Seitenfehler im Browser.

### Offen / Achtung

* Der TGS-Global-Link im Footer öffnet weiterhin `https://tgs-global.com` in
  neuem Tab – wie bisher die einzige externe Netzwerk-Verbindung außerhalb
  von Google Maps. Nicht geändert.
* Der grüne Kontakt-Button rechts oben zeigt zusätzlich zum Text ein kleines
  Kalender-SVG. Unverändert übernommen – nur der Text ist auf „Kontakt" /
  „Contact" gekürzt.
* Bewusst unverändert (im Rahmen der bestehenden „Offenen Punkte"): das
  Kontaktformular verschickt weiterhin nichts (Punkt 2), `contact.php` fehlt
  (Punkt 3), Cookie-Banner-Logik unverändert (Punkt 4). Diese liegen bei der
  Projektleitung.
* Der Footer-Button „Kontakt aufnehmen" / „Get in touch" ist nicht mit
  umbenannt worden – der Kundenwunsch bezog sich ausdrücklich auf den
  Nav-Button oben rechts. Falls im Footer die gleiche Verkürzung gewünscht
  ist, bitte kurz Bescheid geben.

---

## [2026-07-17] UX-Prüfung durchgeführt, Bericht als Word-Dokument

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · beauftragt durch Projektleitung
**Keine Änderung an der Website** (die drei Reparaturen sind separat protokolliert).

### Neu

* **`dokumente/UX-Pruefung_NSBB_2026-07-17.docx`** – 16 priorisierte
  Empfehlungen, keine davon mit Eingriff ins gestalterische Konzept.
* `tools/ux-doc-generator.js` – das Skript, das den Bericht erzeugt
  (`node tools/ux-doc-generator.js dokumente/<name>.docx`, benötigt `npm i -g docx`).
  Abgelegt, damit der Bericht bei Bedarf reproduzierbar aktualisiert werden kann.

### Vorgehen

Die Seite wurde bedient, nicht nur gelesen: Desktop (1280 px) und Handy (375 px),
Startseite, Über uns, Insights, Kontakt, Formulare. Alle Zahlen im Bericht sind
gemessen, nicht geschätzt (z. B. „0 von 8 Feldern mit Autovervollständigung",
„Cookie-Banner belegt 17 % des Handy-Schirms", „13 von 41 Seiten mit eigenem
Titel").

### Die drei schwersten Funde waren Ausfälle

Mobiles Menü, Team-Profile und Zurück-Button – sofort behoben, siehe eigener
Eintrag oben.

### Angepasst

* `.htaccess` – `dokumente/` und `tools/` gesperrt, `docx` und `sh` zu den
  nicht ausliefbaren Dateitypen ergänzt.
* `robots.txt` – `/dokumente/` ergänzt.
* `tools/zip-fuer-kunden.sh` – `dokumente/` vom Kunden-ZIP ausgenommen (der
  Bericht ist ein internes Dokument).

### Geprüft

* Docx gegen Apache: `/dokumente/…docx` → 403, `/tools/…sh` → 403,
  Website (`/`, `app.js`, `robots.txt`, `sitemap.xml`) → 200.
* Dokument selbst validiert: ZIP-Integrität, alle 22 XML-Teile wohlgeformt,
  Beziehungen auflösbar, 16 von 16 Befunden enthalten, Umlaute korrekt.
  (Die `validate.py` der docx-Skill braucht Python ≥ 3.10, hier läuft 3.9 –
  deshalb eigenständig geprüft.)

---

## [2026-07-17] KRITISCH: Mobiles Menü und Team-Profile zerstörten die Seite

**Bearbeiter:** Claude (Claude Code, Opus 4.8) · gefunden bei der UX-Prüfung
**Schwere:** Ausfall, kein Schönheitsfehler.
**Herkunft: Der Fehler steckte bereits im Ausgangsstand des Kunden** (Commit
`f8de9ff`) und wurde nicht durch die Umstellung vom 17.07. verursacht. Belegt
durch Ausführen des unveränderten Originals: identischer Absturz.

### Was passiert ist

Ein Tippen auf das **Menü-Symbol am Handy** oder ein Klick auf ein
**Team-Mitglied** unter „Über uns" führte zu einem **weißen Bildschirm** – die
gesamte Website verschwand, nicht nur das Menü. Nur ein Neuladen half.

Für Handy-Besucher war damit die **komplette Navigation unerreichbar**: Außer der
Startseite war keine einzige Unterseite erreichbar, ohne dass die Seite abstürzt.

### Ursache

Der eingebettete React-Shim registriert vier Module, wies `window.ReactDOM` aber
nur `react-dom-client` zu:

```js
window.ReactDOM = RDC;               // nur createRoot / hydrateRoot
```

`createPortal` lebt jedoch im Modul `react-dom`, das zwar registriert, aber nie
zugänglich gemacht wurde. Die App ruft `ReactDOM.createPortal` an zwei Stellen
auf – `app.js` Zeile 154 (mobiles Menü) und Zeile 2855 (Team-Profil). Beide warfen
`TypeError: ReactDOM.createPortal is not a function`. Da React einen Fehler beim
Rendern nach oben durchreicht und es keine Error Boundary gibt, riss es den
gesamten Komponentenbaum ab.

### Behoben

* `assets/js/vendor/react-bundle.js` – beide Module vereint:
  ```js
  window.ReactDOM = Object.assign({}, __require__('react-dom'), RDC);
  ```
  Einzige Änderung an dieser Datei. Sie bleibt ansonsten unangetastet.

### Ebenfalls behoben: Der Zurück-Button funktionierte nicht

Beim selben Durchgang gefunden: Es gab **keinen `hashchange`-Listener**. Wer nach
einem Seitenwechsel den Zurück-Button drückte, sah die Adresse springen, während
die Seite stehen blieb – ein Zustand, in dem Besucher sich verloren fühlen. Auf
dem Handy ist Zurück die primäre Navigationsgeste.

* `assets/js/app.js` – `validPages` und `pageFromHash()` auf Modulebene gehoben
  (vorher inline im `useState`-Initialisierer) und in `App()` ein
  `hashchange`-Listener ergänzt. Rund 10 Zeilen, keine Designänderung.

### Korrigiert: React-Version in der Dokumentation

Die Laufzeit meldet `exports.version = "19.2.5"` – es ist **React 19**, nicht
React 18. Die Angabe stammte aus der README des Kunden und wurde von mir
ungeprüft in `README.md`, `CLAUDE.md`, `PROMPT-FUER-CLAUDE.md` und diesen
Changelog übernommen. In allen vier Dateien berichtigt.

### Cache-Version

`?v=20260717` → **`?v=20260717b`** in der `index.html`. Ohne diesen Schritt
hätten wiederkehrende Besucher die kaputte Fassung aus dem Cache behalten.

### Geprüft (im Browser, nicht nur im Code)

| Test | vorher | nachher |
|---|---|---|
| Mobiles Menü öffnen (375 px) | weißer Bildschirm | ✓ öffnet, alle Punkte da |
| Team-Profil anklicken | weißer Bildschirm | ✓ Profil öffnet |
| Zurück-Button | Adresse springt, Seite bleibt | ✓ Seite folgt |
| Vorwärts-Button | – | ✓ funktioniert |
| `ReactDOM.createRoot` | funktionierte | ✓ unbeschädigt |
| Konsolenfehler | `TypeError` | ✓ keine |

`node --check` auf beide JS-Dateien: fehlerfrei.

> ⚠️ **Das am 17.07. an den Kunden versandte ZIP enthält diese Fehler noch.**
> Ein korrigiertes ZIP sollte nachgereicht werden.
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
| `assets/js/vendor/react-bundle.js` | eingebettete React-19-Laufzeit | 558 KB |
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
