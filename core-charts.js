/* Charts (plain SVG, no library, works offline) and shared labels/pills. */
window.AT = window.AT || {};
(function (AT) {
  const { esc, fmt, dShort } = AT.u;
  const R = AT.rules;

  /* colour groups; order validated for colour-blind separation, keep it */
  const CAT = {
    improved: { key: "cat_improved", c: "--improved", p: "p-improved" },
    healthy:  { key: "cat_healthy",  c: "--healthy",  p: "p-healthy" },
    worse:    { key: "cat_worse",    c: "--worse",    p: "p-worse" },
    discuss:  { key: "cat_discuss",  c: "--discuss",  p: "p-discuss" },
    same:     { key: "cat_same",     c: "--same",     p: "p-same" }
  };
  const CAT_ORDER = ["improved", "healthy", "worse", "discuss", "same"];
  const ICON = {
    improved: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    healthy:  '<svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    worse:    '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5v6M6 9.5v1" stroke="currentColor" stroke-width="2"/></svg>',
    discuss:  '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 3h8v5H5l-3 2z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    same:     '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8" stroke="currentColor" stroke-width="2"/></svg>'
  };
  const pill = (cat, text) => `<span class="pill ${CAT[cat] ? CAT[cat].p : "p-plain"}">${ICON[cat] || ""}${esc(text || (CAT[cat] ? AT.t(CAT[cat].key) : ""))}</span>`;
  const lvlPill = l => `<span class="pill ${l.k === "worse" ? "p-worse" : l.k === "same" ? "p-same" : l.k === "healthy" ? "p-healthy" : "p-plain"}">${esc(AT.t(l.key))}</span>`;
  const rangeText = d => !R.hasRange(d) ? AT.t("noRange") : d.lo <= 0 ? AT.t("upTo", fmt(d.hi)) : AT.t("fromTo", fmt(d.lo), fmt(d.hi));
  const tname = d => d.t && d.t.toLowerCase() !== d.n.toLowerCase() ? `${d.n} (${d.t})` : d.n;

  function donut(parts, size, stroke, center, label) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, tot = parts.reduce((s, p) => s + p.v, 0) || 1;
    const live = parts.filter(p => p.v).length; let off = 0;
    let s = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(label)}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="${stroke}"/>`;
    parts.forEach(p => {
      if (!p.v) return; const len = c * p.v / tot, gap = live > 1 ? 3 : 0;
      s += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(${p.color})" stroke-width="${stroke}" stroke-dasharray="${Math.max(0, len - gap)} ${c}" stroke-dashoffset="${-off}" transform="rotate(-90 ${size / 2} ${size / 2})" data-tip="${esc(p.tip || "")}"/>`;
      off += len;
    });
    return s + center + "</svg>";
  }

  /* one test over time; points = [{label, v or null}] */
  function lineChart(d, points, opts = {}) {
    const W = opts.w || 380, H = opts.h || 170, L = 12, Rt = 12, TOP = 26, B = 30;
    const vals = points.filter(p => p.v != null).map(p => p.v);
    const all = R.hasRange(d) ? vals.concat([d.lo, d.hi]) : vals;
    let mn = Math.min(...all), mx = Math.max(...all);
    const pad = (mx - mn) * 0.14 || Math.abs(mx) * 0.2 || 1; mn -= pad; mx += pad;
    if (mn < 0 && Math.min(...all) >= 0) mn = 0;
    const y = v => TOP + (H - TOP - B) * (1 - (v - mn) / (mx - mn));
    const n = points.length, x = i => n === 1 ? W / 2 : L + 70 + (W - L - Rt - 100) * (i / (n - 1));
    const desc = `${d.n}: ${points.filter(p => p.v != null).map(p => p.label + " " + fmt(p.v)).join(", ")}. ${AT.t("healthyWord")} ${rangeText(d)} ${d.u}.`;
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(desc)}">`;
    if (R.hasRange(d)) {
      const yt = Math.max(TOP - 6, y(d.hi)), yb = Math.min(H - B + 4, y(d.lo));
      s += `<rect x="${L}" y="${yt}" width="${W - L - Rt}" height="${Math.max(4, yb - yt)}" rx="6" fill="var(--band)"/>`;
      const ly = Math.max(TOP + 8, Math.min(H - B - 6, (yt + yb) / 2 + 4));
      s += `<text x="${L + 8}" y="${ly}" class="bandlab">${esc(AT.t("healthyLower"))}</text>`;
    }
    points.forEach((p, i) => { s += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${esc(p.label)}</text>`; });
    const pts = points.map((p, i) => ({ ...p, i })).filter(p => p.v != null);
    if (pts.length > 1) s += `<polyline fill="none" stroke="var(--muted)" stroke-opacity=".6" stroke-width="2" stroke-linejoin="round" points="${pts.map(p => x(p.i) + "," + y(p.v)).join(" ")}"/>`;
    pts.forEach((p, k) => {
      const lv = R.level(d, p.v), last = k === pts.length - 1;
      const col = lv.k === "worse" ? "--worse" : lv.k === "same" ? "--same" : "--healthy";
      s += `<circle cx="${x(p.i)}" cy="${y(p.v)}" r="${last ? 8 : 6}" fill="var(${col})" stroke="var(--surface)" stroke-width="2.5" data-tip="${esc(p.label + ": " + fmt(p.v) + " " + d.u + " (" + AT.t(lv.key) + ")")}"/>`;
      s += `<text class="vlab${last ? " last" : ""}" x="${x(p.i)}" y="${Math.max(14, y(p.v) - 13)}" text-anchor="middle">${fmt(p.v)}</text>`;
    });
    return s + "</svg>";
  }
  const cmpPoints = (A, id) => A.cmp.map(r => ({ label: dShort(r.date), v: r.values[id] ?? null }));

  /* the plain-language sentence about one test */
  function sentence(t) {
    const d = t.d, x = t.last.v;
    const times = R.hasRange(d) && x > d.hi && d.hi > 0 && x / d.hi >= 1.5 ? (x / d.hi >= 3 ? Math.round(x / d.hi) : +(x / d.hi).toFixed(1)) : null;
    return AT.t("sentence", {
      now: fmt(x), unit: d.u, range: rangeText(d), times,
      prev: t.prev ? fmt(t.prev.v) : null, prevDate: t.prev ? dShort(t.prev.date) : null,
      pct: t.prev ? Math.round(t.pct) : null, same: t.prev && Math.abs(t.pct) < 1.5,
      trend: d.kind === "diagnostic" ? null : AT.t(t.trend),
      notNewest: t.notInNewest ? AT.u.dLong(t.last.date) : null,
      diag: d.kind === "diagnostic" && t.out
    });
  }
  /* medicine flag in words */
  function flagText(f) {
    if (f.kind === "missing" || f.kind === "due") return AT.t("flag_" + f.kind, f.list.map(x => tname(x.d) + (f.kind === "due" ? " (" + AT.t("daysAgo", x.age) + ")" : "")).join(", "), f.meds.join(", "), f.list.length);
    return AT.t("flag_" + f.kind, { name: tname(f.d), x: fmt(f.x), unit: f.d.u, dir: f.dir, ch: f.ch, med: f.med });
  }

  AT.ui = { CAT, CAT_ORDER, ICON, pill, lvlPill, rangeText, tname, donut, lineChart, cmpPoints, sentence, flagText };
})(window.AT);
