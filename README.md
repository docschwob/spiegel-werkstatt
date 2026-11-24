# Spiegel-Werkstatt

Digitale Werkstatt zur Achsensymmetrie für die Grundschule (Klasse 1–4) und für die Lehrerbildung.
Kinder färben Kästchen, spannen Figuren wie am Geobrett, stellen einen Spiegel auf, falten an der Achse,
halten Entdeckungen im Forscherbuch fest und üben mit einer Schwierigkeitsleiter.

**Online:** https://docschwob.github.io/spiegel-werkstatt/
**Offline:** Repository herunterladen und `index.html` per Doppelklick öffnen (der Ordner `fonts` muss daneben liegen).

## Funktionen

**Werkstatt** (offenes Arbeiten, ohne Bewertung)
- Kästchen färben, Figuren spannen (Einrasten an den Gitterpunkten zuschaltbar), Spiegelachsen zeichnen, verschieben und drehen (Anfasser oder zwei Finger)
- *Spiegel* als eigene Handlung: Der Spiegel zeigt das Spiegelbild dynamisch, solange er steht. *Abzeichnen* überträgt das Spiegelbild als eigene Figur. *Falten* klappt eine Seite über die Achse.
- *Messen*: Abstand zur Achse, Lot, Punkt und Spiegelpunkt verbinden – nur bei Bedarf
- *Festhalten* als Karte (Frage, Versuch, Vermutung, Entdeckung), mit Vorher-Nachher und dem eigenen Weg

**Aufgaben** mit Schwierigkeitsleiter; die Kinder wählen die Stufe selbst

| Stufe | Spiegelbilder (Kästchen, Geobrett) | Spiegelachsen finden |
|---|---|---|
| 1 | Mit Spiegel: Der Spiegel steht, das Kind legt nach, was es sieht | Eine Achse finden |
| 2 | Spiegelbild ohne Spiegel, Achse senkrecht oder waagerecht | Alle Achsen finden („Keine Achse“ möglich) |
| 3 | Dieselbe Figur, schräge Achse | Figur verändern: genau *n* Achsen |
| 4 | Achse finden: „Wo steht der Spiegel?“ | Erfinden: Figur mit genau *n* Achsen (offen) |
| 5 | Fehler finden und verbessern | |
| 6 | Erfinden (offen); die Figur kann als Aufgabe für andere gespeichert werden | |

- *Prüfen* nur auf Anfrage: erst „Passt / Passt noch nicht“, auf Wunsch „Wo hakt es?“ mit farbiger Markierung
- Für Reflexionsphasen lässt sich Prüfen über den Link ausblenden: `…/spiegel-werkstatt/#ohne-pruefen`
- *Hilfen* wählt das Kind selbst; sie werden protokolliert und nehmen nie die ganze Aufgabe ab: Spiegel 3 Sekunden aufstellen, ein Kästchen bzw. eine Ecke vorgeben, Abstände zeigen, Falten, Mitten zeigen, eine von mehreren Achsen zeigen
- *Mein Weg*: Schrittprotokoll mit Zeitstempeln, Rückgängig und Wiedergabe

**Forscherbuch und Austausch**
- Karten nach Forscherfrage gebündelt („Versuch 1, Versuch 2, Vermutung 3 …“), wieder öffnen mit „Weiterforschen“
- Für Lehrkräfte: Galerie, bis zu vier Karten nebeneinander mit Gesprächsfragen, Aufgaben ein- und ausblenden, Karten als Datei exportieren und auf einem anderen Gerät importieren
- Beamer-Modus (große Darstellung ohne Menüs), helles und dunkles Design, große Knöpfe, alles einfarbig

## Aufgaben und Quellen

Die Aufgabenformate lehnen sich an *Das Zahlenbuch* (Klett, Lehrerbände 1–4) und an PIKAS (DZLM) an.
**Alle Figuren und Aufgabentexte sind eigene Formulierungen und sollten fachlich geprüft werden.**

| Karte | Klasse | Anlehnung |
|---|---|---|
| Tanne, Treppe, Boot im Wasser, Buntes Muster | 1–2 | Zahlenbuch 2, S. 66/67 („Zeichne ab. Ergänze das Spiegelbild.“, Fehler korrigieren) |
| Dreieck, Dreieck an der Achse, Viereck, Fünfeck | 3–4 | Zahlenbuch 3, S. 92/93 (Formen am Geobrett spiegeln, Partnerspiel) |
| Rechteck, Quadrat, Raute, Trapez | 3–4 | Zahlenbuch 4, S. 62/63 (Vierecke mit einer oder mehreren Symmetrieachsen) |
| Drachen, Parallelogramm | 3–4 | PIKAS Haus 7, „Faltschnitte“ (Nowack 2012), A2/A2*; Zahlenbuch 1, S. 52/53 |
| Leiterstufen | – | Zahlenbuch 1, S. 74/75 (Spiegel als Konstruktionswerkzeug, „Aus … mache …“); Zahlenbuch 2, S. 66/67 (Spiegel als Kontrollinstrument, Spiegelbilder korrigieren) |

Die Hilfe „Spiegel kurz aufstellen“ greift die Unterstützungsidee aus Zahlenbuch 2, S. 66 auf: Spiegel aufsetzen, Bild merken, ohne Spiegel legen.
Die Aufgaben liegen als Datenstruktur im Code (`KARTEN` und `LEITER` in `index.html`), sodass ein Lehrkraft-Editor (Version 2) daran anschließen kann.

## Urheber, Datenschutz, Lizenzen

- Urheber: Dr. Simeon Schwob (GIMB, Universität Münster). Privates Angebot, kein offizielles Angebot der Universität. Impressum: https://docschwob.github.io/impressum.html
- Keine Datenerhebung: kein Login, keine Konten, kein Tracking, keine externen Dienste. Alles wird nur lokal im Browser gespeichert (localStorage). Bitte in Karten nur Kürzel eintragen.
- Hoster: GitHub Pages. GitHub verarbeitet beim Aufruf technisch notwendige Verbindungsdaten (z. B. IP-Adresse).
- Code: MIT (siehe `LICENSE`). Aufgaben, Texte und Abbildungen: CC BY 4.0. Schrift: Atkinson Hyperlegible, SIL Open Font License 1.1 (`fonts/OFL.txt`).

## Technik

Eine einzige HTML-Datei mit HTML, CSS und JavaScript – ohne Build-Werkzeuge, ohne Server, ohne externe Bibliotheken.
Der Geometrie-Kern (`<script id="geo">`) und die Aufgabenprüfung (`<script id="aufgaben">`) sind reine Funktionen ohne Oberfläche.

Tests (Node.js, ohne Abhängigkeiten): `node test/geo.test.mjs`
