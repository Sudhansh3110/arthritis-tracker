/* ==========================================================================
   CLOUD BACKUP (optional, Supabase)
   Works when config.js has the project URL, the anon key and ownerEmail.
   Sign-in is a mobile number + password. Behind the scenes the number becomes
   an email address on the owner's own inbox (plus-addressing, for example
   you+919876543210@gmail.com), so no SMS service and no sign-in links are needed.
   The device copy (localStorage) is always kept; the cloud is an extra copy.
   One row per signed-in person in the table "tracker_backups" holds the whole
   backup as JSON. Row-level security (supabase-setup.sql) makes sure each
   person can only ever read or change their own row.
   ========================================================================== */
window.AT = window.AT || {};
(function (AT) {
  const { esc, toast } = AT.u;
  const CFG = AT.CONFIG || {};
  const LIB = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js";
  const AUTO_KEY = "arthritis-tracker-cloud-auto";
  let client = null, user = null, status = "off", info = "", cloudMeta = null, timer = null, busy = false;
  let auto = true; try { auto = localStorage.getItem(AUTO_KEY) !== "0"; } catch (e) {}
  let cardEl = null;

  const configured = () => !!(CFG.supabaseUrl && CFG.supabaseAnonKey);
  /* 10-digit Indian number -> 91XXXXXXXXXX; returns null if it does not look like a mobile number */
  function cleanPhone(v) {
    let d = String(v || "").replace(/\D/g, "");
    if (d.length === 11 && d[0] === "0") d = d.slice(1);
    if (d.length === 10) d = "91" + d;
    return d.length >= 11 && d.length <= 15 ? d : null;
  }
  function phoneEmail(d) {
    const own = String(CFG.ownerEmail || "").trim().toLowerCase();
    const at = own.indexOf("@");
    if (at > 0) return own.slice(0, at) + "+" + d + own.slice(at);
    return "m" + d + "@" + (CFG.loginDomain || "arthritis-tracker.app");
  }
  function phoneOf(u) { const m = /\+?(\d{11,15})@|^m(\d{11,15})@/.exec((u && u.email) || ""); const d = m ? (m[1] || m[2]) : ""; return d ? "+" + d.slice(0, d.length - 10) + " " + d.slice(-10) : ((u && u.email) || ""); }
  function friendly(err) {
    const m = (err && err.message) || "";
    if (/invalid login credentials/i.test(m)) return AT.t("cl_wrong");
    if (/already registered|already exists/i.test(m)) return AT.t("cl_exists");
    if (/signups? not allowed|signup.*disabled/i.test(m)) return AT.t("cl_nosignup");
    if (/email not confirmed/i.test(m)) return AT.t("cl_confirm");
    if (/password/i.test(m) && /6|short|weak/i.test(m)) return AT.t("cl_shortpw");
    return AT.t("cl_err", m);
  }
  const when = iso => { const d = new Date(iso), z = n => String(n).padStart(2, "0"); return AT.u.dLong(`${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`) + ", " + z(d.getHours()) + ":" + z(d.getMinutes()); };

  function loadLib() {
    return new Promise((ok, fail) => {
      if (window.supabase && window.supabase.createClient) return ok();
      const s = document.createElement("script"); s.src = LIB; s.async = true;
      s.onload = () => ok(); s.onerror = () => fail(new Error("offline")); document.head.appendChild(s);
    });
  }
  async function init() {
    if (!configured()) { status = "off"; return; }
    status = "loading"; redraw();
    try {
      await loadLib();
      client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, detectSessionInUrl: false, autoRefreshToken: true } });
      const { data } = await client.auth.getSession();
      user = data.session ? data.session.user : null;
      status = user ? "in" : "out";
      client.auth.onAuthStateChange((_e, session) => {
        const was = user && user.id; user = session ? session.user : null; status = user ? "in" : "out";
        if (user && user.id !== was) afterSignIn(); else redraw();
      });
      if (user) await afterSignIn(); else redraw();
    } catch (e) { status = "error"; info = AT.t("cl_offline"); redraw(); }
  }
  async function fetchMeta() {
    const { data, error } = await client.from(CFG.table).select("updated_at").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    cloudMeta = data; return data;
  }
  async function afterSignIn() {
    try {
      const meta = await fetchMeta();
      const local = AT.state;
      const localEmpty = !local.reports.length && !local.meds.length;
      if (!meta) { if (!localEmpty) await push(true); }
      else if (localEmpty) { await pull(); return; } /* new phone: load the cloud copy straight away */
      else if (!local.changedAt || meta.updated_at > local.changedAt) info = AT.t("cl_newer", when(meta.updated_at));
      else info = "";
    } catch (e) { info = AT.t("cl_err", e.message || ""); }
    redraw();
  }
  async function push(silent) {
    if (!client || !user || busy) return;
    busy = true; redraw();
    try {
      const now = new Date().toISOString();
      const { error } = await client.from(CFG.table).upsert({ user_id: user.id, data: AT.state, updated_at: now });
      if (error) throw error;
      cloudMeta = { updated_at: now }; info = "";
      if (!silent) toast(AT.t("cl_saved"));
    } catch (e) { info = AT.t("cl_err", e.message || ""); }
    busy = false; redraw();
  }
  async function pull() {
    if (!client || !user) return;
    busy = true; redraw();
    try {
      const { data, error } = await client.from(CFG.table).select("data,updated_at").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      if (!data) { info = AT.t("cl_none"); }
      else if (!AT.store.valid(data.data)) { info = AT.t("cl_bad"); }
      else { AT.store.replaceAll(data.data); cloudMeta = { updated_at: data.updated_at }; info = ""; busy = false; AT.renderAll(true); toast(AT.t("cl_restored")); return; }
    } catch (e) { info = AT.t("cl_err", e.message || ""); }
    busy = false; redraw();
  }
  async function signIn(phone, password, create) {
    busy = true; info = ""; redraw();
    const email = phoneEmail(phone);
    const res = create ? await client.auth.signUp({ email, password }) : await client.auth.signInWithPassword({ email, password });
    busy = false;
    if (res.error) { info = friendly(res.error); redraw(); return; }
    if (!res.data.session) { info = AT.t("cl_confirm"); redraw(); return; }
    /* onAuthStateChange takes over from here and loads or saves the backup */
  }
  function redraw() { if (cardEl && cardEl.isConnected) renderCard(cardEl); }

  function renderCard(el) {
    cardEl = el;
    const head = `<h3>${esc(AT.t("cl_h"))}</h3>`;
    const infoP = info ? `<p class="flag soft">${esc(info)}</p>` : "";
    if (status === "off") { el.innerHTML = `${head}<p class="small">${esc(AT.t("cl_off"))}</p>`; return; }
    if (status === "loading") { el.innerHTML = `${head}<p class="small muted">${esc(AT.t("cl_loading"))}</p>`; return; }
    if (status === "error") { el.innerHTML = `${head}${infoP}<div><button class="btn" type="button" id="cl-retry">${esc(AT.t("cl_retry"))}</button></div>`; el.querySelector("#cl-retry").onclick = init; return; }
    if (status === "out") {
      el.innerHTML = `${head}<p class="small">${esc(AT.t("cl_out"))}</p>
        <form id="cl-form" class="form-grid" novalidate>
          <div class="field"><label for="cl-phone">${esc(AT.t("cl_phone"))}</label><input type="tel" id="cl-phone" inputmode="numeric" autocomplete="username" placeholder="98765 43210" required></div>
          <div class="field"><label for="cl-pw">${esc(AT.t("cl_pw"))}</label><input type="password" id="cl-pw" autocomplete="current-password" minlength="6" required>
            <label class="check"><input type="checkbox" id="cl-show"> <span class="small">${esc(AT.t("cl_showpw"))}</span></label></div>
          <div class="actions"><button class="btn primary" type="submit" ${busy ? 'aria-busy="true" disabled' : ""}>${esc(AT.t("cl_signin"))}</button>
            <button class="btn" type="button" id="cl-create" ${busy ? "disabled" : ""}>${esc(AT.t("cl_create"))}</button></div>
          <p class="tiny muted">${esc(AT.t("cl_create_hint"))}</p>
        </form>${infoP}`;
      const ph = el.querySelector("#cl-phone"), pw = el.querySelector("#cl-pw");
      el.querySelector("#cl-show").onchange = e => { pw.type = e.target.checked ? "text" : "password"; };
      const go = create => {
        const d = cleanPhone(ph.value);
        if (!d) { info = AT.t("cl_badphone"); redraw(); return; }
        if (pw.value.length < 6) { info = AT.t("cl_shortpw"); redraw(); return; }
        signIn(d, pw.value, create);
      };
      el.querySelector("#cl-form").onsubmit = e => { e.preventDefault(); go(false); };
      el.querySelector("#cl-create").onclick = () => go(true);
      return;
    }
    el.innerHTML = `${head}<p class="small">${esc(AT.t("cl_in", phoneOf(user)))}</p>
      <p class="small muted">${esc(cloudMeta ? AT.t("cl_last", when(cloudMeta.updated_at)) : AT.t("cl_nothing"))}</p>${infoP}
      <label class="check"><input type="checkbox" id="cl-auto" ${auto ? "checked" : ""}> <span class="small">${esc(AT.t("cl_auto"))}</span></label>
      <div class="actions"><button class="btn primary small" type="button" id="cl-push" ${busy ? 'aria-busy="true" disabled' : ""}>${esc(AT.t("cl_push"))}</button>
        <button class="btn small" type="button" id="cl-pull" ${busy ? "disabled" : ""}>${esc(AT.t("cl_pull"))}</button>
        <button class="btn quiet small" type="button" id="cl-out">${esc(AT.t("cl_signout"))}</button></div>`;
    el.querySelector("#cl-push").onclick = () => push(false);
    el.querySelector("#cl-pull").onclick = e => { if (AT.u.armed(e.currentTarget, AT.t("cl_pull_sure"), AT.t("cl_pull"))) pull(); };
    el.querySelector("#cl-out").onclick = async () => { await client.auth.signOut(); user = null; status = "out"; info = ""; redraw(); };
    el.querySelector("#cl-auto").onchange = e => { auto = e.target.checked; try { localStorage.setItem(AUTO_KEY, auto ? "1" : "0"); } catch (x) {} };
  }
  function onLocalChange() {
    if (!user || !auto) return;
    clearTimeout(timer); timer = setTimeout(() => push(true), 1500);
  }
  AT.cloud = { init, renderCard, onLocalChange, push, pull };
})(window.AT);
