// Tests für Geometrie und Aufgabenprüfung. Sie laden den Code direkt aus index.html.
// Aufruf: node test/geo.test.mjs
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dir, '..', 'index.html'), 'utf8');
const code = id => html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`))[1];
const ctx = {}; vm.createContext(ctx);
vm.runInContext(code('geo') + code('aufgaben') + ';this.Geo = Geo; this.Aufgaben = Aufgaben;', ctx);
const { Geo, Aufgaben } = ctx;

let pass = 0, fail = 0;
const t = (name, cond, extra = '') => { if (cond) { pass++; console.log('  ✓', name); } else { fail++; console.log('  ✗', name, extra); } };
const P = (x, y) => ({ x, y });
const near = (a, b, e = 1e-9) => Math.abs(a.x - b.x) < e && Math.abs(a.y - b.y) < e;
const nAx = (pts, tol = 1e-3) => { const r = Geo.symmetryAxes(pts, true, tol); return r === 'unendlich' ? Infinity : r.length; };

console.log('Spiegelung');
const senk = { a: P(7, 0), b: P(7, 10) }, waag = { a: P(0, 5), b: P(14, 5) }, diag = { a: P(0, 0), b: P(10, 10) };
t('senkrechte Achse x = 7: (2|2) → (12|2)', near(Geo.reflect(P(2, 2), senk), P(12, 2)));
t('waagerechte Achse y = 5: (3|1) → (3|9)', near(Geo.reflect(P(3, 1), waag), P(3, 9)));
t('Diagonale y = x: (5|2) → (2|5)', near(Geo.reflect(P(5, 2), diag), P(2, 5)));
t('Punkt auf der Achse bleibt liegen', near(Geo.reflect(P(7, 3.3), senk), P(7, 3.3)));
const Q = P(3.7, 8.1), Q2 = Geo.reflect(Q, { a: P(1, 2), b: P(4, 7) });
t('zweimal spiegeln ergibt den Ausgangspunkt', near(Geo.reflect(Q2, { a: P(1, 2), b: P(4, 7) }), Q, 1e-9));
t('gleicher Abstand zur Achse', Math.abs(Geo.distToLine(Q, { a: P(1, 2), b: P(4, 7) }) - Geo.distToLine(Q2, { a: P(1, 2), b: P(4, 7) })) < 1e-9);
t('Verbindung steht senkrecht auf der Achse', Geo.isPerpendicularTo(Q, Q2, { a: P(1, 2), b: P(4, 7) }, 0.001));
t('Achse als {Punkt, Winkel}: 45°', Math.abs(Geo.toPointAngle(diag).angle - 45) < 1e-9);

console.log('Kästchen');
t('Kästchen (2|3) an x = 7 → (11|3)', JSON.stringify(Geo.mirrorCell({ x: 2, y: 3, c: 'b' }, senk)) === JSON.stringify({ x: 11, y: 3, c: 'b' }));
t('Kästchen (5|2) an y = x → (2|5)', JSON.stringify(Geo.mirrorCell({ x: 5, y: 2, c: 'g' }, diag)) === JSON.stringify({ x: 2, y: 5, c: 'g' }));
t('schräge Achse (30°): kein Kästchenbild', Geo.mirrorCell({ x: 1, y: 1 }, { a: P(0, 0), b: P(Math.sqrt(3), 1) }) === null);
t('Achse durch Kästchenmitten (x = 7,5): (1|1) → (13|1)', JSON.stringify(Geo.mirrorCell({ x: 1, y: 1, c: 'b' }, { a: P(7.5, 0), b: P(7.5, 1) })) === JSON.stringify({ x: 13, y: 1, c: 'b' }));
t('Achse x = 7,25: kein Kästchenbild', Geo.mirrorCell({ x: 1, y: 1 }, { a: P(7.25, 0), b: P(7.25, 1) }) === null);
const kreuz = [P(1, 0), P(0, 1), P(1, 1), P(2, 1), P(1, 2)].map(p => ({ ...p, c: 'b' }));
t('Kreuz aus 5 Kästchen: 4 Spiegelachsen', Geo.cellAxes(kreuz, true).length === 4);
t('L aus 3 Kästchen: 1 Spiegelachse (diagonal)', Geo.cellAxes([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }].map(c => ({ ...c, c: 'b' })), true).length === 1);
t('Farbe zählt: zweifarbiges Paar hat weniger Achsen', Geo.cellAxes([{ x: 0, y: 0, c: 'b' }, { x: 1, y: 0, c: 'g' }], true).length === 1 && Geo.cellAxes([{ x: 0, y: 0, c: 'b' }, { x: 1, y: 0, c: 'g' }], false).length === 2);

console.log('Spiegelachsen von Figuren');
t('Quadrat: 4', nAx([P(0, 0), P(4, 0), P(4, 4), P(0, 4)]) === 4);
t('Rechteck: 2', nAx([P(0, 0), P(6, 0), P(6, 3), P(0, 3)]) === 2);
t('Raute: 2', nAx([P(0, 4), P(3, 0), P(0, -4), P(-3, 0)]) === 2);
t('Drachen: 1', nAx([P(0, 0), P(3, 5), P(0, 12), P(-3, 5)]) === 1);
t('gleichschenkliges Trapez: 1', nAx([P(2, 0), P(6, 0), P(8, 4), P(0, 4)]) === 1);
t('Parallelogramm: 0', nAx([P(0, 0), P(5, 0), P(7, 3), P(2, 3)]) === 0);
t('gleichseitiges Dreieck: 3', nAx([P(0, 0), P(1, 0), P(0.5, Math.sqrt(3) / 2)]) === 3);
t('regelmäßiges Sechseck: 6', nAx([0, 1, 2, 3, 4, 5].map(k => P(Math.cos(k * Math.PI / 3), Math.sin(k * Math.PI / 3)))) === 6);
t('Quadrat mit Zusatzpunkt auf einer Seite: 4', nAx([P(0, 0), P(2, 0), P(4, 0), P(4, 4), P(0, 4)]) === 4);
t('Ecken symmetrisch, Seiten nicht: 0', nAx([P(0, 0), P(1, 3), P(4, 0), P(3, 3), P(2, 5)]) === 0);
t('fast gleichseitiges Dreieck ohne Einrasten (Toleranz 0,25): 3', nAx([P(0, 0), P(6.02, 0.05), P(3, 5.2)], 0.25) === 3);

console.log('Figurenvergleich');
const dr = [P(0, 0), P(4, 0), P(0, 3)];
t('anderer Startpunkt', Geo.compareFigures([P(4, 0), P(0, 3), P(0, 0)], dr, true, 0.01) === 'gleich');
t('anderer Umlaufsinn', Geo.compareFigures([P(0, 0), P(0, 3), P(4, 0)], dr, true, 0.01) === 'gleich');
t('gleiche Ecken, falsch verbunden', Geo.compareFigures([P(0, 0), P(4, 4), P(4, 0), P(0, 4)], [P(0, 0), P(4, 0), P(4, 4), P(0, 4)], true, 0.01) === 'eckenGleich');

console.log('Leiter: jede Stufe jeder Karte existiert');
for (const k of Aufgaben.KARTEN) {
  const n = Aufgaben.LEITER[k.fam].length;
  const ok = Array.from({ length: n }, (_, i) => !!Aufgaben.stufe(k, i + 1));
  t(`${k.id} ${k.titel}: ${ok.filter(Boolean).length}/${n}`, ok.every(Boolean));
}

console.log('Leiter: Musterlösung jeder Stufe besteht die Prüfung, ein Fehler fällt auf');
const viereck = { 0: [P(3, 7), P(9, 7), P(11, 3), P(5, 3)], 1: [P(7, 1), P(10, 4), P(7, 9), P(4, 4)], 2: [P(3, 3), P(11, 3), P(11, 7), P(3, 7)], 4: [P(4, 2), P(10, 2), P(10, 8), P(4, 8)] };
for (const k of Aufgaben.KARTEN) {
  for (let n = 1; n <= Aufgaben.LEITER[k.fam].length; n++) {
    const st = Aufgaben.stufe(k, n);
    const sc = { cells: JSON.parse(JSON.stringify(st.given.cells)), polys: JSON.parse(JSON.stringify(st.given.polys)), axes: JSON.parse(JSON.stringify(st.given.axes)), keineAchse: false };
    let falsch = null;
    if (st.typ === 'bild') {
      if (st.ziel.cells) { sc.cells.push(...st.ziel.cells.map(c => ({ ...c }))); falsch = s => { s.cells.pop(); }; }
      else { sc.polys.push({ id: 'k', pts: st.ziel.poly, c: 'b', closed: true }); falsch = s => { s.polys[s.polys.length - 1].pts[0] = P(s.polys[s.polys.length - 1].pts[0].x + 1, s.polys[s.polys.length - 1].pts[0].y); }; }
    } else if (st.typ === 'achseFinden') {
      sc.axes.push({ id: 'k', ...Aufgaben.axisOf(k) });
      falsch = s => { s.axes[0] = { id: 'k', a: P(s.axes[0].a.x + 1, s.axes[0].a.y + 1), b: P(s.axes[0].b.x + 1, s.axes[0].b.y + 1) }; };
    } else if (st.typ === 'fehler') {
      const l = st.achse, img = Aufgaben.mirrorStart(k, l);
      if (k.start.cells) { sc.cells = [...k.start.cells, ...img.cells].map(c => ({ ...c })); }
      else { sc.polys = [{ id: 's', pts: k.start.poly, c: 'b', closed: true }, { id: 'b', pts: img.poly, c: 'b', closed: true }]; }
      // Ohne Korrektur muss die Prüfung scheitern:
      const roh = { cells: st.given.cells, polys: st.given.polys, axes: st.given.axes };
      t(`${k.id} Stufe 5: unkorrigiertes Bild fällt auf`, !Aufgaben.pruefen(st, roh, {}).ok);
    } else if (st.typ === 'erfinden') {
      const l = st.achse;
      if (k.mat === 'kaestchen') { const c = [{ x: 3, y: 3, c: 'b' }, { x: 4, y: 4, c: 'g' }]; sc.cells = [...c, ...c.map(x => Geo.mirrorCell(x, l))]; falsch = s => { s.cells.pop(); }; }
      else { const f = [P(2, 2), P(5, 3), P(3, 6)]; sc.polys = [{ id: 'a', pts: f, c: 'b', closed: true }, { id: 'b', pts: f.map(p => Geo.reflect(p, l)), c: 'b', closed: true }]; falsch = s => { s.polys.pop(); }; }
    } else if (st.typ === 'eineAchse' || st.typ === 'alleAchsen') {
      if (!st.wahr.length) { sc.keineAchse = true; falsch = s => { s.keineAchse = false; s.axes.push({ id: 'x', a: P(7, 0), b: P(7, 10) }); }; }
      else { st.wahr.forEach((w, i) => sc.axes.push({ id: 'w' + i, a: w.a, b: w.b })); falsch = s => { s.axes.push({ id: 'x', a: P(0, 0), b: P(1, 0.3) }); }; }
    } else if (st.typ === 'veraendern' || st.typ === 'erfindenAchsen') {
      sc.polys = [{ id: 'f', pts: viereck[st.zielAnzahl], c: 'b', closed: true }];
      falsch = s => { s.polys[0].pts = viereck[st.zielAnzahl === 0 ? 1 : 0]; };
    }
    const r = Aufgaben.pruefen(st, sc, {});
    t(`${k.id} Stufe ${n} (${st.typ}): Lösung passt`, r.ok, r.text);
    if (falsch) { const s2 = JSON.parse(JSON.stringify(sc)); falsch(s2); t(`${k.id} Stufe ${n}: Fehler fällt auf`, !Aufgaben.pruefen(st, s2, {}).ok); }
  }
}

console.log('Einzelne Rückmeldungen');
const k2 = Aufgaben.KARTEN.find(k => k.id === 'k2'), s2 = Aufgaben.stufe(k2, 2);
const r1 = Aufgaben.pruefen(s2, { cells: [...s2.given.cells, { x: 9, y: 4, c: 'b' }], polys: [], axes: s2.given.axes }, {});
t('Treppe: verschobenes Kästchen wird markiert', !r1.ok && r1.marks.cells.length === 1 && /fehlen noch 10/.test(r1.text), r1.text);
const r2 = Aufgaben.pruefen(s2, { cells: [...s2.given.cells, ...s2.ziel.cells.map(c => ({ ...c, c: 'g' }))], polys: [], axes: s2.given.axes }, { farbe: false });
t('Einfarbig: Farbe zählt nicht', r2.ok);
const g1 = Aufgaben.KARTEN.find(k => k.id === 'g1'), sg = Aufgaben.stufe(g1, 2);
const r3 = Aufgaben.pruefen(sg, { cells: [], polys: [...sg.given.polys, { id: 'k', pts: sg.ziel.poly.slice().reverse(), c: 'b', closed: true }], axes: sg.given.axes }, {});
t('Dreieck rückwärts gespannt: passt', r3.ok);
const r4 = Aufgaben.pruefen(sg, { cells: [], polys: [...sg.given.polys, { id: 'k', pts: sg.ziel.poly.map(p => P(p.x - 2, p.y)), c: 'b', closed: true }], axes: sg.given.axes }, {});
t('Dreieck verschoben statt gespiegelt: alle 3 Ecken markiert', !r4.ok && r4.marks.pts.length === 3, r4.text);

console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`);
if (fail) process.exit(1);
