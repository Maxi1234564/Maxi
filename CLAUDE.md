# NSBB Website – Regeln für dieses Projekt

> Diese Datei wird automatisch geladen. Der ausführliche Einstieg steht in
> **`PROMPT-FUER-CLAUDE.md`**, der Projektstand in **`changelog.md`**.

## Kontext in einem Satz

Dies ist eine **fertig optimierte, ausgelieferte Fassung** der NSBB-Website
(React-18-SPA ohne Build-Schritt) – kein Rohentwurf. Sie geht als ZIP zwischen
Kunde und Projektleitung hin und her und wird dort per Git **zusammengeführt**.

**Lies `changelog.md` – besonders „Offene Punkte" – bevor du etwas änderst.**
Vieles, was nach einem Fehler aussieht, ist erfasst und bewusst so.

## Harte Regeln

1. **Nicht umbauen.** `assets/js/app.js` ist groß und in
   `React.createElement`-Schreibweise. Das ist bekannt und Absicht. Kein
   Refactoring, keine Umformatierung, keine Dateiaufteilung, kein Build-System,
   kein JSX, kein Paketmanager – auch nicht nebenbei. Nur die Stellen ändern, um
   die es inhaltlich geht. Großflächige Diffs machen den Merge unmöglich.
2. **`assets/js/vendor/react-bundle.js` nicht anfassen.** Fremdbibliothek.
3. **Keine externen Dienste.** Keine Google Fonts, kein CDN, keine Analytics,
   kein `<script src="https://…">`. Schriften und React liegen absichtlich
   lokal – Performance *und* Datenschutz (keine Besucher-IPs in die USA).
4. **Nach jeder `app.js`-Änderung:** `node --check assets/js/app.js`.
   Ein Syntaxfehler legt die komplette Website lahm.
5. **Nach jeder Änderung an `app.js` / `style.css` / `fonts.css`:**
   `?v=20260717` in der `index.html` auf ein neues Datum hochzählen – sonst
   sieht die Änderung bei wiederkehrenden Besuchern bis zu ein Jahr lang niemand.
6. **Bilder als WebP** nach `assets/images/`, Original nach `_source/images/`.
   Referenzen in `app.js` nicht auf JPG/PNG zurückstellen.
7. **Jede Änderung in `changelog.md` eintragen** (Vorlage am Dateiende): was,
   warum, wie geprüft. Es gibt keine geteilte Versionsverwaltung – was nicht im
   Changelog steht, geht beim Zusammenführen verloren.
8. **Nichts löschen:** `_source/`, `changelog.md`, `README.md`, `.htaccess`,
   `robots.txt`, `sitemap.xml`, `tools/`.
9. **Bekannte offene Punkte nicht eigenmächtig angehen** (siehe `changelog.md`),
   sonst kollidiert es mit der Arbeit der Projektleitung. Auffälligkeiten
   **melden statt beheben**.

## Wo was liegt

* Alle Texte (DE + EN), alle Seiten, die Logik → `assets/js/app.js`
* Aussehen → `assets/css/style.css`
* Ausgelieferte Bilder (WebP) → `assets/images/` · Originale → `_source/images/`
* Serverkonfiguration (All-Inkl/Apache) → `.htaccess`

## Testen

```bash
python3 -m http.server 8080     # http://localhost:8080
node --check assets/js/app.js
```

Geänderte Seiten tatsächlich im Browser ansehen, nicht nur den Code prüfen.
