/* Each test: one chart per test with the healthy band, filters, and a table of every number. */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc, fmt, dShort } = AT.u;
  const ui = AT.ui, R = AT.rules;
  const FILTERS = [["all", "f_all"], ["attn", "f_attn"], ["improved", "cat_improved"], ["worse", "cat_worse"], ["same", "cat_same"], ["healthy", "cat_healthy"], ["discuss", "f_discuss"]];
  let filter = "all", lastA = null;

  function cards(A) {
    const list = A.tests.filter(t => t.inCmp).filter(t => filter === "all" || (filter === "attn" ? t.out : t.cat === filter)).sort((a, b) => b.score - a.score);
    const careFor = id => AT.CARE.filter(c => c.tests.includes(id) && c.id !== "cannot").map(c => AT.tx("care", c.id, "title", c.title));
    return list.map(t => {
      const helps = careFor(t.id);
      return `<article class="test"><div><h3>${esc(t.d.n)}</h3><span class="lab">${esc(AT.t("labName"))} ${esc(t.d.t)}${t.d.u ? ", " + esc(t.d.u) : ""}</span></div>
        <div class="pills">${t.d.kind === "diagnostic" ? ui.pill("discuss") : ui.lvlPill(t.lv) + (t.cat === "healthy" ? "" : ui.pill(t.cat))}<span class="pill p-plain">${esc(AT.t(t.trend))}</span></div>
        ${ui.lineChart(t.d, ui.cmpPoints(A, t.id))}
        <p class="small">${esc(t.d.m || "")}</p>
        <p class="small"><b>${esc(AT.t("herResult"))}</b> ${esc(ui.sentence(t))}</p>
        ${helps.length && t.out ? `<p class="helps"><b>${esc(AT.t("whatHelps"))}</b> ${helps.map(esc).join(", ")}</p>` : ""}
      </article>`;
    }).join("") || `<div class="empty-box">${esc(AT.t("noTestsGroup"))}</div>`;
  }
  AT.sections.tests = {
    render(A) {
      lastA = A;
      const el = $("s-tests");
      const reps = A.reps;
      el.innerHTML = `<div class="sec-head"><h2>${esc(AT.t("tests_h"))}</h2><p>${esc(AT.t("tests_p"))}</p></div>
        <div class="filters" role="group" aria-label="${esc(AT.t("tests_h"))}">${FILTERS.map(([k, key]) => `<button class="chip" type="button" data-f="${k}" aria-pressed="${filter === k}">${esc(AT.t(key))}</button>`).join("")}</div>
        <div class="tests" id="tests-grid">${cards(A)}</div>
        ${A.tests.length ? `<details><summary>${esc(AT.t("showTable"))}</summary><div class="table-box"><table>
          <thead><tr><th>${esc(AT.t("th_test"))}</th><th>${esc(AT.t("healthyWord"))}</th>${reps.map(r => `<th>${esc(dShort(r.date))}${A.cmp.includes(r) ? "" : " " + esc(AT.t("olderTag"))}</th>`).join("")}<th>${esc(AT.t("th_result"))}</th></tr></thead>
          <tbody>${A.tests.map(t => `<tr><td><b>${esc(t.d.n)}</b><br><span class="tiny muted">${esc(t.d.t)}</span></td><td class="v">${esc(ui.rangeText(t.d))}</td>${reps.map(r => { const v = r.values[t.id]; return v == null ? `<td class="v muted">–</td>` : `<td class="v ${R.hasRange(t.d) && !R.inRange(t.d, v) ? "off" : ""}">${fmt(v)}</td>`; }).join("")}<td>${ui.pill(t.cat)}</td></tr>`).join("")}</tbody>
        </table></div></details>` : ""}`;
      el.onclick = e => {
        const b = e.target.closest("[data-f]"); if (!b) return;
        filter = b.dataset.f;
        el.querySelectorAll("[data-f]").forEach(x => x.setAttribute("aria-pressed", x === b));
        $("tests-grid").innerHTML = cards(lastA);
      };
    }
  };
})(window.AT);
