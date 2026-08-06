# TODO – NSBB Website

**Stand: 21. Juli 2026** · Testfassung: https://nsbb.de/2026/
Zentrale Arbeitsliste. Bei jeder Änderung mitpflegen.

> **Hinweis zu „GEO":** Der Begriff wird doppelt verwendet. Diese Liste
> behandelt beides getrennt:
> **Abschnitt 4** = lokale Auffindbarkeit (Berlin/Köln, Google Maps, Kartendienste)
> **Abschnitt 5** = Generative Engine Optimization (Sichtbarkeit in KI-Antworten)
>
> Falls nur eines gemeint war: der jeweils andere Abschnitt lässt sich streichen.

**Status:** `[ ]` offen · `[~]` in Arbeit · `[x]` erledigt · `[!]` Entscheidung nötig · `[§]` rechtliche Abnahme

---

## 0. Bereits erledigt (Kurzfassung)

<details>
<summary>28 Punkte – aufklappen</summary>

* [x] Monolith (1 MB `index.html`) in Dateistruktur aufgeteilt
* [x] Google Fonts lokal (kein Fremdaufruf, keine IP-Übertragung)
* [x] Bilder auf WebP (245 → 141 KB)
* [x] `.htaccess`: Brotli/gzip, Cache, Sicherheits-Header, CSP
* [x] Erstaufruf 1,1 MB → **311 KB**, Antwortzeit 0,11 s
* [x] Kritischer Fehler: mobiles Menü und Team-Profile zerstörten die Seite
* [x] Zurück-Button repariert (`hashchange`/`popstate`)
* [x] FAQ-Seite war per Direktaufruf nicht erreichbar
* [x] `contact.php`: beide Formulare, Header-Injection-Schutz, Honeypot, Rate-Limit
* [x] Kontaktformular von `mailto:` auf echten Serverversand
* [x] Kanonische Domain auf `nsbb.de` **ohne** www (Schleife verhindert)
* [x] Echte Adressen statt `#`-Navigation (41 Seiten)
* [x] Je Seite eine HTML-Datei mit eigenem Titel/Beschreibung/canonical
* [x] `sitemap.xml` mit 41 Adressen statt einer
* [x] Seitentitel für alle 41 Seiten, DE **und** EN
* [x] Formularfelder: Autovervollständigung, verknüpfte Beschriftungen, ARIA
* [x] Sprachwahl wird gemerkt (`?lang=en`, localStorage, Browsersprache)
* [x] Admin-Feld und Klartext-Passwort entfernt
* [x] Insights aus dem Menü (leere Rubrik)
* [x] Englischer Hero-Text auf 5 Zeilen angeglichen
* [x] Git-Repository, Versand-Tags, Deployment per SSH
* [x] Test- und Live-Paket getrennt, Testfassung auf `noindex`

</details>

---

## 1. Technisch

### Livegang erfolgt (21.07.) ✅

* [x] **SPF-Eintrag gesetzt** (Kunde, 21.07.) – `include:kasserver.com` bei
  1&1/IONOS ergänzt (Anleitung: `dokumente/Anleitung_SPF-Eintrag_nsbb.pdf`).
* [x] **Postfächer angelegt** (Kunde): `mail@` (Absender), `mandant@` (allgemeines
  Formular), `karriere@` (Bewerbungen). `info@nsbb.de` bleibt die sichtbare Adresse.
* [x] **PHP / SSL** – `contact.php` läuft, `https://` aktiv (http/www leiten um).
* [x] **WordPress unberührt = gesichert** – die Live-Fassung liegt im neuen Ordner
  `/www/htdocs/w01f9274/NSBB-2026/` **neben** dem WordPress-Ordner; die Domain wurde
  im KAS umgestellt. WordPress blieb liegen → **Rückweg jederzeit** (Domain zurück
  auf `nsbb.de` zeigen). Kein Löschen der 2,1-GB-Installation nötig.
* [x] **Livegang** – `nsbb.de` zeigt auf die neue Seite, live geprüft (siehe `changelog.md`).

