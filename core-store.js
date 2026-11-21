/* Saving on this device (localStorage), checking backup files, and telling
   the cloud backup when something changed. */
window.AT = window.AT || {};
(function (AT) {
  const KEY = "arthritis-tracker-v1";
  const OLD_KEY = "moms-reports-v1"; // data saved by the first single-file version
  AT.canStore = true;

  function valid(s) {
    return s && typeof s === "object" && Array.isArray(s.reports) &&
      s.reports.every(r => r && typeof r.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.values && typeof r.values === "object");
  }
  function normalise(s) {
    const out = { version: 1, reports: [], ranges: {}, custom: {}, meds: [], lastExport: s.lastExport || null, changedAt: s.changedAt || null };
    s.reports.forEach((r, i) => {
      const v = {};
      Object.entries(r.values).forEach(([k, x]) => { const n = Number(x); if (x !== null && x !== "" && isFinite(n)) v[String(k)] = n; });
      out.reports.push({ id: String(r.id || ("r" + r.date.replace(/-/g, "") + "_" + i)), date: r.date, lab: String(r.lab || ""), values: v });
    });
    if (s.ranges && typeof s.ranges === "object") Object.entries(s.ranges).forEach(([k, r]) => { if (r && isFinite(+r.lo) && isFinite(+r.hi)) out.ranges[k] = { lo: +r.lo, hi: +r.hi }; });
    if (s.custom && typeof s.custom === "object") Object.entries(s.custom).forEach(([k, c]) => {
      if (c && c.n) out.custom[k] = { n: String(c.n), t: String(c.t || c.n), u: String(c.u || ""), lo: +c.lo || 0, hi: isFinite(+c.hi) ? +c.hi : 0, m: String(c.m || ""), kind: c.kind === "diagnostic" ? "diagnostic" : "track" };
    });
    if (Array.isArray(s.meds)) s.meds.forEach(m => { if (m && m.name) out.meds.push({ id: String(m.id || AT.u.uid()), name: String(m.name), dose: String(m.dose || ""), since: String(m.since || ""), notes: String(m.notes || "") }); });
    return out;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY);
      if (raw) { const s = JSON.parse(raw); if (valid(s)) return normalise(s); }
    } catch (e) { AT.canStore = false; }
    return normalise(AT.u.clone(AT.SEED));
  }
  /* write to the device; quiet = do not mark as a new change (used after a backup or cloud restore) */
  function persist(quiet) {
    if (!quiet) AT.state.changedAt = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(AT.state)); AT.canStore = true; } catch (e) { AT.canStore = false; }
    const w = document.getElementById("store-warning"); if (w) w.hidden = AT.canStore;
    if (!quiet && AT.cloud) AT.cloud.onLocalChange();
  }
  function replaceAll(s) { AT.state = normalise(s); persist(true); }
  function probe() {
    try { localStorage.setItem(KEY + "-probe", "1"); localStorage.removeItem(KEY + "-probe"); } catch (e) { AT.canStore = false; }
  }
  AT.store = { load, save: () => persist(false), saveQuiet: () => persist(true), replaceAll, valid, normalise, probe };
})(window.AT);
