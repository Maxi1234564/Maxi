# NSBB Website – neue Inhaltsseiten schreiben (Anleitung für Claude)

> **Diese Datei zuerst lesen.** Sie ist der aktuelle Einstieg für die Aufgabe
> „weitere Inhaltsseiten schreiben". Ergänzt wird sie von `CLAUDE.md` (Regeln,
> wird von Claude Code automatisch geladen) und `changelog.md` (Projektstand +
> „Offene Punkte"). Die ältere `README.md` beschreibt den Git-/Deploy-Weg der
> Projektleitung – für das Schreiben von Seiten brauchst du sie nicht.

---

## Worum es geht

Dies ist die **fertige, live laufende Website** von NSBB (Steuerberatung Berlin
& Köln) unter **https://nsbb.de**. Deine Aufgabe: **neue Inhaltsseiten**
schreiben (z. B. eine weitere Leistungs- oder Themenseite). Die Projektleitung
nimmt deine Fassung anschließend entgegen, führt sie zusammen und stellt sie
online.

**Wichtig – kein Deploy durch dich:** Du bearbeitest nur die Dateien in diesem
Ordner. Du lädst **nichts** hoch, startest **keine** Deploy-/Server-Skripte. Am
Ende geht der **komplette Ordner als ZIP zurück** an die Projektleitung, die
zusammenführt, vorrendert und veröffentlicht.

---

## Die drei wichtigsten Regeln (Details in `CLAUDE.md`)

1. **Nicht umbauen.** `assets/js/app.js` ist bewusst eine große Datei in
   `React.createElement`-Schreibweise (kein JSX, kein Build-Schritt, kein
   Paketmanager). **Kein Refactoring, keine Umformatierung, keine
   Dateiaufteilung.** Nur an den Stellen ergänzen, um die es geht. Große Diffs
   machen das spätere Zusammenführen unmöglich.
2. **Keine externen Dienste.** Keine Google Fonts, kein CDN, keine Analytics,
   kein `<script src="https://…">`. Schriften und React liegen bewusst lokal
   (Datenschutz + Performance). Neue Bilder als **WebP** nach `assets/images/`.
3. **Nach jeder Änderung an `app.js`:**
   - `node --check assets/js/app.js` (ein Syntaxfehler legt die **ganze** Seite lahm),
   - die Versionsnummer `?v=` in `index.html` erhöhen (sonst sieht niemand die Änderung – 1 Jahr Cache),
   - einen Eintrag in `changelog.md` schreiben (Vorlage am Dateiende).

---

## Wie die Website aufgebaut ist

- **Eine React-19-Single-Page-Application.** Der gesamte Inhalt – **alle Seiten,
  alle Texte (Deutsch *und* Englisch), die Navigation, die Logik** – steht in
  **`assets/js/app.js`**. Das Aussehen in `assets/css/style.css`.
- **Echte, crawlbare Adressen.** Jede Seite hat eine eigene URL
  (`/leistungen`, `/kontakt`, `/digital` …). Es ist **keine** reine
  Hash-Navigation mehr. Der Router in `app.js` bildet aus der Adresse die Seite
  (`seiteAusAdresse`), Klicks wechseln per `setPage('schlüssel')` die Seite und
  schreiben die Adresse per `pushState`. Für Suchmaschinen/KI wird jede Seite
  zusätzlich **vorgerendert** (statisches HTML) – das macht die Projektleitung
  automatisch (siehe unten).
- **Zwei Sprachen.** Deutsch/Englisch, umschaltbar im Menü. Beide Fassungen
  stehen direkt in `app.js`. In den Seiten wird meist mit
  `const isDE = lang === 'DE'` und `isDE ? 'deutsch' : 'english'` gearbeitet,
  oder über das zentrale Text-Objekt `t`.

---

## Eine neue Inhaltsseite anlegen – Schritt für Schritt

Angenommen, die neue Seite soll unter **`/beispiel-seite`** erreichbar sein.
Alle Änderungen passieren in **`assets/js/app.js`**. Suche im Code jeweils nach
dem genannten Anker (Zeilennummern verschieben sich, Suchbegriffe nicht).

### 1) Seiten-Komponente schreiben

Lege eine neue Funktion an – am besten direkt neben einer bestehenden, einfachen
Seite (z. B. suche `function LeistungenPrivatPage` und orientiere dich am
Muster). Ein schlankes Grundgerüst:

```js
function BeispielSeitePage({ setPage, lang, t }) {
  useScrollAnim();                 // blendet .fade-up-Elemente beim Scrollen ein
  const isDE = lang === 'DE';
  return e('div', { className: 'page-enter' },
    e(PageHero, {
      label:   isDE ? 'Rubrik'                : 'Section',
      title:   isDE ? 'Überschrift in '       : 'Headline in ',
      accent:  isDE ? 'zwei Farben.'          : 'two colours.',   // grün hervorgehoben
      subtitle: isDE
        ? ['Ein kurzer Untertitel, ein bis zwei Zeilen.']
        : ['A short subtitle, one or two lines.'],
    }),

    e('section', { className: 'py-20 bg-white' },
      e('div', { className: 'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className: 'font-display fade-up',
          style: { fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: '#1A1917',
                   marginBottom: '16px', fontFamily: "'Cormorant Garamond',serif" } },
          isDE ? 'Ein Abschnitt' : 'A section'),
        e('p', { className: 'fade-up',
          style: { fontSize: '15px', lineHeight: 1.8, color: 'var(--muted)',
                   maxWidth: '720px', fontFamily: "'DM Sans',sans-serif" } },
          isDE ? 'Hier steht der Fließtext …' : 'Body text goes here …'),
        e('button', { className: 'btn-p fade-up', style: { marginTop: '24px' },
          onClick: () => { setPage('kontakt'); window.scrollTo(0, 0); } },
          isDE ? 'Kontakt aufnehmen' : 'Get in touch'),
      ),
    ),
  );
}
```

Bausteine, die dir zur Verfügung stehen (siehe „Design-Bausteine" unten):
`PageHero`, die Klassen `max-w-site`, `py-20`, `bg-white`, `font-display`,
`fade-up`, `page-enter`, die Buttons `.btn-p` (grün) / `.btn-s` (Umriss), die
Labels `.label` / `.tag`, der Trennstrich `.divider`.

### 2) In `validPages` eintragen

Suche `const validPages = [` und füge den Schlüssel hinzu:

```js
const validPages = [ …, 'beispiel-seite', … ];
```

> Wichtig: **`validPages` ist die zentrale Seitenliste.** Vorrendern und Sitemap
> lesen sie automatisch aus – steht dein Schlüssel hier, wird die Seite beim
> Zusammenführen von der Projektleitung mit vorgerendert und in die Sitemap
> aufgenommen. Du musst dafür **nichts** in `tools/` anfassen.

### 3) In der Seiten-Zuordnung registrieren

Suche `const pages = {` und ordne dem Schlüssel deine Komponente zu:

```js
const pages = {
  home: e(HomePage, props),
  …
  'beispiel-seite': e(BeispielSeitePage, props),
};
```

### 4) Seitentitel (DE + EN) ergänzen

Suche `const pageTitles = {`. Dort gibt es einen Block `DE:` und einen `EN:`.
Trage in **beiden** einen Titel für den `<title>`-Tag / Browser-Tab ein:

```js
DE: { …, 'beispiel-seite': 'Beispiel-Seite | NSBB Steuerberatung', … }
EN: { …, 'beispiel-seite': 'Example Page | NSBB Tax Advisors', … }
```

### 5) In die Navigation aufnehmen (falls die Seite verlinkt sein soll)

Suche das Navigations-Array (ein `nav`/`navItems`-Array mit Einträgen der Form
`{ label, altLabel, key }`, in der Nähe des Kopfmenüs) und ergänze einen
Eintrag – entweder als eigenen Menüpunkt oder als Unterpunkt (`children`) eines
bestehenden. Für den Footer gibt es weiter unten eine ähnliche Liste.

Soll die Seite **nicht** ins Menü, aber von einer anderen Seite aus verlinkt
werden, genügt irgendwo ein Button/Link mit
`onClick: () => { setPage('beispiel-seite'); window.scrollTo(0,0); }`.

### 6) Prüfen, Version erhöhen, Changelog

```bash
node --check assets/js/app.js        # muss fehlerfrei sein
python3 -m http.server 8080          # http://localhost:8080 – Seite im Browser ansehen
```

Dann in `index.html` **alle** `?v=`-Nummern auf das heutige Datum erhöhen
(z. B. `?v=20260805`) und einen Eintrag in `changelog.md` schreiben: was, warum,
wie geprüft. **Wunsch-Meta-Beschreibung** (1–2 Sätze für Google) am besten mit
in den Changelog-Eintrag schreiben – die Projektleitung trägt sie beim
Vorrendern ein; ohne Angabe wird die allgemeine Seitenbeschreibung verwendet.

Das war's aus deiner Sicht. **Vorrendern, Sitemap und Upload macht die
Projektleitung** beim Zusammenführen (sie liest deine Seite automatisch aus
`validPages`).

---

## Design-Bausteine (Kurzreferenz)

**Farben** (CSS-Variablen, in `style.css` definiert):
`--accent` `#4A7C59` (Grün), `--accent-dark` `#3A6347`, `--accent-subtle`
`#EAF0EC`, `--text` `#2A2A28`, `--muted` `#6B6358`, `--border` `#E2DDD8`,
`--offwhite` `#F7F6F3`, `--cream` `#F0EEE9`.

**Schriften:** Überschriften in **Cormorant Garamond** (Serife,
`font-family:"'Cormorant Garamond',serif"` bzw. Klasse `font-display`),
Fließtext/Labels in **DM Sans** (`font-family:"'DM Sans',sans-serif"`).

**`PageHero`** – der Seitenkopf mit dem warmen Verlauf. Props:
`label` (kleines grünes Kapitälchen), `title` (dunkler Teil der Überschrift),
`accent` (grün hervorgehobener Teil), `subtitle` (Array von Zeilen oder String),
`fit` (optional, kompaktere Höhe).

**Wiederkehrende Klassen:** `max-w-site mx-auto px-5 md:px-8` (zentrierter
Inhaltsrahmen), `py-20` / `py-16` (Abschnittsabstände), `bg-white`, `fade-up`
(Einblenden beim Scrollen – dafür oben im Komponentenkopf `useScrollAnim()`
aufrufen), `page-enter` (sanfter Seitenwechsel). Buttons: `.btn-p` (grün
gefüllt), `.btn-s` (Umriss). Kleine Auszeichnungen: `.label` (grünes
Kapitälchen), `.tag` (Pille), `.divider` (kurzer grüner Strich).

Am schnellsten kommst du weiter, wenn du eine **bestehende, ähnliche Seite als
Vorlage** kopierst (z. B. eine der `Branche…`- oder `Intl…`-Seiten) und Texte,
Titel und Schlüssel anpasst.

---

## Bilder

Die Website liefert **WebP** aus (`assets/images/`), die Originale liegen in
`_source/images/`. Wenn deine Seite ein neues Bild braucht: das Original nach
`_source/images/` legen und eine WebP-Fassung nach `assets/images/` erzeugen
(z. B. `cwebp -q 82 -metadata none _source/images/neu.jpg -o assets/images/neu.webp`,
oder notfalls ein Online-Konverter). In `app.js` dann `assets/images/neu.webp`
referenzieren, immer mit `width`/`height`/`alt` (verhindert Layout-Sprünge).

---

## Was du NICHT tust

- **Nicht** `assets/js/vendor/react-bundle.js` ändern (Fremdbibliothek).
- **Nicht** `app.js` umbauen/umformatieren – nur ergänzen.
- **Nicht** deployen: keine Skripte in `tools/` ausführen, nichts hochladen.
- **Nicht** die Ordner `daten/` (Redaktionsinhalte, liegen auf dem Server) oder
  `build/` (werden erzeugt) bearbeiten – falls im ZIP nicht vorhanden, ist das
  Absicht.
- Offene Punkte aus `changelog.md` **nicht** eigenmächtig angehen – nur die
  neuen Seiten schreiben. Auffälligkeiten lieber im Changelog vermerken.

---

## Rückgabe an die Projektleitung

Wenn die Seite(n) fertig sind: **den gesamten Ordner wieder als ZIP** an die
Projektleitung geben. Sie führt die Änderungen zusammen, rendert die neuen
Seiten vor, aktualisiert die Sitemap und stellt alles online. Damit das sauber
gelingt, ist der ausgefüllte **`changelog.md`-Eintrag** das Wichtigste – daran
sieht die Projektleitung, was hinzugekommen ist und warum.
