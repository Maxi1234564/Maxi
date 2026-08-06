# Roadmap – NSBB Website

**Stand: 20. Juli 2026**

Diese Datei sammelt Vorhaben, die **bewusst zurückgestellt** wurden – entweder
weil sie erst nach der Liveschaltung sinnvoll sind oder weil eine einfachere
Zwischenlösung vorgezogen wurde.

> **Abgrenzung:**
> **[`TODO.md`](TODO.md)** = was vor bzw. für den Livegang zu tun ist.
> **ROADMAP.md** (diese Datei) = was danach oder als spätere Ausbaustufe kommt.
> **[`changelog.md`](changelog.md)** = was bereits getan wurde und warum.

---

## 1. Standortkarte als Zwei-Klick-Lösung

**Status:** zurückgestellt · **Auslöser:** Google Maps wurde am 20.07.2026
ersatzlos entfernt.

### Ausgangslage

Die frühere Fassung bettete auf der Kontaktseite je Standort eine **Google-Maps-
Karte** ein (`<iframe>`). Diese Karte lud beim Seitenaufruf **ungefragt von
Google** und übertrug dabei die IP-Adresse jedes Besuchers an einen US-Server –
ohne Einwilligung. Bei einer Steuerkanzlei ist das ein Datenschutzrisiko und
war Auslöser für den Cookie-Banner.

### Was jetzt gilt (die Zwischenlösung)

Die eingebettete Karte ist **entfernt**. An ihrer Stelle steht eine klickbare
Fläche **„Route planen · in Google Maps öffnen"**, die

* **nichts automatisch lädt** – die Seite überträgt keine Daten an Google, und
* Google Maps erst **nach aktivem Klick** in einem neuen Tab öffnet.

Die Adresse, die Telefonnummer und der Bewertungslink des Standorts bleiben
unverändert sichtbar. Aus Datenschutzsicht ist damit alles gelöst.

### Die spätere Ausbaustufe: echte Karte nach Klick

Wenn eine **sichtbare Karte** auf der Seite wieder gewünscht ist – ohne das
Datenschutzproblem –, ist die Zwei-Klick-Lösung der Weg:

1. Statt der Karte zeigt die Seite zunächst ein **statisches Vorschaubild**
   (oder die jetzige „Route planen"-Fläche) mit einem Hinweis:
   *„Zum Laden der Karte klicken. Dabei werden Daten an Google übertragen."*
2. **Erst der Klick** lädt die echte, interaktive Karte nach. Der Besucher hat
   damit aktiv eingewilligt.
3. Die Einwilligung kann pro Sitzung gemerkt werden (localStorage), damit die
   Karte beim nächsten Besuch direkt lädt.

**Aufwand:** ~3 Stunden. **Voraussetzungen / Entscheidungen:**

* Ob überhaupt eine eingebettete Karte gewünscht ist – die „Route planen"-Fläche
  erfüllt den praktischen Zweck (Anfahrt) bereits vollständig.
* Falls ja: In der `.htaccess` muss `frame-src` wieder für Google geöffnet
  werden (`frame-src https://www.google.com`). Aktuell steht dort bewusst
  `frame-src 'none'`.
* Ein statisches Kartenvorschaubild je Standort (kann aus einem Screenshot oder
  einer statischen Karten-API erzeugt werden).
* Ergänzung der Datenschutzerklärung um Google Maps (siehe TODO D2).

> **Empfehlung:** Nur umsetzen, wenn der Kunde die interaktive Karte wirklich
> will. Für die reine Anfahrt reicht die jetzige Lösung, und sie ist die
> datenschutzfreundlichste.

---

## 2. Redaktionsbereich / Adminzugang

**Status:** zurückgestellt · **wird erst nach der Liveschaltung benötigt.**

### Ausgangslage

Auf der Insights-Seite gab es ein Eingabefeld „Admin-Code" mit einem Passwort
**im Klartext im Quelltext** – für jeden lesbar. Das wurde am 20.07.2026
entfernt (siehe `changelog.md`). Die zugehörige „Beitrag anlegen"-Funktion war
ohnehin eine Attrappe: Neue Beiträge lagen nur im Arbeitsspeicher des Browsers
und waren beim nächsten Aufruf wieder weg.

### Warum das warten kann

* Die **Insights-Seite ist aktuell aus dem Menü genommen** (leere Rubrik).
* Solange **keine Fachbeiträge** veröffentlicht werden sollen, gibt es nichts
  zu verwalten – ein Redaktionsbereich löst dann ein Problem, das es noch nicht
  gibt.

### Der Grundsatz, der die Umsetzung bestimmt

> **Im Browser lässt sich nichts geheim halten.** Jede echte Zugangskontrolle
> muss auf dem Server stattfinden. Ein Passwortvergleich in JavaScript ist
> kein Schutz.

### Die drei Wege (ausführlich in `dokumente/Redaktionsbereich-Konzept.md`)

| Weg | Aufwand | Für wen |
|---|---|---|
| **Beiträge als Dateien pflegen** (empfohlen) | wenige Std | Beiträge kommen selten, werden ohnehin abgestimmt |
| **Verzeichnisschutz im KAS** | Minuten | ein, zwei Personen, ein gemeinsames Passwort |
| **Serverseitige Anmeldung (PHP)** | 1–2 Tage | mehrere Personen mit eigenen Zugängen |

**Empfehlung:** kurzfristig Weg 1 (ist faktisch schon der Zustand – es fehlen
nur die Beiträge). Ein Login mit Verwaltungsoberfläche nur bauen, wenn der
Kunde ausdrücklich selbst veröffentlichen will – und dann eher über ein
etabliertes System (Decap, Sanity) als per Eigenbau.

### Nächster konkreter Schritt

Nach der Liveschaltung mit dem Kunden klären:
1. Will die Kanzlei Fachbeiträge veröffentlichen? → wenn nein, entfällt dieser
   Punkt und die Insights-Seite bleibt draußen.
2. Wenn ja: Wer pflegt sie, wie oft? → daraus ergibt sich der Weg (1, 2 oder 3).

---

## Pflegehinweis

Wird ein Roadmap-Punkt umgesetzt, wandert er aus dieser Datei in die
`changelog.md` (was getan wurde und warum). Neue zurückgestellte Vorhaben
kommen hierher, nicht in die `TODO.md`.
