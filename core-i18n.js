/* Language switch. Text lives in i18n-en.js and i18n-hi.js.
   AT.t("key", ...args)  -> interface text (a string, or a function filled with args)
   AT.tx(kind, id, field, englishValue) -> Hindi version of a test, medicine or care card
   when Hindi is on and a translation exists; otherwise the English value. */
window.AT = window.AT || {};
(function (AT) {
  const PREF = "arthritis-tracker-lang";
  let saved = null;
  try { saved = localStorage.getItem(PREF); } catch (e) {}
  AT.lang = saved === "hi" ? "hi" : "en";

  AT.t = function (key, ...args) {
    const dict = (AT.i18n[AT.lang] && AT.i18n[AT.lang].ui) || {};
    let v = dict[key];
    if (v == null) v = AT.i18n.en.ui[key];
    if (v == null) return key;
    return typeof v === "function" ? v(...args) : v;
  };
  AT.tx = function (kind, id, field, fallback) {
    if (AT.lang !== "en") {
      const pack = AT.i18n[AT.lang] && AT.i18n[AT.lang][kind];
      const o = pack && pack[id];
      if (o && o[field] != null) return o[field];
    }
    return fallback;
  };
  AT.setLang = function (lang) {
    AT.lang = lang === "hi" ? "hi" : "en";
    try { localStorage.setItem(PREF, AT.lang); } catch (e) {}
    document.documentElement.lang = AT.lang;
    AT.renderAll();
  };
})(window.AT);
