/* ==========================================================================
   ENGLISH TEXT for every button, heading and sentence on the site.
   Test, medicine and natural-help wording in English lives in the data-… files.
   Entries written as (a, b) => `...` are sentences with numbers filled in.
   ========================================================================== */
window.AT = window.AT || {};
AT.i18n = AT.i18n || {};
AT.i18n.en = { ui: {
  appName: "Arthritis tracker",
  months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  nav_label: "Sections", nav_summary: "Summary", nav_attn: "Needs attention", nav_tests: "Each test", nav_meds: "Medicines",
  nav_care: "Natural help", nav_add: "Add report", nav_history: "All reports", nav_data: "Save and backup",
  light: "Light", dark: "Dark", toLight: "Switch to light mode", toDark: "Switch to dark mode",
  storeWarn: "This browser is not letting the page save. Changes will be lost when you close it. Download a backup after every change, or open the page in a normal (not private) window.",

  /* status words */
  cat_improved: "Getting better", cat_healthy: "Healthy", cat_worse: "Getting worse", cat_discuss: "Discuss with doctor", cat_same: "Not improved",
  lv_ok: "Healthy", lv_edge: "At the edge", lv_slHigh: "Slightly high", lv_slLow: "Slightly low", lv_high: "Too high", lv_low: "Too low", lv_muchHigh: "Much too high", lv_norange: "No range",
  tr_first: "First test", tr_same: "No real change", tr_toward: "Moving toward healthy", tr_away: "Moving away from healthy", tr_upOk: "Up, still healthy", tr_downOk: "Down, still healthy",
  healthyWord: "Healthy", healthyLower: "healthy", upTo: x => `up to ${x}`, fromTo: (a, b) => `${a} to ${b}`, noRange: "no range set", toWord: "to",
  none: "None", was: "was", daysAgo: n => `${n} days ago`,

  /* one sentence about a test */
  sentence: o => {
    let s = `Now ${o.now} ${o.unit} (healthy ${o.range})`;
    if (o.times) s += `, about ${o.times} times the upper limit`;
    s += ".";
    if (o.prev != null) s += ` Was ${o.prev} on ${o.prevDate}: ${o.same ? "about the same" : (o.pct > 0 ? "up " : "down ") + Math.abs(o.pct) + "%"}${o.trend ? ", " + o.trend.toLowerCase() : ""}.`;
    else s += " First time tested.";
    if (o.notNewest) s += ` Not in the newest report; last tested ${o.notNewest}.`;
    if (o.diag) s += " Discuss with the doctor; it is not a number to bring down.";
    return s;
  },

  /* hero */
  hero_counts: (b, w) => `Better in ${b}, worse in ${w}`,
  hero_healthy: (h, n) => `${h} of ${n} results are healthy`,
  hero_empty: "Add her first report",
  hero_empty_p: "Restore her backup file, or add a report, and the page will compare everything for you.",
  hero_cmp: (a, b) => `Her newest report (${a}) compared with ${b}.`,
  hero_one: a => `Her report from ${a}.`,
  hero_worry: n => `The biggest worry is ${n.toLowerCase()}.`,
  hero_noworry: "Nothing is far from healthy right now.",
  hero_meta: (n, s) => `${n} report${n === 1 ? "" : "s"} saved on this device.${s ? ` ${s} result${s === 1 ? "" : "s"} not improved yet.` : ""}`,
  hero_sig_none: "No result needs attention", hero_sig_none_p: "When a result is outside the healthy range, its chart appears here.",
  hero_start_t: "No reports on this device yet", hero_start_p: "Each phone keeps its own copy. Sign in to Cloud backup with the same email to load her data here, or restore a backup file.", hero_start_btn: "Load her data",
  addNew: "Add a new report", seeAttn: "See what needs attention",

  /* summary */
  sum_h: "Summary", sum_p: d => `How the newest report (${d}) compares with each test's previous result.`, sum_p1: "Add a second report to see what is getting better or worse.",
  testsCompared: "tests compared",
  sum_text: o => {
    let s = `<b>${o.better} result${o.better === 1 ? "" : "s"} got better</b>, <b>${o.worse} got worse</b> and <b>${o.same} ${o.same === 1 ? "has" : "have"} not improved</b>. ${o.healthy} ${o.healthy === 1 ? "is" : "are"} healthy.`;
    if (o.top) s += ` The one to watch most is <b>${o.top.n.toLowerCase()}</b> (${o.top.t}), ${o.top.lv.toLowerCase()}.`;
    if (o.discuss.length) s += ` ${o.discuss.join(" and ")} ${o.discuss.length === 1 ? "is" : "are"} for the doctor to interpret.`;
    return s;
  },
  perRep_h: "Healthy results in each report", perRep_p: "Only the 3 newest reports are compared. The arthritis antibody tests are left out, because they are not a health goal.",
  waitNext: "Waiting for the next report", waitNext_p: "The next report you add joins the comparison.",
  nHealthy: n => `${n} healthy`, nOutside: n => `${n} outside healthy`,
  repLine: (newest, ok, out) => `${newest ? "Newest. " : ""}${ok} healthy, ${out} outside the range`,
  noReports: "No reports yet.",

  /* attention */
  attn_h: "What needs attention", attn_p: "Most important first. Ranked by how far each result is from healthy, whether it is getting worse, and what her medicines need watching.",
  attn_none: "Nothing needs attention right now", attn_none_p: "Every result in the latest reports is inside its healthy range.",
  medCheck: "Medicine check:", outsideHealthy: "Outside healthy", askDoctor: "Ask the doctor", seeMed: "See medicine",

  /* each test */
  tests_h: "Each test, one chart", tests_p: "The green band is the healthy range from her lab. Each dot is one report, the newest on the right. A line moving into the band is good news.",
  f_all: "All tests", f_attn: "Outside healthy", f_discuss: "For the doctor",
  labName: "Lab name:", herResult: "Her result:", whatHelps: "What helps (see Natural help):", noTestsGroup: "No tests in this group.",
  showTable: "Show all numbers as a table", th_test: "Test", th_result: "Result", olderTag: "(older)",

  /* medicines */
  meds_h: "Her medicines", meds_p: "Add what she takes regularly. For each one the page explains what it does to the body over time, what to watch for, and which blood tests keep it safe, then checks her reports for those tests.",
  meds_note_b: "Information to discuss with her doctor, never advice.", meds_note: "Do not start, stop or change any medicine, or its dose, because of this page. Some medicines (steroids especially) are dangerous to stop suddenly.",
  med_add: "Add a medicine", med_edit: "Edit medicine", med_name: "Medicine name", med_name_ph: "As written on the strip, e.g. Folitrax 15",
  med_hint: "Brand or chemical name both work.", med_recog: n => `Recognised as: ${n}.`, med_norecog: "Not in the built-in list yet. You can still save it.",
  med_dose: "Dose and how often", med_dose_ph: "e.g. 15 mg once a week", med_since: "Taking since", med_notes: "Notes (optional)", med_notes_ph: "e.g. Sunday after breakfast",
  med_save: "Save medicine", cancel: "Cancel", med_err: "Type the medicine name first.", med_saved: n => `Saved ${n}. Its checks are below and in the attention list.`, med_removed: "Medicine removed.",
  med_none: "No medicines added yet", med_none_p: "Add each tablet, injection or supplement she takes regularly, with the name printed on the strip. The page will explain its long-term effects and check her reports for the blood tests it needs.",
  med_unknown_b: "Not in the built-in list.", med_unknown: "Ask the doctor or pharmacist what it is for, its long-term effects, and which blood tests it needs. If it is an Ayurvedic or desi product, type \"ayurvedic\" in the name so the page can warn about it.",
  med_common: "Common effects", med_long: "Long-term effects on the body", med_know: "Know this", med_checks: "Other checks (not blood tests)", med_tests: "Blood tests that watch it, from her reports",
  notTested: "Not tested yet", dueAgain: "Due again", notInReports: "Not in any report yet",
  med_allok: "Her latest results for these tests are within the healthy range.",
  med_source: "General information from standard rheumatology guidance (ACR, EULAR, NHS SPS). Her doctor knows her full history and decides what applies to her.",
  sinceWord: m => `since ${m}`, edit: "Edit", remove: "Remove", tapRemove: "Tap again to remove", del: "Delete", tapDelete: "Tap again to delete",
  flag_bad: o => `${o.name} is ${o.dir === "up" ? "above" : "below"} healthy at ${o.x} ${o.unit}, and ${o.med.toLowerCase()} is one known cause to rule out. Show the doctor.`,
  flag_before: o => `${o.name} was already ${o.dir === "up" ? "above" : "below"} healthy (${o.x} ${o.unit}) before ${o.med.toLowerCase()} started. Repeat it on the medicine so the doctor can compare.`,
  flag_trend: o => `${o.name} is still healthy but ${o.dir === "up" ? "rose" : "fell"} ${o.ch}% across the last reports. With ${o.med.toLowerCase()}, doctors watch the trend, not only the range.`,
  flag_expect: o => `${o.name} is ${o.dir === "up" ? "rising" : "falling"} as hoped with ${o.med.toLowerCase()}.`,
  flag_missing: (list, meds, n) => `Not in any report yet: ${list}. ${n > 1 ? "These are" : "This is"} used to watch ${meds.toLowerCase()}. Ask the doctor when to test.`,
  flag_due: (list, meds) => `Due again: ${list}. With ${meds.toLowerCase()} these are usually repeated every few months.`,

  /* natural help */
  care_h: "Natural ways to help", care_p: "No prescription needed. These support her treatment and never replace it. Cards linked to her current results and medicines come first, and the order changes with each new report.",
  care_why: w => `Showing because: ${w}.`, care_whyMed: "Showing because of her medicines.", care_always: "Good for everyone with arthritis.", care_ref: "Her results here are healthy now; kept for reference.",
  never_h: "What this page will never suggest",
  never_p: "Unregulated \"joint pain\" churans, capsules or desi remedies. Tests of such products in India found heavy metals in all 42 samples tested and hidden steroids in about 38% of others. They can make reports look better for a while and cause real harm. If she already takes one, do not stop it suddenly: tell the doctor, because a hidden steroid must be tapered.",
  care_src: "Sources: American College of Rheumatology 2022 guideline on exercise and diet in rheumatoid arthritis; EULAR 2021 lifestyle recommendations; NHS SPS methotrexate monitoring; American Academy of Ophthalmology hydroxychloroquine screening; Bhalla and Pannu 2022.",

  /* add a report */
  add_h: "Add a report", add_p: "Three steps. Everything on this page updates as soon as you save: the comparison, the attention list, the medicine checks and the natural-help order.",
  s1_h: "Open the report to copy from", s1_p: "Take a photo of the paper report, or choose the PDF from the lab. It is shown here only so you can read it while typing; it is not uploaded anywhere and not saved.",
  dropHere: "Drop the photo or PDF here", chooseFile: "Choose photo or PDF", openPdf: "Open the PDF full screen", photoAlt: "Photo of the report", badFile: "That file type cannot be shown. Choose a photo or a PDF.",
  s2_h: "Type the numbers", repDate: "Report date", labField: "Lab name", labPh: "e.g. Shri Keshav Diagnostic Center",
  s2_p: "Leave a box empty if that test is not in this report. The healthy range is filled in from her last report; change it if the new lab prints a different one.",
  moreTests: "More tests (liver, sugar, vitamins, iron, thyroid and others)", newTest: "Add a test that is not on these lists",
  n_name: "Plain name", n_name_ph: "e.g. Thyroid hormone", n_lab: "Name on the report", n_unit: "Unit", n_val: "Her result", n_lo: "Healthy from", n_hi: "Healthy up to",
  n_add: "Add this test to the report", n_err: "Give the test a name and her result.", n_err2: "The 'up to' number must be bigger than the 'from' number.",
  n_exists: n => `${n} is already on the list; her result was filled in there.`, n_added: n => `Added ${n}. It will be saved with the report.`,
  customMeaning: "A test added by the family.",
  s3_h: "Check and save", s3_p: "Numbers that look very unusual are highlighted so you can check them against the paper. If there are now more than 3 reports, the oldest moves to All reports and stays tracked there.",
  saveReport: "Save report", saveChanges: "Save changes", cancelEdit: "Cancel editing",
  err_date: "Add the report date first.", err_empty: "Type at least one result before saving.",
  err_odd: n => `${n} number${n > 1 ? "s look" : " looks"} unusual (highlighted). Check against the paper, then press Save again.`,
  ok_edit: "Changes saved.", ok_merge: d => `Merged into the existing report of ${d}.`, ok_saved: "Report saved. Everything has been recomputed.",
  toast_saved: list => `Saved. Now comparing ${list}. Remember to back up.`, editing: d => `Editing the report from ${d}.`,

  /* all reports */
  hist_h: "All reports", hist_p: "The comparison always uses the 3 newest reports. Older ones stay here; nothing is deleted, and every test keeps its own long-term chart.",
  inCmp: "In the comparison", olderRep: "Older report", nTests: n => `${n} tests`, deleted: "Report deleted. The comparison has been updated.",
  long_h: "Every test over time", long_p: n => `All ${n} reports, oldest on the left. Each test is tracked on its own.`,
  long_wait: n => `There ${n === 1 ? "is 1 report" : "are " + n + " reports"}, so all are in the comparison. When a 4th arrives, the oldest moves here with a long-term chart for every test.`,

  /* save and backup */
  data_h: "Save and backup", data_p: "Her data is private. It is kept in this browser on this device and is sent nowhere, unless you turn on cloud backup to your own Supabase account. The page works without internet.",
  exp_h: "Download backup", exp_p: "Saves everything (reports, medicines, custom tests) as one small file. Do this after every new report and keep the file somewhere safe.",
  exp_btn: "Download backup", exp_done: "Backup downloaded. Keep the file somewhere safe.",
  bk_never: "No backup downloaded yet.", bk_old: d => `Last backup ${d}. Changes made since then are not in it.`, bk_ok: d => `Last backup ${d}. Up to date.`,
  imp_h: "Restore from backup", imp_p: "Use this on a new phone, or after clearing the browser. It replaces what is on this device with the file's contents.",
  imp_btn: "Choose backup file", imp_ok: (r, m) => `Restored ${r} reports and ${m} medicines.`, imp_bad: "This file is not a backup from this tracker. Nothing was changed.",
  key_h: "What the colours mean",
  key_improved: "Moved closer to the healthy range since the previous report, or came back into it.",
  key_healthy: "Inside the healthy range printed on her report, and stayed there.",
  key_worse: "Moved further away from the healthy range.",
  key_discuss: "Tests like the arthritis antibody (RF) that help the doctor diagnose, but are not a goal to bring down.",
  key_same: "Still outside the range and changed by less than 1.5%, or only tested once.",
  wipe_btn: "Remove all data from this device", wipe_p: "Download a backup first.", tapWipe: "Tap again to remove everything", wiped: "All data removed from this device.",

  /* cloud backup */
  cl_h: "Cloud backup",
  cl_off: "Not set up. To keep a copy online, follow part 3 of GUIDE.md and add your Supabase details to config.js.",
  cl_loading: "Connecting…", cl_offline: "Could not reach the cloud. Check the internet and try again. Your data on this device is safe.", cl_retry: "Try again",
  cl_in: e => `Signed in as ${e}. Only this account can read the backup.`,
  cl_out: "Sign in with her mobile number and a password to keep an online copy. Use Create account only the very first time, on one phone.",
  cl_phone: "Mobile number",
  cl_pw: "Password (at least 6 characters)",
  cl_showpw: "Show password",
  cl_signin: "Sign in",
  cl_create: "Create account (first time)",
  cl_create_hint: "Create the account only once. On every other phone, use the same number and password with Sign in.",
  cl_badphone: "Type a 10-digit mobile number.",
  cl_shortpw: "The password needs at least 6 characters.",
  cl_wrong: "Mobile number or password is wrong. Check both and try again.",
  cl_exists: "An account for this number already exists. Press Sign in instead.",
  cl_nosignup: "New accounts are switched off in Supabase. Turn on 'Allow new users to sign up' for a moment (guide step 3.3).",
  cl_confirm: "Supabase is asking for email confirmation. Turn off 'Confirm email' in Supabase (guide step 3.3), then press Create account again.",
  cl_last: w => `Last saved to the cloud: ${w}.`, cl_nothing: "Nothing saved to the cloud yet.",
  cl_newer: w => `The cloud has a newer copy (${w}). Press "Restore from cloud" to use it on this phone.`,
  cl_auto: "Save to the cloud automatically after every change",
  cl_push: "Save to cloud now", cl_pull: "Restore from cloud", cl_pull_sure: "Tap again: replace this phone's data", cl_signout: "Sign out",
  cl_saved: "Saved to the cloud.", cl_restored: "Restored from the cloud.", cl_none: "There is no cloud backup yet.", cl_bad: "The cloud copy could not be read. Nothing was changed.",
  cl_err: m => `Cloud backup problem: ${m}. Your data on this device is safe.`,

  /* footer */
  foot_b: "Not medical advice.",
  foot_1: "This tracker helps the family read reports and prepare questions. It is not a diagnosis or a prescription, and her doctor decides treatment. If a single joint becomes hot, swollen and very painful with fever, get medical help the same day.",
  foot_2: "Healthy ranges come from her lab reports. Medicine information is general, from standard rheumatology guidance, and may not cover her exact situation."
}};
