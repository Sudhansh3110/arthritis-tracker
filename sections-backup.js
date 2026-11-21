/* Save and backup: download / restore a backup file, cloud backup card, start again, colour key. */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc, dLong, toast, armed } = AT.u;
  const ui = AT.ui;
  function backupState() {
    const s = AT.state;
    if (!s.lastExport) return AT.t("bk_never");
    if (s.changedAt && s.changedAt > s.lastExport) return AT.t("bk_old", dLong(s.lastExport.slice(0, 10)));
    return AT.t("bk_ok", dLong(s.lastExport.slice(0, 10)));
  }
  AT.sections.backup = {
    render() {
      const el = $("s-data");
      el.innerHTML = `<div class="sec-head"><h2>${esc(AT.t("data_h"))}</h2><p>${esc(AT.t("data_p"))}</p></div>
        <div class="data-grid">
          <div class="card"><h3>${esc(AT.t("exp_h"))}</h3><p class="small">${esc(AT.t("exp_p"))}</p><p class="small muted">${esc(backupState())}</p>
            <div><button class="btn primary" type="button" id="export">${esc(AT.t("exp_btn"))}</button></div></div>
          <div class="card"><h3>${esc(AT.t("imp_h"))}</h3><p class="small">${esc(AT.t("imp_p"))}</p>
            <div><label class="btn" for="import-file">${esc(AT.t("imp_btn"))}</label><input type="file" id="import-file" accept="application/json,.json" hidden></div>
            <p class="msg" id="import-msg" role="status"></p></div>
          <div class="card" id="cloud-card"></div>
        </div>
        <div class="panel key-panel"><h3>${esc(AT.t("key_h"))}</h3><div class="key">
          ${ui.CAT_ORDER.map(k => `<div><span>${ui.pill(k)}</span><span class="small">${esc(AT.t("key_" + k))}</span></div>`).join("")}
        </div></div>
        <div class="reset-row"><button class="btn danger small" type="button" id="wipe">${esc(AT.t("wipe_btn"))}</button><span class="small muted" id="wipe-msg">${esc(AT.t("wipe_p"))}</span></div>`;
      AT.cloud.renderCard($("cloud-card"));
      $("export").onclick = () => {
        AT.state.lastExport = new Date().toISOString();
        const blob = new Blob([JSON.stringify(AT.state, null, 1)], { type: "application/json" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = `arthritis-tracker-backup-${AT.state.lastExport.slice(0, 10)}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        AT.store.saveQuiet(); this.render(); toast(AT.t("exp_done"));
      };
      $("import-file").onchange = e => {
        const file = e.target.files[0], msg = $("import-msg"); if (!file) return;
        const rd = new FileReader();
        rd.onload = () => {
          try {
            const s = JSON.parse(rd.result); if (!AT.store.valid(s)) throw new Error("shape");
            AT.store.replaceAll(s); AT.state.changedAt = new Date().toISOString(); AT.store.save(); AT.renderAll(true);
            const m = $("import-msg"); m.className = "msg ok"; m.textContent = AT.t("imp_ok", AT.state.reports.length, AT.state.meds.length);
          } catch (err) { msg.className = "msg err"; msg.textContent = AT.t("imp_bad"); }
          e.target.value = "";
        };
        rd.readAsText(file);
      };
      $("wipe").onclick = e => {
        if (!armed(e.currentTarget, AT.t("tapWipe"), AT.t("wipe_btn"))) return;
        AT.store.replaceAll(AT.SEED); AT.renderAll(true); toast(AT.t("wiped"));
      };
    }
  };
  AT.sections.footer = {
    render() {
      $("site-footer").innerHTML = `<div class="wrap"><p><b>${esc(AT.t("foot_b"))}</b> ${esc(AT.t("foot_1"))}</p><p>${esc(AT.t("foot_2"))}</p></div>`;
    }
  };
})(window.AT);
