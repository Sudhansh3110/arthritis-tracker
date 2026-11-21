/* All reports: edit or delete any report; long-term charts once there are more than 3. */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc, dLong, dShort, toast, armed } = AT.u;
  const ui = AT.ui;
  AT.sections.history = {
    render(A) {
      const el = $("s-history");
      const reps = [...A.reps].reverse();
      const list = reps.length ? reps.map(r => {
        const inC = A.cmp.includes(r);
        return `<div class="hist-row"><div><b>${esc(dLong(r.date))}</b> <span class="pill ${inC ? "p-healthy" : "p-plain"}">${esc(inC ? AT.t("inCmp") : AT.t("olderRep"))}</span><br>
          <span class="small muted">${esc(AT.t("nTests", Object.keys(r.values).length))}${r.lab ? ", " + esc(r.lab) : ""}</span></div>
          <div class="acts"><button class="btn small" type="button" data-redit="${esc(r.id)}">${esc(AT.t("edit"))}</button><button class="btn small danger" type="button" data-rdel="${esc(r.id)}">${esc(AT.t("del"))}</button></div></div>`;
      }).join("") : `<div class="empty-box">${esc(AT.t("noReports"))}</div>`;
      let long;
      if (A.older.length) {
        const ts = A.tests.filter(t => t.series.length >= 2);
        long = `<h3 class="sub-h">${esc(AT.t("long_h"))}</h3><p class="small muted">${esc(AT.t("long_p", A.reps.length))}</p>
          <div class="long">${ts.map(t => `<article class="test"><div><b>${esc(t.d.n)}</b><br><span class="lab">${esc(t.d.t)}</span></div>${ui.lineChart(t.d, A.reps.map(r => ({ label: dShort(r.date), v: r.values[t.id] ?? null })), { w: 320, h: 150 })}</article>`).join("")}</div>`;
      } else long = A.reps.length ? `<p class="small muted gap">${esc(AT.t("long_wait", A.reps.length))}</p>` : "";
      el.innerHTML = `<div class="sec-head"><h2>${esc(AT.t("hist_h"))}</h2><p>${esc(AT.t("hist_p"))}</p></div>
        <div class="hist">${list}</div>${long}`;
      el.onclick = e => {
        const ed = e.target.closest("[data-redit]"); if (ed) { AT.sections.addReport.edit(ed.dataset.redit); return; }
        const del = e.target.closest("[data-rdel]");
        if (del) {
          if (!armed(del, AT.t("tapDelete"), AT.t("del"))) return;
          AT.state.reports = AT.state.reports.filter(r => r.id !== del.dataset.rdel);
          AT.store.save(); AT.renderAll(); toast(AT.t("deleted"));
        }
      };
    }
  };
})(window.AT);
