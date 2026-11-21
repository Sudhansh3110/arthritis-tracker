/* Top bar: name, section links, light/dark switch, English/Hindi switch. */
window.AT = window.AT || {};
AT.sections = AT.sections || {};
(function (AT) {
  const { $, esc } = AT.u;
  const LINKS = [["s-glance", "nav_summary"], ["s-attn", "nav_attn"], ["s-tests", "nav_tests"], ["s-meds", "nav_meds"], ["s-care", "nav_care"], ["s-add", "nav_add"], ["s-history", "nav_history"], ["s-data", "nav_data"]];
  const THEME_KEY = "arthritis-tracker-theme";

  function currentTheme() { return document.documentElement.getAttribute("data-theme") || "auto"; }
  function applyTheme(mode) {
    if (mode === "light" || mode === "dark") document.documentElement.setAttribute("data-theme", mode);
    else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
  }
  function isDarkNow() {
    const m = currentTheme();
    return m === "dark" || (m === "auto" && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
  }

  AT.sections.topbar = {
    render() {
      const el = $("topbar");
      const dark = isDarkNow();
      el.innerHTML = `<div class="wrap">
        <a class="mark" href="#top">${esc(AT.t("appName"))}</a>
        <nav class="links" aria-label="${esc(AT.t("nav_label"))}">${LINKS.map(([id, k]) => `<a href="#${id}">${esc(AT.t(k))}</a>`).join("")}</nav>
        <div class="bar-tools">
          <button class="tool" type="button" id="theme-btn" aria-label="${esc(dark ? AT.t("toLight") : AT.t("toDark"))}" title="${esc(dark ? AT.t("toLight") : AT.t("toDark"))}">
            ${dark
              ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
              : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'}
            <span class="tool-label">${esc(dark ? AT.t("light") : AT.t("dark"))}</span>
          </button>
          <button class="tool lang" type="button" id="lang-btn" lang="${AT.lang === "en" ? "hi" : "en"}">${AT.lang === "en" ? "हिंदी" : "English"}</button>
        </div>
      </div>`;
      $("theme-btn").onclick = () => { applyTheme(isDarkNow() ? "light" : "dark"); this.render(); AT.renderCharts && AT.renderCharts(); };
      $("lang-btn").onclick = () => AT.setLang(AT.lang === "en" ? "hi" : "en");
    }
  };
  /* follow the phone's setting while in auto mode */
  if (window.matchMedia) {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const fn = () => { if (currentTheme() === "auto") AT.sections.topbar.render(); };
    mq.addEventListener ? mq.addEventListener("change", fn) : mq.addListener(fn);
  }
})(window.AT);
