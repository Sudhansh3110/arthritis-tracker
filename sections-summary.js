/* Summary: the big pie of better / healthy / worse / discuss / not improved,
   and one small pie of healthy results for each of the 3 newest reports. */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc, dLong } = AT.u;
  const ui = AT.ui, R = AT.rules;
  AT.sections.summary = {
    render(A) {
      const el = $("s-glance");
      const inWin = A.tests.filter(t => t.inCmp);
      const groups = Object.fromEntries(ui.CAT_ORDER.map(k => [k, inWin.filter(t => t.cat === k)]));
      const label = ui.CAT_ORDER.map(k => groups[k].length + " " + AT.t(ui.CAT[k].key)).join(", ");
      const top = A.att.find(a => a.type === "test");
      const slots = [...A.cmp]; while (slots.length < 3) slots.push(null);
      const reps = slots.map(r => {
        if (!r) return `<div class="rep empty"><span class="d">${esc(AT.t("waitNext"))}</span><span class="small">${esc(AT.t("waitNext_p"))}</span></div>`;
        const tracked = Object.keys(r.values).map(R.def).filter(d => d.kind !== "diagnostic" && R.hasRange(d));
        const ok = tracked.filter(d => R.inRange(d, r.values[d.id])).length, n = tracked.length;
        return `<div class="rep">${ui.donut([{ v: ok, color: "--healthy", tip: AT.t("nHealthy", ok) }, { v: n - ok, color: "--worse", tip: AT.t("nOutside", n - ok) }], 132, 18,
          `<text x="66" y="66" text-anchor="middle" class="donut-num" style="font-size:26px">${ok}/${n}</text><text x="66" y="86" text-anchor="middle" class="donut-sub" style="font-size:11px">${esc(AT.t("healthyLower"))}</text>`, `${dLong(r.date)}: ${ok}/${n}`)}
          <span class="d">${esc(dLong(r.date))}</span><span class="small muted">${esc(AT.t("repLine", r === A.cmp.at(-1), ok, n - ok))}</span></div>`;
      }).join("");
      el.innerHTML = `<div class="sec-head"><h2>${esc(AT.t("sum_h"))}</h2><p>${esc(A.cmp.length > 1 ? AT.t("sum_p", dLong(A.newest.date)) : AT.t("sum_p1"))}</p></div>
        ${inWin.length ? `<div class="panel"><div class="glance">
          <div class="donut-big">${ui.donut(ui.CAT_ORDER.map(k => ({ v: groups[k].length, color: ui.CAT[k].c, tip: AT.t(ui.CAT[k].key) + ": " + groups[k].length })), 260, 36,
            `<text x="130" y="128" text-anchor="middle" class="donut-num" style="font-size:48px">${inWin.length}</text><text x="130" y="154" text-anchor="middle" class="donut-sub" style="font-size:14px">${esc(AT.t("testsCompared"))}</text>`, label)}</div>
          <div class="glance-text">
            <p class="plain-sum">${AT.t("sum_text", { better: groups.improved.length, worse: groups.worse.length, same: groups.same.length, healthy: groups.healthy.length, top: top ? { n: esc(top.t.d.n), t: esc(top.t.d.t), lv: esc(AT.t(top.t.lv.key)) } : null, discuss: groups.discuss.map(t => esc(t.d.n)) })}</p>
            <ul class="legend">${ui.CAT_ORDER.map(k => `<li><span class="sw" style="background:var(${ui.CAT[k].c})"></span><b>${esc(AT.t(ui.CAT[k].key))}</b><span class="count num">${groups[k].length}</span><span class="names">${groups[k].map(t => esc(t.d.n)).join(", ") || esc(AT.t("none"))}</span></li>`).join("")}</ul>
          </div></div></div>
        <h3 class="sub-h">${esc(AT.t("perRep_h"))}</h3>
        <p class="muted small">${esc(AT.t("perRep_p"))}</p>
        <div class="reports-row">${reps}</div>` : `<div class="empty-box">${esc(AT.t("noReports"))}</div>`}`;
    }
  };
})(window.AT);