**Einzige Restprüfung (Kunde):** eine echte Formular-Absendung, um die Zustellung in
`mandant@` / `karriere@` zu bestätigen. Danach: Sitemap in der Google Search Console
einreichen.

### Qualität

* [x] **Bildmaße gesetzt** (20.07.) – Logos mit `width`/`height`-Attributen
  gegen Layout-Sprünge. Team-/Standortbilder sind absolut positioniert in
  Containern fester Höhe – dort kein CLS.
* [x] **`aria-expanded`** (20.07.) – an allen 10 FAQ-Akkordeons, dem mobilen
  Untermenü und dem Desktop-Dropdown. Im Browser: togglet korrekt.
* [x] **Fokus-Falle im mobilen Menü behoben** (20.07.) – Fokus-Trap (Tab bleibt
  im Menü), Escape schließt, Fokus springt beim Öffnen hinein. Im Browser
  bestätigt.
* [x] **`role="dialog"`** (20.07.) – mobiles Menü, Team-Profil-Modal und
  Consent-Banner. Mit `aria-modal` und `aria-label`.
* [x] **Anfragenummer serverseitig** (H1, 20.07.) – zählt jetzt in `contact.php`
  (kanzleiweit eindeutig) statt pro Browser. Client-Zähler entfernt.
* [x] **Datei-Upload im Bewerbungsformular** (H1, 20.07.) – `KarriereForm` kann
  jetzt einen Lebenslauf anhängen (PDF/DOC/JPG, max. 5 MB); `contact.php` nimmt
  multipart an und hängt die Datei an die Mail. *Hinweis: Die zuvor als „defekt"
  vermutete Komponente war toter Code (nie gerendert) – das echte Formular hatte
  nie einen Datenverlust. Toter Code entfernt.*
* [~] **Portal-Umweg in `app.js`** – bewusst zurückgestellt (H1, 20.07.): reine
  Aufräumarbeit ohne sichtbaren Effekt, aber genau daran hängen die frisch in E1
  geprüften Menü-/Modal-Funktionen. Regressionsrisiko > Nutzen. *~30 Min*

---

## 2. SEO

### Wirkt sofort

* [x] **Eigene Beschreibung für alle 41 Seiten** (20.07.) – die 23 fehlenden
  ergänzt, je am Seiteninhalt orientiert. Auf dem Server stichprobenartig
  geprüft: alle verschieden. *Hinweis: `home` ist mit 212 Zeichen etwas lang
  (bestehender Marketing-Claim), Google kürzt – bewusst so belassen.*
* [x] **`og:image` gesetzt** (20.07.) – 1200×630 aus dem Logo auf
  Markenhintergrund (`tools/og-image-bauen.py`, reproduzierbar). Als JPG wegen
  Plattform-Kompatibilität. Auf dem Server erreichbar (200).
* [ ] **Sitemap in der Google Search Console einreichen** (nach Livegang)
* [ ] **Search Console und Bing Webmaster Tools einrichten** – ohne sie sieht
  niemand, ob die Seiten überhaupt indexiert werden

### Strukturell (der große Hebel)

* [x] **Vorrendern (Stufe 2) umgesetzt** (20.07.) – das Roh-HTML enthielt nur
  den Ladebildschirm (~200 Zeichen). Neues Werkzeug `tools/vorrendern.js` rendert
  jede der 41 Seiten in kopflosem Chrome vor und legt den Inhalt in
  `tools/prerender-cache/` ab; `tools/seiten-generator.js` setzt ihn beim
  Paketbau ein. Jetzt **900–11 222 Zeichen** sichtbarer Text je Seite im
  Roh-HTML. Besucher mit JS sehen unverändert den Ladebildschirm (createRoot
  übernimmt), Crawler/KI lesen den Text ohne JS. `app.js` unverändert.
  Details im `changelog.md`. **Damit ist GEO (Abschnitt 5) freigeschaltet.**
