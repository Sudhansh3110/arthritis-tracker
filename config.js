/* ==========================================================================
   CLOUD BACKUP SETTINGS (Supabase)
   Leave both empty to keep everything on this device only.
   Fill them in from Supabase: the Connect button or Project Settings (GUIDE.md, part 3).
   The "anon public" key is meant to be public. Her data stays private because
   the table only lets each signed-in person read and write their own row.
   NEVER put the "service_role" key here.
   ========================================================================== */
window.AT = window.AT || {};
AT.CONFIG = {
  supabaseUrl: "",      // e.g. "https://abcdefghijkl.supabase.co"
  supabaseAnonKey: "",  // the "publishable" or "anon public" key
  ownerEmail: "",       // YOUR email, e.g. "yourname@gmail.com". Logins by mobile number are
                        // stored as yourname+91XXXXXXXXXX@gmail.com, so nothing is sent by SMS.
  table: "tracker_backups"
};
