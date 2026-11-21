/* Starts the tracker and redraws every section when something changes.
   To add a new section: create sections-your-section.js, add a <section>
   with the same id in index.html, load the script there, and add it below. */
window.AT = window.AT || {};
(function (AT) {
  const ORDER = ["hero", "summary", "attention", "tests", "medicines", "care", "addReport", "history", "backup", "footer"];

  AT.renderAll = function (full) {
    const langChanged = AT._lastLang !== AT.lang; AT._lastLang = AT.lang;
    full = full || langChanged;
    document.documentElement.lang = AT.lang;
    document.title = AT.t("appName");
    AT.A = AT.rules.analyse();
    AT.sections.topbar.render();
    ORDER.forEach(name => {
      try { AT.sections[name].render(AT.A, full); }
      catch (e) { console.error("Section failed:", name, e); }
    });
    const w = document.getElementById("store-warning");
    w.hidden = AT.canStore; w.textContent = AT.t("storeWarn");
    observeNav();
  };
  AT.renderCharts = () => AT.renderAll(false);

  /* tooltip for chart dots and pie slices */
  const tip = document.getElementById("tip");
  document.addEventListener("pointerover", e => {
    const t = e.target.closest && e.target.closest("[data-tip]");
    if (!t || !t.dataset.tip) { tip.classList.remove("show"); return; }
    tip.textContent = t.dataset.tip;
    const b = t.getBoundingClientRect();
    tip.style.left = Math.min(window.innerWidth - 250, Math.max(8, b.left + b.width / 2 - 60)) + "px";
    tip.style.top = Math.max(8, b.top - 42) + "px";
    tip.classList.add("show");
  });
  document.addEventListener("scroll", () => tip.classList.remove("show"), { passive: true });

  /* highlight the section you are in */
  let io;
  function observeNav() {
    if (!("IntersectionObserver" in window)) return;
    if (io) io.disconnect();
    const links = [...document.querySelectorAll(".links a")];
    io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) links.forEach(l => l.setAttribute("aria-current", l.getAttribute("href") === "#" + en.target.id ? "true" : "false"));
    }), { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(s => io.observe(s));
  }

  AT.state = AT.store.load();
  AT.store.probe();
  AT.renderAll(true);
  AT.cloud.init();
})(window.AT);