* [x] **Interne Verlinkung** (Grundstock) erledigt (F2 Teil 2, 20.07.) – im
  **Footer** eine echte `<a href>`-Navigationsleiste zu allen Hauptseiten
  ergänzt (steht fest im Roh-HTML, Crawler folgen ihr, SPA-Navigation bleibt).
  Die aufklappbaren Kopf-Menüs bleiben Buttons (im Snapshot ohnehin zu). *Optional
  später: kontextuelle Querverweise zwischen den Themenseiten im Fließtext.*
* [ ] **Sprechendere Adressen** erwägen: `/leistungen/international/dba` statt
  `/intl-dba`. Nur sinnvoll **vor** dem Livegang – danach kostet es
  Weiterleitungen. *~2 Std* `[!]` Entscheidung

---

## 3. Inhalt

* [x] **Insights-Seite → „Aktuelles"** (22.07.2026): Rubrik umbenannt und mit
  Redaktionsbereich (`/redaktion/`, Basic Auth) + Server-Ablage `daten/`
  umgesetzt. Kunde pflegt Beiträge + monatliche Mandanteninformation (PDF)
  selbst; erscheint ohne Redeploy. Details im Changelog. Zugang: Benutzer
  `redaktion`, Passwort separat/vertraulich. Kundenanleitung:
  `dokumente/Anleitung-Redaktionsbereich.md`.
* [ ] **Texte, Ansprechpartner, Telefonnummern, Öffnungszeiten** gegenlesen
* [§] **Impressum und Datenschutzerklärung** inhaltlich prüfen (Kanzlei/Anwalt)
* [ ] **FAQ ausbauen** – doppelt nützlich: für Besucher und für KI-Antworten
  (siehe Abschnitt 5)

---

## 4. GEO – lokale Auffindbarkeit (Berlin & Köln)

Für eine Kanzlei mit zwei Standorten der direkteste Weg zu Anfragen.

* [x] **Strukturierte Daten je Standort** (20.07.) – `Organization` +
  zwei `AccountingService`-Standorte mit Anschrift, Koordinaten, Telefon,
  `areaServed`, `founder`, `logo`, `knowsLanguage`. Über `@id` verknüpft.
  Auf dem Server valide, alle Google-Pflichtfelder erfüllt.
  **[x] Öffnungszeiten** (20.07.) vom Kunden geliefert und eingetragen:
  Mo–Do 08:00–17:30, Fr 08:00–16:30 (beide Standorte). Platzhalter-Hinweis
  aus dem Code entfernt.
* [x] **Google Business Profile verknüpft** (20.07.) – beide Standort-URLs
  gesetzt. Doppelt: als `sameAs` im JSON-LD (maschinenlesbar) **und** als
  sichtbarer Link „Auf Google ansehen & bewerten" auf der Kontaktseite
  (führt Besucher zu Bewertungen – stärkster lokaler Hebel).
* [ ] **Google Business Profile pflegen** (Kanzlei): Öffnungszeiten, Fotos,
  Leistungen, Beiträge, Bewertungen beantworten. Wirkt unabhängig von der
  Website und oft schneller.
* [ ] **NAP-Konsistenz prüfen** – Name, Anschrift, Telefon müssen auf Website,
  Google, Bing Places, Branchenverzeichnissen und der Steuerberaterkammer
  **exakt gleich** geschrieben sein. Abweichungen schwächen die Zuordnung.
* [ ] **Eigene Standortseiten** erwägen (`/standort-berlin`, `/standort-koeln`)
  mit Anfahrt, Parken, ÖPNV, Ansprechpartnern. Aktuell sind beide Standorte nur
  auf der Kontaktseite. *~4 Std* `[!]` Entscheidung
* [ ] **Einträge in Fachverzeichnissen** (Steuerberaterkammer, DATEV-Suche,
  regionale Verzeichnisse)

---

## 5. GEO – Generative Engine Optimization (KI-Antworten)

Sichtbarkeit in ChatGPT, Perplexity, Google AI Overviews, Copilot.
**Zunehmend relevant:** Wer „Steuerberater Wegzugsbesteuerung Berlin" fragt,
bekommt oft eine Antwort statt einer Linkliste – und wird nur genannt, wenn
die Quelle maschinell lesbar war.

