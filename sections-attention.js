/* What needs attention: results and medicine checks, most important first. */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc, fmt } = AT.u;
  const ui = AT.ui;
  AT.sections.attention = {
    render(A) {
      const el = $("s-attn");
      const items = A.att.map((a, i) => {
        if (a.type === "test") {
          const t = a.t;
          return `<div class="att-item"><span class="rank num">${i + 1}</span><div class="body">
            <div><b>${esc(t.d.n)}</b> <span class="muted small">${esc(t.d.t)}</span></div>
            <div class="pills">${t.d.kind === "diagnostic" ? ui.pill("discuss") : ui.lvlPill(t.lv) + ui.pill(t.cat)}</div>
            <span class="small muted">${esc(ui.sentence(t))}</span></div>
            <span class="val num">${t.prev ? `<span class="muted small">${esc(AT.t("was"))} ${fmt(t.prev.v)}</span><br>` : ""}<b>${fmt(t.last.v)}</b> <span class="small muted">${esc(t.d.u)}</span></span></div>`;
        }
        return `<div class="att-item med"><span class="rank num">${i + 1}</span><div class="body">
          <div><b>${esc(AT.t("medCheck"))} ${esc(a.mi.m.name)}</b></div>
          <div class="pills">${a.f.lvl === "strong" ? ui.pill("worse", AT.t("outsideHealthy")) : ui.pill("discuss", AT.t("askDoctor"))}</div>
          <span class="small muted">${esc(ui.flagText(a.f))}</span></div>
          <span class="val"><a class="small" href="#med-${esc(a.mi.m.id)}">${esc(AT.t("seeMed"))}</a></span></div>`;
      }).join("");
      el.innerHTML = `<div class="sec-head"><h2>${esc(AT.t("attn_h"))}</h2><p>${esc(AT.t("attn_p"))}</p></div>
        <div class="att">${items || `<div class="empty-box"><b>${esc(AT.t("attn_none"))}</b><span class="small">${esc(AT.t("attn_none_p"))}</span></div>`}</div>`;
    }
  };
})(window.AT);
