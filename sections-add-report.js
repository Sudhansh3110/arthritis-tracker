/* Add a report: 1 open the photo/PDF to copy from, 2 type the numbers, 3 check and save.
   Also used to edit an existing report (from All reports). */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc, uid, dLong, dShort, toast } = AT.u;
  const R = AT.rules;
  let editing = null, pending = {}, A = null;

  function knownIds() {
    const used = [...new Set(AT.state.reports.flatMap(r => Object.keys(r.values)))];
    const main = Object.keys(AT.TESTS).filter(k => AT.TESTS[k].main);
    const first = [...new Set(main.concat(used))];
    const more = [...new Set(Object.keys(AT.TESTS).concat(Object.keys(AT.state.custom)).filter(k => !first.includes(k)))];
    return { first, more };
  }
  function vrow(id, val) {
    const d = R.def(id), has = R.hasRange(d);
    return `<div class="vrow" data-row="${esc(id)}"><div class="nm"><label for="v-${esc(id)}"><b>${esc(d.n)}</b></label><span class="tiny muted">${esc(d.t)}</span></div>
      <input type="number" step="any" inputmode="decimal" id="v-${esc(id)}" data-v="${esc(id)}" value="${val != null ? val : ""}" placeholder="${esc(d.u)}">
      <span class="rng">${esc(AT.t("healthyLower"))} <input type="number" step="any" inputmode="decimal" aria-label="${esc(d.n)}: ${esc(AT.t("n_lo"))}" data-lo="${esc(id)}" value="${has ? d.lo : ""}"> ${esc(AT.t("toWord"))} <input type="number" step="any" inputmode="decimal" aria-label="${esc(d.n)}: ${esc(AT.t("n_hi"))}" data-hi="${esc(id)}" value="${has ? d.hi : ""}"> ${esc(d.u)}</span></div>`;
  }
  function rows() {
    const { first, more } = knownIds();
    const src = editing ? AT.state.reports.find(r => r.id === editing) : null;
    const vals = Object.assign({}, src ? src.values : {}, pending);
    $("vals-main").innerHTML = first.map(id => vrow(id, vals[id])).join("");
    $("vals-more").innerHTML = more.map(id => vrow(id, vals[id])).join("");
    if (!$("r-date").value) $("r-date").value = src ? src.date : new Date().toISOString().slice(0, 10);
    if (src && !$("r-lab").value) $("r-lab").value = src.lab;
    if (!src && !$("r-lab").value && A && A.newest) $("r-lab").value = A.newest.lab;
    $("r-save").textContent = editing ? AT.t("saveChanges") : AT.t("saveReport");
    $("r-cancel").hidden = !editing;
    checkRows();
  }
  function checkRows() {
    let odd = 0;
    document.querySelectorAll(".vrow").forEach(row => {
      const id = row.dataset.row, inp = row.querySelector("[data-v]"), d = R.def(id);
      const x = inp.value === "" ? null : +inp.value;
      const prev = A && A.byId[id] ? A.byId[id].last.v : null;
      const weird = x != null && (x < 0 || (R.hasRange(d) && d.hi > 0 && x > d.hi * 15) || (prev && prev > 0 && (x / prev > 6 || x / prev < 1 / 6)));
      row.classList.toggle("warnrow", !!weird); inp.setAttribute("aria-invalid", weird ? "true" : "false");
      if (weird) odd++;
    });
    return odd;
  }
  function readForm() {
    const values = {}, ranges = {};
    document.querySelectorAll("[data-v]").forEach(inp => { if (inp.value.trim() !== "" && isFinite(+inp.value)) values[inp.dataset.v] = +inp.value; });
    document.querySelectorAll("[data-lo]").forEach(inp => {
      const id = inp.dataset.lo, hi = document.querySelector(`[data-hi="${CSS.escape(id)}"]`);
      if (inp.value !== "" && hi && hi.value !== "" && +hi.value > +inp.value) ranges[id] = { lo: +inp.value, hi: +hi.value };
    });
    return { values, ranges };
  }
  function resetForm() {
    editing = null; pending = {}; $("rep-form").reset(); $("r-date").value = ""; $("r-lab").value = "";
    $("preview").hidden = true; $("preview").innerHTML = ""; $("more-tests").open = false; rows();
  }
  function showFile(file) {
    if (!file) return;
    const pv = $("preview"), url = URL.createObjectURL(file);
    if (file.type === "application/pdf") pv.innerHTML = `<iframe src="${url}" title="PDF"></iframe><a class="small" href="${url}" target="_blank" rel="noopener">${esc(AT.t("openPdf"))}</a>`;
    else if (file.type.startsWith("image/")) pv.innerHTML = `<img src="${url}" alt="${esc(AT.t("photoAlt"))}">`;
    else pv.innerHTML = `<p class="msg err">${esc(AT.t("badFile"))}</p>`;
    pv.hidden = false;
  }
  function shell() {
    return `<div class="sec-head"><h2 id="h-add" tabindex="-1">${esc(AT.t("add_h"))}</h2><p>${esc(AT.t("add_p"))}</p></div>
    <form class="panel steps" id="rep-form" novalidate>
      <div class="step"><span class="n" aria-hidden="true">1</span><div class="step-body">
        <h3>${esc(AT.t("s1_h"))}</h3><p class="muted small">${esc(AT.t("s1_p"))}</p>
        <div class="drop" id="drop"><b>${esc(AT.t("dropHere"))}</b><label class="btn" for="rep-file">${esc(AT.t("chooseFile"))}</label><input type="file" id="rep-file" accept="image/*,application/pdf" hidden></div>
        <div class="preview" id="preview" hidden></div>
      </div></div>
      <div class="step"><span class="n" aria-hidden="true">2</span><div class="step-body">
        <h3>${esc(AT.t("s2_h"))}</h3>
        <div class="row2"><div class="field"><label for="r-date">${esc(AT.t("repDate"))}</label><input type="date" id="r-date" required></div>
          <div class="field"><label for="r-lab">${esc(AT.t("labField"))}</label><input type="text" id="r-lab" placeholder="${esc(AT.t("labPh"))}"></div></div>
        <p class="small muted">${esc(AT.t("s2_p"))}</p>
        <div class="vals" id="vals-main"></div>
        <details id="more-tests"><summary>${esc(AT.t("moreTests"))}</summary><div class="vals" id="vals-more"></div></details>
        <details id="new-test"><summary>${esc(AT.t("newTest"))}</summary>
          <div class="panel form-grid inner">
            <div class="row2"><div class="field"><label for="n-name">${esc(AT.t("n_name"))}</label><input type="text" id="n-name" placeholder="${esc(AT.t("n_name_ph"))}"></div>
              <div class="field"><label for="n-lab">${esc(AT.t("n_lab"))}</label><input type="text" id="n-lab" placeholder="TSH"></div></div>
            <div class="row2"><div class="field"><label for="n-unit">${esc(AT.t("n_unit"))}</label><input type="text" id="n-unit" placeholder="mIU/L"></div>
              <div class="field"><label for="n-val">${esc(AT.t("n_val"))}</label><input type="number" step="any" inputmode="decimal" id="n-val"></div></div>
            <div class="row2"><div class="field"><label for="n-lo">${esc(AT.t("n_lo"))}</label><input type="number" step="any" inputmode="decimal" id="n-lo"></div>
              <div class="field"><label for="n-hi">${esc(AT.t("n_hi"))}</label><input type="number" step="any" inputmode="decimal" id="n-hi"></div></div>
            <div><button class="btn" type="button" id="n-add">${esc(AT.t("n_add"))}</button></div>
            <p class="msg" id="n-msg" role="status"></p>
          </div></details>
      </div></div>
      <div class="step"><span class="n" aria-hidden="true">3</span><div class="step-body">
        <h3>${esc(AT.t("s3_h"))}</h3><p class="small muted">${esc(AT.t("s3_p"))}</p>
        <div class="actions"><button class="btn primary" type="submit" id="r-save">${esc(AT.t("saveReport"))}</button><button class="btn quiet" type="button" id="r-cancel" hidden>${esc(AT.t("cancelEdit"))}</button></div>
        <p class="msg" id="r-msg" role="status" aria-live="polite"></p>
      </div></div>
    </form>`;
  }
  function wire() {
    $("rep-file").addEventListener("change", e => showFile(e.target.files[0]));
    const drop = $("drop");
    ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", e => showFile(e.dataTransfer.files[0]));
    $("rep-form").addEventListener("input", e => { if (e.target.matches("[data-v]")) { pending[e.target.dataset.v] = e.target.value === "" ? undefined : +e.target.value; checkRows(); } });
    $("r-cancel").addEventListener("click", () => { resetForm(); $("r-msg").textContent = ""; });
    $("n-add").addEventListener("click", () => {
      const n = $("n-name").value.trim(), lab = $("n-lab").value.trim() || n, u = $("n-unit").value.trim(), v = $("n-val").value, lo = $("n-lo").value, hi = $("n-hi").value, msg = $("n-msg");
      if (!n || v === "") { msg.className = "msg err"; msg.textContent = AT.t("n_err"); return; }
      if (lo !== "" && hi !== "" && +hi <= +lo) { msg.className = "msg err"; msg.textContent = AT.t("n_err2"); return; }
      let id = ("x_" + lab.toLowerCase().replace(/[^a-z0-9]+/g, "_")).slice(0, 40);
      const existing = Object.keys(AT.TESTS).find(k => AT.TESTS[k].t.toLowerCase() === lab.toLowerCase() || AT.TESTS[k].n.toLowerCase() === n.toLowerCase());
      if (existing) id = existing;
      else AT.state.custom[id] = { n, t: lab, u, lo: lo === "" ? 0 : +lo, hi: hi === "" ? 0 : +hi, m: AT.t("customMeaning"), kind: "track" };
      pending[id] = +v; ["n-name", "n-lab", "n-unit", "n-val", "n-lo", "n-hi"].forEach(k => $(k).value = "");
      msg.className = "msg ok"; msg.textContent = existing ? AT.t("n_exists", R.def(existing).n) : AT.t("n_added", n);
      rows(); if (!existing) $("more-tests").open = true;
    });
    $("rep-form").addEventListener("submit", e => {
      e.preventDefault();
      const msg = $("r-msg"), date = $("r-date").value, btn = $("r-save");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { msg.className = "msg err"; msg.textContent = AT.t("err_date"); $("r-date").setAttribute("aria-invalid", "true"); $("r-date").focus(); return; }
      $("r-date").setAttribute("aria-invalid", "false");
      const { values, ranges } = readForm();
      if (!Object.keys(values).length) { msg.className = "msg err"; msg.textContent = AT.t("err_empty"); return; }
      const odd = checkRows();
      if (odd && btn.dataset.confirm !== "1") { btn.dataset.confirm = "1"; msg.className = "msg err"; msg.textContent = AT.t("err_odd", odd); return; }
      btn.dataset.confirm = "";
      const st = AT.state;
      const clash = st.reports.find(r => r.date === date && r.id !== editing);
      Object.entries(ranges).forEach(([id, r]) => { const base = AT.TESTS[id] || st.custom[id]; if (base && (base.lo !== r.lo || base.hi !== r.hi)) st.ranges[id] = r; else delete st.ranges[id]; });
      const wasEdit = !!editing;
      if (editing) { const r = st.reports.find(x => x.id === editing); r.date = date; r.lab = $("r-lab").value.trim(); r.values = values; }
      else if (clash) { clash.values = Object.assign(clash.values, values); clash.lab = $("r-lab").value.trim() || clash.lab; }
      else st.reports.push({ id: "r" + date.replace(/-/g, "") + "_" + uid().slice(0, 4), date, lab: $("r-lab").value.trim(), values });
      AT.store.save(); resetForm(); AT.renderAll();
      const m = $("r-msg"); m.className = "msg ok"; m.textContent = wasEdit ? AT.t("ok_edit") : clash ? AT.t("ok_merge", dLong(date)) : AT.t("ok_saved");
      toast(AT.t("toast_saved", A.cmp.map(r => dShort(r.date)).join(", ")));
      document.getElementById("top").scrollIntoView();
    });
  }
  AT.sections.addReport = {
    render(a, full) {
      A = a;
      const el = $("s-add");
      if (full || !$("rep-form")) { el.innerHTML = shell(); wire(); }
      rows();
    },
    edit(id) {
      editing = id; pending = {}; $("r-date").value = ""; $("r-lab").value = ""; rows();
      $("s-add").scrollIntoView(); $("h-add").focus({ preventScroll: true });
      const r = AT.state.reports.find(x => x.id === id);
      $("r-msg").className = "msg"; $("r-msg").textContent = AT.t("editing", dLong(r.date));
    }
  };
})(window.AT);
