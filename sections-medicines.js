/* Her medicines: add / edit / remove, long-term effects, and the blood tests that watch each one. */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc, monthYear, uid, toast, armed } = AT.u;
  const ui = AT.ui, R = AT.rules;
  const mt = (k, f) => AT.tx("meds", k.key, f, k[f]);

  function shell() {
    return `<div class="sec-head"><h2>${esc(AT.t("meds_h"))}</h2><p>${esc(AT.t("meds_p"))}</p></div>
      <div class="note"><b>${esc(AT.t("meds_note_b"))}</b> ${esc(AT.t("meds_note"))}</div>
      <div class="med-layout">
        <form class="panel form-grid" id="med-form" novalidate>
          <h3 id="med-form-title">${esc(AT.t("med_add"))}</h3>
          <div class="field"><label for="m-name">${esc(AT.t("med_name"))}</label>
            <input type="text" id="m-name" list="med-names" autocomplete="off" required placeholder="${esc(AT.t("med_name_ph"))}">
            <datalist id="med-names">${[...new Set(AT.MEDS.flatMap(m => [m.name].concat(m.match.filter(a => a.length > 3).map(a => a[0].toUpperCase() + a.slice(1)))))].map(n => `<option value="${esc(n)}">`).join("")}</datalist>
            <span class="hint" id="m-match">${esc(AT.t("med_hint"))}</span></div>
          <div class="row2">
            <div class="field"><label for="m-dose">${esc(AT.t("med_dose"))}</label><input type="text" id="m-dose" placeholder="${esc(AT.t("med_dose_ph"))}"></div>
            <div class="field"><label for="m-since">${esc(AT.t("med_since"))}</label><input type="month" id="m-since"></div>
          </div>
          <div class="field"><label for="m-notes">${esc(AT.t("med_notes"))}</label><input type="text" id="m-notes" placeholder="${esc(AT.t("med_notes_ph"))}"></div>
          <div class="actions"><button class="btn primary" type="submit">${esc(AT.t("med_save"))}</button><button class="btn quiet" type="button" id="m-cancel" hidden>${esc(AT.t("cancel"))}</button></div>
          <p class="msg" id="m-msg" role="status"></p>
        </form>
        <div class="med-list" id="med-list"></div>
      </div>`;
  }
  function list(A) {
    if (!A.medInfo.length) return `<div class="empty-box"><b>${esc(AT.t("med_none"))}</b><span class="small">${esc(AT.t("med_none_p"))}</span></div>`;
    return A.medInfo.map(({ m, kb, flags, monitors }) => {
      const since = m.since ? AT.t("sinceWord", monthYear(m.since)) : "";
      const head = `<div class="med-top"><div class="who"><h3>${esc(m.name)}</h3><span class="small muted">${esc([m.dose, since].filter(Boolean).join(", "))}${m.notes ? "<br>" + esc(m.notes) : ""}</span></div>
        <div class="actions"><button class="btn small" type="button" data-medit="${esc(m.id)}">${esc(AT.t("edit"))}</button><button class="btn small danger" type="button" data-mdel="${esc(m.id)}">${esc(AT.t("remove"))}</button></div></div>`;
      if (!kb.length) return `<article class="med" id="med-${esc(m.id)}">${head}<div class="flag soft"><b>${esc(AT.t("med_unknown_b"))}</b> ${esc(AT.t("med_unknown"))}</div></article>`;
      const ul = arr => `<ul>${arr.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
      const body = kb.map(k => `<div class="pills"><span class="pill p-plain">${esc(mt(k, "type"))}</span></div>
        <p><b>${esc(mt(k, "name"))}.</b> ${esc(mt(k, "does"))}</p>
        <div class="med-cols"><div><h4>${esc(AT.t("med_common"))}</h4>${ul(mt(k, "common"))}</div><div><h4>${esc(AT.t("med_long"))}</h4>${ul(mt(k, "long"))}</div></div>
        <div><h4>${esc(AT.t("med_know"))}</h4>${ul(mt(k, "warn"))}</div>
        ${k.checks.length ? `<div><h4>${esc(AT.t("med_checks"))}</h4>${ul(mt(k, "checks"))}</div>` : ""}`).join("");
      const mon = monitors.length ? `<div class="mon"><h4>${esc(AT.t("med_tests"))}</h4>${monitors.map(x => {
        const st = x.status === "missing" ? `<span class="pill p-discuss">${esc(AT.t("notTested"))}</span>` : x.status === "due" ? `<span class="pill p-same">${esc(AT.t("dueAgain"))}</span>` : ui.lvlPill(R.level(x.d, x.t.last.v));
        const txt = x.status === "missing" ? AT.t("notInReports") : `${AT.u.fmt(x.t.last.v)} ${x.d.u}, ${AT.u.dShort(x.t.last.date)}`;
        return `<div class="mon-row"><span>${esc(x.d.n)} <span class="tiny muted">${esc(x.d.t)}</span><br><span class="small muted">${esc(txt)}</span></span>${st}</div>`;
      }).join("")}</div>` : "";
      const fl = flags.length ? flags.map(f => `<div class="flag ${f.lvl}">${esc(ui.flagText(f))}</div>`).join("") : (monitors.length ? `<div class="flag ok">${esc(AT.t("med_allok"))}</div>` : "");
      return `<article class="med" id="med-${esc(m.id)}">${head}${body}${mon}${fl}</article>`;
    }).join("") + `<p class="tiny muted">${esc(AT.t("med_source"))}</p>`;
  }
  function matchHint() {
    const v = $("m-name").value.trim(), k = v ? R.matchMeds(v) : [];
    $("m-match").textContent = !v ? AT.t("med_hint") : k.length ? AT.t("med_recog", k.map(x => mt(x, "name")).join(" + ")) : AT.t("med_norecog");
  }
  function resetForm() {
    const f = $("med-form"); f.reset(); delete f.dataset.edit;
    $("med-form-title").textContent = AT.t("med_add"); $("m-cancel").hidden = true; matchHint();
  }
  function wire(el) {
    $("m-name").addEventListener("input", matchHint);
    $("m-cancel").addEventListener("click", resetForm);
    $("med-form").addEventListener("submit", e => {
      e.preventDefault();
      const name = $("m-name").value.trim(), msg = $("m-msg");
      if (!name) { $("m-name").setAttribute("aria-invalid", "true"); msg.className = "msg err"; msg.textContent = AT.t("med_err"); $("m-name").focus(); return; }
      $("m-name").setAttribute("aria-invalid", "false");
      const rec = { id: $("med-form").dataset.edit || uid(), name, dose: $("m-dose").value.trim(), since: $("m-since").value, notes: $("m-notes").value.trim() };
      const i = AT.state.meds.findIndex(m => m.id === rec.id);
      if (i >= 0) AT.state.meds[i] = rec; else AT.state.meds.push(rec);
      AT.store.save(); resetForm(); AT.renderAll();
      msg.className = "msg ok"; msg.textContent = AT.t("med_saved", name);
    });
    el.addEventListener("click", e => {
      const ed = e.target.closest("[data-medit]");
      if (ed) {
        const m = AT.state.meds.find(x => x.id === ed.dataset.medit); if (!m) return;
        $("m-name").value = m.name; $("m-dose").value = m.dose; $("m-since").value = m.since; $("m-notes").value = m.notes;
        $("med-form").dataset.edit = m.id; $("med-form-title").textContent = AT.t("med_edit"); $("m-cancel").hidden = false;
        $("m-name").focus(); matchHint(); return;
      }
      const del = e.target.closest("[data-mdel]");
      if (del) {
        if (!armed(del, AT.t("tapRemove"), AT.t("remove"))) return;
        AT.state.meds = AT.state.meds.filter(m => m.id !== del.dataset.mdel);
        AT.store.save(); AT.renderAll(); toast(AT.t("med_removed"));
      }
    });
  }
  AT.sections.medicines = {
    render(A, full) {
      const el = $("s-meds");
      if (full || !$("med-form")) { el.innerHTML = shell(); wire(el); }
      $("med-list").innerHTML = list(A);
    }
  };
})(window.AT);
