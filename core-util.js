/* Small helpers shared by every section. */
window.AT = window.AT || {};
(function (AT) {
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmt = x => { if (x == null || !isFinite(x)) return "–"; const a = Math.abs(x); return a >= 100 ? String(Math.round(x)) : String(+x.toFixed(2)); };
  const months = () => AT.t("months");
  const dLong = iso => { const [y, m, d] = iso.split("-").map(Number); return `${d} ${months()[m - 1]} ${y}`; };
  const dShort = iso => { const [, m, d] = iso.split("-").map(Number); return `${d} ${months()[m - 1]}`; };
  const monthYear = ym => { const [y, m] = ym.split("-").map(Number); return `${months()[m - 1]} ${y}`; };
  const daysSince = iso => Math.floor((Date.now() - new Date(iso + "T00:00:00").getTime()) / 864e5);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clone = o => JSON.parse(JSON.stringify(o));
  const lc = s => s ? s[0].toLowerCase() + s.slice(1) : s;
  let toastTimer;
  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3400);
  }
  /* two-tap confirm for delete buttons, so no browser pop-ups are needed */
  function armed(btn, armedText, normalText) {
    if (btn.dataset.armed === "1") return true;
    btn.dataset.armed = "1"; btn.textContent = armedText;
    setTimeout(() => { if (btn.isConnected) { btn.dataset.armed = ""; btn.textContent = normalText; } }, 4000);
    return false;
  }
  AT.u = { $, esc, fmt, dLong, dShort, monthYear, daysSince, uid, clone, lc, toast, armed };
})(window.AT);