* [x] **Vorrendern erledigt** (20.07.) – der bisherige Blocker. KI-Crawler führen
  überwiegend kein JavaScript aus; jetzt steht der volle Seitentext im Roh-HTML
  (siehe Abschnitt 2 und `changelog.md`). **Die Kategorie ist damit freigeschaltet;
  die folgenden Punkte wirken jetzt.**
* [ ] **Frage-Antwort-Struktur ausbauen.** KI-Systeme zitieren bevorzugt
  Abschnitte, die eine konkrete Frage direkt beantworten. Die Themenseiten
  („Wer darf besteuern?", „Wo zahle ich Steuern?") sind dafür bereits gut
  angelegt – die Antwort sollte im ersten Absatz stehen, nicht nach drei
  Absätzen Einleitung. *~3 Std*
* [x] **`FAQPage`-Auszeichnung** erledigt (F2 Teil 2, 20.07.) – 12 Seiten (FAQ +
  Themenseiten) tragen jetzt `schema.org/FAQPage`. Über einen Hook `useFaqSchema`
  aus den Seiten-eigenen FAQ-Daten, per Vorrender-Strecke in den statischen
  `<head>` – auch ohne JavaScript im Roh-HTML. *Hinweis: Googles sichtbare
  FAQ-Rich-Results sind seit 2023 eingeschränkt; Nutzen v. a. für KI/Bing/
  maschinelles Verständnis.*
* [x] **`Person`-Auszeichnung** für die Teamprofile erledigt (F2, 20.07.) –
  vier Personen auf `/ueber-uns` mit Position/Standort, verknüpft mit der
  Organisation. `Article` für Fachbeiträge entfällt, solange Insights leer ist.
* [ ] **Belege und Aktualität** – Verweise auf Paragrafen, BMF-Schreiben,
  Urteile mit Datum. KI-Systeme bevorzugen belegte, datierte Aussagen.
* [x] **`llms.txt`** erstellt (F2, 20.07.) – kompakte Zusammenfassung der Kanzlei
  für KI-Systeme mit Standorten, Leistungen und Kurzantworten zu den
  Schwerpunktthemen. Wird mit ausgeliefert (`/llms.txt`).
* [ ] **Crawler-Zugriff prüfen:** Sollen `GPTBot`, `PerplexityBot`,
  `ClaudeBot`, `Google-Extended` zugelassen werden? Das ist eine
  Geschäftsentscheidung: Sichtbarkeit in KI-Antworten gegen Kontrolle über die
  eigenen Inhalte. Aktuell erlaubt die `robots.txt` alles. `[!]`

---

## 6. Datenschutz

> **Kein Rechtsrat.** Verbindliche Beurteilung durch Fachanwalt für IT-Recht,
> bei einer Kanzlei zusätzlich abgestimmt mit dem Berufsrecht.
> Grundlage: `dokumente/Consent-und-Tracking-Konzept.md`

### Aktueller Zustand

Beim Seitenaufruf lädt **nichts Einwilligungspflichtiges** – Schriften und
React liegen lokal. Einzige Ausnahme: Google Maps auf der Kontaktseite.

### Offen

* [x] **Google Maps entfernt** (20.07.) – die eingebettete Karte lud ungefragt
  von Google. Ersetzt durch eine klickbare Fläche „Route planen", die nichts
  automatisch lädt. Im Browser bestätigt: **0 Google-Ressourcen** beim Aufruf.
  CSP auf `frame-src 'none'` verschärft. Die spätere Zwei-Klick-Karte steht in
  `ROADMAP.md`.
* [x] **Datenschutzerklärung vollständig ergänzt** (20.07.) – Google-Dienste
  (Consent Mode, Ads/Conversion, USA-Übermittlung, Widerruf) sowie
  Server-Logdateien, Auftragsverarbeitung (All-Inkl, AVV) und der Formular-
  Spam-Schutz (IP nur als Hash, max. 1 Std). Geprüft/freigegeben.
