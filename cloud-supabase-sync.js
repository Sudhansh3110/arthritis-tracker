/* ==========================================================================
   CLOUD BACKUP (optional, Supabase)
   Works only when config.js has the project URL and anon key, and only on
   the published website (sign-in links cannot open a file on the phone).
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
  const isFile = () => location.protocol === "file:";
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
      client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, detectSessionInUrl: true, autoRefreshToken: true } });
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
      if (!meta) { if (local.reports.length || local.meds.length) await push(true); }
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
  async function signIn(email) {
    const redirect = location.origin + location.pathname;
    const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect, shouldCreateUser: true } });
    info = error ? AT.t("cl_err", error.message) : AT.t("cl_sent", email);
    redraw();
  }
  function redraw() { if (cardEl && cardEl.isConnected) renderCard(cardEl); }

  function renderCard(el) {
    cardEl = el;
    const head = `<h3>${esc(AT.t("cl_h"))}</h3>`;
    const infoP = info ? `<p class="flag soft">${esc(info)}</p>` : "";
    if (status === "off") { el.innerHTML = `${head}<p class="small">${esc(AT.t("cl_off"))}</p>`; return; }
    if (isFile()) { el.innerHTML = `${head}<p class="small">${esc(AT.t("cl_file"))}</p>`; return; }
    if (status === "loading") { el.innerHTML = `${head}<p class="small muted">${esc(AT.t("cl_loading"))}</p>`; return; }
    if (status === "error") { el.innerHTML = `${head}${infoP}<div><button class="btn" type="button" id="cl-retry">${esc(AT.t("cl_retry"))}</button></div>`; el.querySelector("#cl-retry").onclick = init; return; }
    if (status === "out") {
      el.innerHTML = `${head}<p class="small">${esc(AT.t("cl_out"))}</p>
        <form id="cl-form" class="form-grid" novalidate><div class="field"><label for="cl-email">${esc(AT.t("cl_email"))}</label><input type="email" id="cl-email" autocomplete="email" required></div>
        <div><button class="btn primary" type="submit">${esc(AT.t("cl_send"))}</button></div></form>${infoP}`;
      el.querySelector("#cl-form").onsubmit = e => {
        e.preventDefault(); const v = el.querySelector("#cl-email").value.trim();
        if (!/^\S+@\S+\.\S+$/.test(v)) { info = AT.t("cl_bademail"); redraw(); return; }
        signIn(v);
      };
      return;
    }
    el.innerHTML = `${head}<p class="small">${esc(AT.t("cl_in", user.email || ""))}</p>
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
