/* Natural ways to help: cards ranked by her current results and medicines. */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc } = AT.u;
  const ct = (c, f) => AT.tx("care", c.id, f, c[f]);
  AT.sections.care = {
    render(A) {
      const el = $("s-care");
      const cards = A.care.map(({ c, why, notes }) => {
        const whyTxt = why.length ? AT.t("care_why", why.map(t => t.d.n + ": " + AT.t(t.lv.key)).join(", "))
          : notes.length ? AT.t("care_whyMed") : c.always ? AT.t("care_always") : AT.t("care_ref");
        const ex = ct(c, "exercises"), items = ct(c, "items"), medNote = Object.assign({}, c.medNote || {}, AT.tx("care", c.id, "medNote", {}) || {});
        return `<article class="card${c.wide ? " wide" : ""}"><h3>${esc(ct(c, "title"))}</h3><p class="why">${esc(whyTxt)}</p>
          ${c.intro ? `<p>${esc(ct(c, "intro"))}</p>` : ""}
          ${ex ? `<div>${ex.map(([n, how, dose]) => `<div class="ex"><div><b>${esc(n)}</b><br><span class="muted small">${esc(how)}</span></div><div class="dose">${esc(dose)}</div></div>`).join("")}</div>` : ""}
          ${items ? `<ul>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
          ${c.extra ? `<p>${esc(ct(c, "extra"))}</p>` : ""}
          ${notes.map(k => `<p class="flag soft">${esc(medNote[k])}</p>`).join("")}
          ${c.limit ? `<p class="limit">${esc(ct(c, "limit"))}</p>` : ""}</article>`;
      }).join("");
      el.innerHTML = `<div class="sec-head"><h2>${esc(AT.t("care_h"))}</h2><p>${esc(AT.t("care_p"))}</p></div>
        <div class="care">${cards}</div>
        <div class="never"><h3>${esc(AT.t("never_h"))}</h3><p>${esc(AT.t("never_p"))}</p></div>
        <p class="tiny muted src">${esc(AT.t("care_src"))}</p>`;
    }
  };
})(window.AT);
