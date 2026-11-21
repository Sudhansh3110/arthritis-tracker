/* ==========================================================================
   CLOUD BACKUP SETTINGS (Supabase)
   Leave both empty to keep everything on this device only.
   Fill them in from Supabase: Project Settings > API (see GUIDE.md, part 3).
   The "anon public" key is meant to be public. Her data stays private because
   the table only lets each signed-in person read and write their own row.
   NEVER put the "service_role" key here.
   ========================================================================== */
window.AT = window.AT || {};
AT.CONFIG = {
  supabaseUrl: "https://npygajbcgaaenlsjtkyp.supabase.co",      // e.g. "https://abcdefghijkl.supabase.co"
  supabaseAnonKey: "sb_publishable_cvhKr_Y3-TFuhSPq3jdbRg_GpwkZDha",  // the long "anon public" key
  table: "tracker_backups"
};
