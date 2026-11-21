/* First screen: headline counts, one sentence, the chart of her most worrying test. */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc, fmt, dLong } = AT.u;
  const ui = AT.ui;
  AT.sections.hero = {
    render(A) {
      const el = $("s-hero");
      const inWin = A.tests.filter(t => t.inCmp);
      const c = k => inWin.filter(t => t.cat === k).length;
      const healthy = c("healthy");
      let h;
      if (!A.newest) h = AT.t("hero_empty");
      else if (A.cmp.length > 1 && (c("improved") || c("worse"))) h = AT.t("hero_counts", c("improved"), c("worse"));
      else h = AT.t("hero_healthy", healthy, inWin.length);
      const top = A.att.find(a => a.type === "test");
      let p = "";
      if (A.newest) {
        p = A.cmp.length > 1 ? AT.t("hero_cmp", dLong(A.newest.date), dLong(A.cmp.at(-2).date)) : AT.t("hero_one", dLong(A.newest.date));
        p += " " + (top ? AT.t("hero_worry", top.t.d.n) : AT.t("hero_noworry"));
      } else p = AT.t("hero_empty_p");
      let sig;
      if (top) {
        const t = top.t;
        sig = `<div class="sig-head"><h3>${esc(t.d.n)} <span class="tiny muted">${esc(t.d.t)}</span></h3><span class="pills">${ui.lvlPill(t.lv)}${ui.pill(t.cat)}</span></div>
          <div class="big num">${fmt(t.last.v)}<small>${esc(t.d.u)}, ${esc(AT.t("healthyLower"))} ${esc(ui.rangeText(t.d))}</small></div>
          ${ui.lineChart(t.d, ui.cmpPoints(A, t.id), { w: 460, h: 200 })}
          <figcaption class="small muted">${esc(ui.sentence(t))}</figcaption>`;
      } else if (A.newest) sig = `<div class="empty-box"><b>${esc(AT.t("hero_sig_none"))}</b><span class="small">${esc(AT.t("hero_sig_none_p"))}</span></div>`;
      else sig = `<div class="empty-box"><b>${esc(AT.t("hero_start_t"))}</b><span class="small">${esc(AT.t("hero_start_p"))}</span><a class="btn" href="#s-data">${esc(AT.t("hero_start_btn"))}</a></div>`;
      el.innerHTML = `<div class="hero-text">
          <h1>${esc(h)}</h1>
          <p class="lede">${esc(p)}</p>
          <div class="actions"><a class="btn primary" href="#s-add">${esc(AT.t("addNew"))}</a><a class="btn" href="#s-attn">${esc(AT.t("seeAttn"))}</a></div>
          <p class="small muted">${esc(A.newest ? AT.t("hero_meta", AT.state.reports.length, c("same")) : "")}</p>
        </div>
        <figure class="sig">${sig}</figure>`;
    }
  };
})(window.AT);