* [x] **Funktionsfähiger Consent-Banner + Google Tag Manager** (20.07.) –
  3 Kategorien (notwendig/Statistik/Marketing), gleichwertiges „Nur notwendige",
  Widerruf über den Fußzeilen-Link. GTM (`GTM-NNQTHD76`) lädt **erst nach
  Einwilligung**; Consent Mode v2 mit Default „denied". Im Browser bestätigt:
  vor Einwilligung 0 Google-Requests, nach „Alle akzeptieren" lädt GTM ohne
  CSP-Verstöße, „Nur notwendige" lädt nichts.
* [ ] **Auftragsverarbeitungsvertrag mit All-Inkl** abschließen/prüfen
* [x] **`.formlimit/`** in der Datenschutzerklärung erwähnt (D2, 20.07.) – IP nur
  als Hashwert, Speicherdauer max. 1 Std.

### Falls Analytics/Conversion-Tracking kommt

* [x] **Weg A umgesetzt** (20.07.): eigener Consent-Banner + Google Consent
  Mode v2, GTM erst nach Einwilligung.
* [x] **Content-Security-Policy erweitert** – Google-Domains auf Allowlist.
  ⚠️ **Kompromiss:** `'unsafe-inline'` bei `script-src` war nötig, weil GTM
  für Ads Conversion Inline-Skripte injiziert. Bewusste Folge der
  Ads-Entscheidung; dokumentiert in der `.htaccess`.
* [x] **Consent Mode v2** – Default „denied", Update bei Einwilligung.
* [ ] **Auftragsverarbeitungsvertrag mit Google**
* [§] **Sensible Seiten vom Tracking ausnehmen** – wer „Kanzleinachfolge" oder
  „Wegzugsbesteuerung" liest, gibt Hinweise auf seine Lebenssituation. Bei
  einem Berufsgeheimnisträger sollte das nicht bei Google landen.
  **Entscheidung: NICHT ausgenommen** (Projektleitung, 20.07.) – überall gleich.
* [!] **Ads-Conversion-Aktion im GTM konfigurieren.** Der Code lädt nur den
  GTM-Container. Welcher Klick als Conversion zählt (Conversion-ID + Label),
  muss die Kanzlei/Agentur **im GTM-Interface** (`GTM-NNQTHD76`) einrichten –
  ohne das misst GTM keine Ads-Conversions.
* [x] **Rechtliche Abnahme** des Consent-Banners und der Datenschutz-Bausteine
  erfolgt (20.07.) – Prüfhinweis aus dem Code entfernt.

---

## 7. Reihenfolge – was jetzt noch dran ist

Die **technische Entwicklung ist abgeschlossen** (Abschnitte 1–6 weitgehend `[x]`).
Was bleibt, liegt fast vollständig **beim Kunden / bei der Projektleitung**:

| # | Was | Wer |
|---|---|---|
| 1 | **SPF-Eintrag** setzen (Anleitung: `dokumente/Anleitung_SPF-Eintrag_nsbb.pdf`) + Zustelltest | Kunde/PL |
| 2 | **Postfächer** `mail@` / `mandant@` / `karriere@`, **PHP 8.1+**, **SSL**, **WordPress-Backup** | Kunde |
| 3 | **Livegang** (`tools/deploy.sh live` – bricht ab, solange WordPress erkannt wird) | Kunde/PL |
| 4 | Danach: **Sitemap in Search Console** einreichen, **Google-Business** pflegen | Kunde |
| — | Optional/später: Q&A-/FAQ-Ausbau, eigene Standortseiten, Fachverzeichnisse | Kunde (ggf. mit mir) |

---

## Pflegehinweis

Diese Datei ist die zentrale Arbeitsliste. Bei Änderungen:
Status anpassen, erledigte Punkte nach Abschnitt 0 verschieben, und die
inhaltliche Begründung in die `changelog.md` schreiben – **nicht hierher**.
Diese Liste sagt *was noch zu tun ist*, der Changelog *was getan wurde und warum*.
