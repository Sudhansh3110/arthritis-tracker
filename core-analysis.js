/* ==========================================================================
   THE RULES. Everything on the page is worked out here from the saved data,
   so a new report, a new test or a new medicine updates every section.

   Status of one value:  Healthy / At the edge / Slightly high-low (<10% out)
                         Too high-low / Much too high (>2x the upper limit)
   Trend vs the previous value of the same test:
     Getting better  = moved toward the healthy range (or came back into it)
     Getting worse   = moved away from it
     Not improved    = still outside and changed by less than 1.5%, or first test
     Healthy         = inside the range and stayed inside
     Discuss         = diagnostic tests such as RF (never a goal)
   Comparison window = the 3 newest reports.
   ========================================================================== */
window.AT = window.AT || {};
(function (AT) {
  const { daysSince } = AT.u;

  function def(id) {
    const st = AT.state;
    const base = AT.TESTS[id] || st.custom[id] || { n: id, t: id, u: "", lo: 0, hi: 0, m: "", kind: "track" };
    const r = st.ranges[id];
    const d = Object.assign({ id, kind: "track" }, base, r ? { lo: r.lo, hi: r.hi } : {});
    d.n = AT.tx("tests", id, "n", d.n);
    d.m = AT.tx("tests", id, "m", d.m);
    return d;
  }
  const hasRange = d => isFinite(d.lo) && isFinite(d.hi) && d.hi > d.lo;
  const inRange = (d, x) => x >= d.lo && x <= d.hi;
  function dist(d, x) {
    if (!hasRange(d)) return 0;
    if (x < d.lo) return (d.lo - x) / Math.max(Math.abs(d.lo), 1e-9);
    if (x > d.hi) return (x - d.hi) / Math.max(Math.abs(d.hi), d.hi - d.lo, 1e-9);
    return 0;
  }
  /* returns {k: colour group, key: i18n key} */
  function level(d, x) {
    if (!hasRange(d)) return { k: "plain", key: "lv_norange" };
    if (d.hi > 0 && x > 2 * d.hi) return { k: "worse", key: "lv_muchHigh" };
    if (x > d.hi * 1.1) return { k: "worse", key: "lv_high" };
    if (x < d.lo * 0.9) return { k: "worse", key: "lv_low" };
    if (x > d.hi) return { k: "same", key: "lv_slHigh" };
    if (x < d.lo) return { k: "same", key: "lv_slLow" };
    const edge = (d.hi - d.lo) * 0.02;
    if ((d.lo > 0 && x <= d.lo + edge) || x >= d.hi - edge) return { k: "same", key: "lv_edge" };
    return { k: "healthy", key: "lv_ok" };
  }

  /* medicine matching: a known word at the start of a word in the typed name */
  function matchMeds(name) {
    const n = " " + name.toLowerCase() + " ";
    return AT.MEDS.filter(m => m.match.some(a => { const i = n.indexOf(a); return i > 0 && /[\s\-\(\/0-9]/.test(n[i - 1] || " "); }));
  }

  function analyse() {
    const st = AT.state;
    const reps = [...st.reports].sort((a, b) => a.date.localeCompare(b.date));
    const cmp = reps.slice(-3), older = reps.slice(0, -3), newest = reps.at(-1) || null;
    const ids = [...new Set(reps.flatMap(r => Object.keys(r.values)))];

    const tests = ids.map(id => {
      const d = def(id);
      const series = reps.filter(r => r.values[id] != null).map(r => ({ date: r.date, v: r.values[id], rid: r.id }));
      const last = series.at(-1), prev = series.length > 1 ? series.at(-2) : null;
      const inCmp = cmp.some(r => r.values[id] != null);
      const notInNewest = !!newest && newest.values[id] == null;
      const lv = level(d, last.v);
      const pct = prev ? (prev.v !== 0 ? (last.v - prev.v) / Math.abs(prev.v) * 100 : 0) : null;
      const d0 = prev ? dist(d, prev.v) : null, d1 = dist(d, last.v);
      let trend, cat;
      if (!prev) trend = "tr_first";
      else if (Math.abs(pct) < 1.5) trend = "tr_same";
      else if (d1 < d0) trend = "tr_toward";
      else if (d1 > d0) trend = "tr_away";
      else trend = pct > 0 ? "tr_upOk" : "tr_downOk";
      if (d.kind === "diagnostic") cat = "discuss";
      else if (!hasRange(d)) cat = "healthy";
      else if (inRange(d, last.v)) cat = (prev && !inRange(d, prev.v)) ? "improved" : "healthy";
      else if (!prev || Math.abs(pct) < 1.5 || d1 === d0) cat = "same";
      else cat = d1 < d0 ? "improved" : "worse";
      const out = hasRange(d) && !inRange(d, last.v);
      let score = 0;
      if (d.kind !== "diagnostic" && out) score = Math.min(d1, 8) * 3 + (cat === "worse" ? 2 : 0) + (cat === "same" ? 0.6 : 0) + (lv.key === "lv_muchHigh" ? 2 : 0) + (cat === "improved" ? -0.5 : 0);
      if (d.kind === "diagnostic" && out) score = 1.2;
      if (notInNewest) score *= 0.6;
      return { id, d, series, last, prev, pct, cat, trend, lv, out, score, inCmp, notInNewest };
    });
    const byId = Object.fromEntries(tests.map(t => [t.id, t]));

    /* medicines: flags are stored as data; the words come from the language files */
    const medInfo = st.meds.map(m => {
      const kb = matchMeds(m.name);
      const flags = [], needed = new Map();
      kb.forEach(k => {
        const kname = AT.tx("meds", k.key, "name", k.name);
        k.tests.forEach(tid => { if (!needed.has(tid)) needed.set(tid, { tid, every: k.every, med: kname }); });
        Object.entries(k.watch).forEach(([tid, dir]) => {
          const t = byId[tid]; if (!t) return;
          const d = t.d, x = t.last.v;
          const bad = hasRange(d) && (dir === "up" ? x > d.hi : x < d.lo);
          const before = m.since && t.last.date.slice(0, 7) < m.since;
          if (bad && before) { flags.push({ lvl: "soft", kind: "before", d, x, dir, med: kname, score: 1.1 }); return; }
          if (bad) { flags.push({ lvl: "strong", kind: "bad", d, x, dir, med: kname, score: 3 + Math.min(dist(d, x), 3) }); return; }
          const win = t.series.filter(p => cmp.some(r => r.id === p.rid));
          if (win.length >= 2) {
            const a = win[0].v, b = win.at(-1).v, ch = a ? (b - a) / Math.abs(a) * 100 : 0;
            if ((dir === "up" && ch >= 25) || (dir === "down" && ch <= -25)) flags.push({ lvl: "soft", kind: "trend", d, dir, ch: Math.abs(Math.round(ch)), med: kname, score: 1 });
          }
        });
        if (k.expect) Object.entries(k.expect).forEach(([tid, dir]) => {
          const t = byId[tid];
          if (t && t.prev && m.since && t.last.date.slice(0, 7) >= m.since) {
            const ok = dir === "up" ? t.last.v > t.prev.v : t.last.v < t.prev.v;
            if (ok) flags.push({ lvl: "ok", kind: "expect", d: t.d, dir, med: kname, score: 0 });
          }
        });
      });
      const monitors = [...needed.values()].map(n => {
        const t = byId[n.tid], d = def(n.tid);
        if (!t) return { ...n, d, status: "missing" };
        const age = daysSince(t.last.date);
        return { ...n, d, t, age, status: n.every && age > n.every ? "due" : "ok" };
      });
      const miss = monitors.filter(x => x.status === "missing");
      if (miss.length) flags.push({ lvl: "soft", kind: "missing", list: miss, meds: [...new Set(miss.map(x => x.med))], score: 0.9 });
      const due = monitors.filter(x => x.status === "due");
      if (due.length) flags.push({ lvl: "soft", kind: "due", list: due, meds: [...new Set(due.map(x => x.med))], score: 0.8 });
      return { m, kb, flags, monitors };
    });

    /* needs-attention list: tests outside the range + medicine flags, highest score first */
    const att = [];
    tests.filter(t => t.out && t.inCmp).forEach(t => att.push({ type: "test", t, score: t.score }));
    medInfo.forEach(mi => mi.flags.filter(f => f.lvl !== "ok").forEach(f => att.push({ type: "med", mi, f, score: f.score })));
    att.sort((a, b) => b.score - a.score);

    /* natural-help ranking */
    const medKeys = new Set(medInfo.flatMap(mi => mi.kb.map(k => k.key)));
    const medCare = new Set(medInfo.flatMap(mi => mi.kb.flatMap(k => k.care)));
    const care = AT.CARE.map(c => {
      const why = c.tests.map(id => byId[id]).filter(t => t && t.out && t.d.kind !== "diagnostic");
      const notes = c.medNote ? Object.keys(c.medNote).filter(k => medKeys.has(k)) : [];
      const score = why.reduce((s, t) => s + t.score, 0) + (medCare.has(c.id) ? 2.5 : 0) + notes.length * 1.5 + (c.always ? 1 : 0);
      return { c, why, notes, score };
    }).sort((a, b) => (b.c.wide ? 1 : 0) - (a.c.wide ? 1 : 0) || (a.c.id === "cannot") - (b.c.id === "cannot") || b.score - a.score);

    return { reps, cmp, older, newest, tests, byId, medInfo, att, care };
  }

  AT.rules = { def, hasRange, inRange, dist, level, matchMeds, analyse };
})(window.AT);
