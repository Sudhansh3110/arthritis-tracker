# Arthritis tracker: step-by-step guide

This guide takes you from the folder of files to a working website on your phone, with an online backup. No coding is needed. Set aside about 45 minutes the first time.

- **Part 1** uses the tracker straight away, offline, with no account.
- **Part 2** publishes it as a website on GitHub Pages (free).
- **Part 3** adds an online backup with Supabase (free), so her data survives a lost phone.
- **Part 4** explains which file to edit for each section later.
- **Part 5** covers privacy, and **Part 6** fixes common problems.

> **The most important rule.** A free GitHub Pages website is public, so anyone can look at its *code*. Her *health data* must never go into GitHub. Her data lives only in the phone's browser, in backup files you keep, and (after Part 3) in your own locked Supabase table. The single offline file and the backup files hold her data and are never uploaded.

---

## What is in the folder

| File or folder | What it is |
|---|---|
| `index.html` | The page itself. It loads all the other files. |
| `tokens.css` | Every colour and font, for light mode and dark mode. |
| `base.css` | Buttons, form boxes, spacing. |
| `sections.css` | The look of each section, in page order. |
| `config.js` | Your Supabase details (Part 3). Empty means no cloud. |
| `data-tests.js` | The list of blood tests: names, healthy ranges, meanings. |
| `data-medicines.js` | The medicine knowledge table: effects, warnings, which tests to watch. |
| `data-care.js` | The natural-help cards (exercise, diet, iron, bones and so on). |
| `data-seed.js` | Starting data. Kept empty on purpose (see the rule above). |
| `i18n-en.js` | All English wording on the site. |
| `i18n-hi.js` | All Hindi wording: interface, tests, medicines, care cards. |
| the `core-…` files | The engine: saving, the comparison rules, charts. You rarely need to touch it. |
| `cloud-supabase-sync.js` | The online backup. |
| the `sections-…` files | One file per section of the page (top bar, summary, medicines and so on). |
| `supabase-setup.sql` | Creates the locked backup table in Supabase (Part 3). |
| `her-starting-data.json` (sent separately) | Her 3 Oct and 10 Nov 2026 reports as a backup file. **Never upload.** |
| `arthritis-tracker.html` (sent separately) | One-file offline version with her two reports already inside. **Never upload.** |

---

## Part 1: Use it today, offline (2 minutes)

1. Send `arthritis-tracker.html` to the phone privately, for example on WhatsApp to yourself or by cable.
2. On the phone, open the file in **Chrome** (Android) or **Files, then Safari** (iPhone).
3. Her two reports are already there. Everything you add is saved in that browser on that phone.
4. After every new report, go to **Save and backup** and press **Download backup**. Keep the file safe.

Each phone keeps its own data. If you use the tracker on two phones, move the data with **Download backup** on one and **Restore from backup** on the other.

---

## Part 2: Publish the website on GitHub Pages (15 minutes)

### 2.1 Make a GitHub account
1. Go to **github.com** and choose **Sign up**. Use your email and a strong password.
2. Verify your email.

### 2.2 Create the repository (the website's home)
1. Signed in, press the **+** at the top right, then **New repository**.
2. **Repository name:** `arthritis-tracker`.
3. Choose **Public**. Free GitHub Pages needs a public repository. That is safe, because no health data goes in it.
4. Leave the other boxes as they are and press **Create repository**.

### 2.3 Upload the files
1. Unzip `arthritis-tracker-flat.zip` on your computer or phone. You get one folder with about 30 files and no folders inside.
2. On the new repository's page, press the link **uploading an existing file** (or **Add file**, then **Upload files**).
3. Open the unzipped folder, select **all the files inside it** (Ctrl+A on Windows, Cmd+A on Mac, or **Select all** on a phone), and drag them into the upload box, or use **choose your files**.
4. Wait until every file is listed, write "First version" in the message box, and press **Commit changes**.
5. Check that `index.html` is in the file list at the top level.
6. Never upload `arthritis-tracker.html` (the offline single file) or any backup `.json` file. They hold her health data.

### 2.4 Turn on GitHub Pages
1. In the repository, open **Settings** (top menu), then **Pages** (left menu).
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Set **Branch** to **main** and the folder to **/ (root)**, then press **Save**.
4. Wait 1 to 3 minutes and refresh. The page shows **Your site is live at** `https://YOUR-USERNAME.github.io/arthritis-tracker/`.

### 2.5 Open it on the phone
1. Open that link in Chrome or Safari on her phone. It starts empty.
2. Go to **Save and backup**, then **Restore from backup**, and choose `her-starting-data.json` (send it to the phone privately first) or her latest downloaded backup.
3. Add it to the home screen. In Chrome, open the **⋮** menu and choose **Add to Home screen**. In Safari, tap **Share** and choose **Add to Home Screen**.

The page also has `noindex` set, so search engines are asked not to list it.

---

## Part 3: Online backup with Supabase (20 minutes)

Supabase gives you a small private database. The tracker keeps a copy of everything there, linked to your email. Sign-in uses a link sent by email, so there is no password to remember.

### 3.1 Create the project
1. Go to **supabase.com** and choose **Start your project**. Sign up (signing in with GitHub is easiest).
2. Press **New project**.
   - **Name:** `arthritis-tracker`
   - **Database password:** press **Generate a password** and save it in your password manager. The tracker does not use it, but you need it for account recovery.
   - **Region:** **South Asia (Mumbai)**, the closest to Rajasthan.
3. Press **Create new project** and wait about 2 minutes.

### 3.2 Create the locked table
1. In the left menu, open **SQL Editor**, then **New query**.
2. Open `supabase-setup.sql` from the folder, copy **all** of it, and paste it into the editor.
3. Press **Run**. It should say **Success. No rows returned**.
4. Check it: open **Table Editor**. You should see the table `tracker_backups`, and it should **not** be marked "Unrestricted". If it says Unrestricted, row-level security is off; run the file again.

### 3.3 Tell Supabase where your website is
1. Open **Authentication**, then **URL Configuration**.
2. **Site URL:** paste your website link, for example `https://YOUR-USERNAME.github.io/arthritis-tracker/`.
3. Under **Redirect URLs**, press **Add URL** and paste the same link. Save.
4. Open **Authentication**, then **Sign In / Providers**, and check that **Email** is turned on. It is on by default.

### 3.4 Copy the two keys into the website
1. Open **Project Settings** (the gear icon), then **API** (it may be called **Data API** or **API Keys** in newer versions).
2. Copy the **Project URL**. It looks like `https://abcdefghijkl.supabase.co`.
3. Copy the **anon public** key. Newer versions call it the **publishable** key. It is a long text.
   - **Never** copy the **service_role** or **secret** key. That one can read everything.
4. On GitHub, open your repository, then `js`, then `config.js`. Press the **pencil icon** (Edit).
5. Paste the two values between the quotes:
   ```js
   supabaseUrl: "https://abcdefghijkl.supabase.co",
   supabaseAnonKey: "eyJhbGciOi...the long key...",
   ```
6. Press **Commit changes**. The website updates within 1 to 3 minutes.

The anon key is designed to be public. The data stays private because of the table rules from step 3.2: a person can only read their own row, and only after signing in.

### 3.5 Sign in on the phone
1. Open the website on her phone and go to **Save and backup**. The **Cloud backup** card now asks for an email.
2. Type your email and press **Send sign-in link**.
3. Open the email **on the same phone** and tap the link. The tracker opens already signed in.
4. If the phone already has her reports, they are uploaded straight away. If the phone is empty and the cloud has a copy, press **Restore from cloud**.
5. Leave **Save to the cloud automatically after every change** ticked.

To use the tracker on a second phone, sign in there **with the same email**. A different email gets its own separate, empty backup.

### 3.6 Lock the door to strangers (recommended)
Once everyone who needs it has signed in once:
1. In Supabase, open **Authentication**, then **Sign In / Providers**.
2. Turn **off** **Allow new users to sign up** and save.

Strangers could never see her data anyway, but this stops them creating accounts on your project at all.

### 3.7 Good to know
- On the free plan, Supabase pauses a project after about a week without use. The data is kept. Open the Supabase dashboard and press **Restore project** to wake it up. Using the tracker regularly keeps it awake.
- Keep pressing **Download backup** now and then. Two backups are better than one.
- To see her backup in Supabase, open **Table Editor** and then `tracker_backups`. The `data` column holds everything as text.

---

## Part 4: Changing things later

Open the file on GitHub, press the **pencil icon**, make the change, then **Commit changes**. The site updates in 1 to 3 minutes. On the phone, pull down to refresh.

| I want to… | Edit this file |
|---|---|
| Change a healthy range, add a new blood test | `data-tests.js` (Hindi name in `i18n-hi.js`, under `tests`) |
| Add a medicine or change what it says | `data-medicines.js` (Hindi in `i18n-hi.js`, under `meds`) |
| Change exercises, diet or other tips | `data-care.js` (Hindi in `i18n-hi.js`, under `care`) |
| Change any button or heading wording | `i18n-en.js` and `i18n-hi.js` (same key in both) |
| Change colours or fonts | `tokens.css` (keep the light and dark blocks in step) |
| Change how one section looks | `sections.css` (it is in page order) |
| Change what one section shows | its file in the `sections-…` files |
| Change the rules (what counts as better or worse) | `core-analysis.js` (explained at the top of the file) |

Tips:
- Copy an existing line and change it, and keep the commas and quotes exactly as in the lines around it.
- Never change an existing `id` or `key` (like `crp` or `mtx`), because saved reports use them.
- If the page goes blank after an edit, a comma or quote is usually missing. Open the file's **History** on GitHub to see or undo the last change.


---

## Part 5: Privacy checklist

1. `arthritis-tracker.html`, `her-starting-data.json` and backup files (`arthritis-tracker-backup-*.json`) are never uploaded to GitHub.
2. `data-seed.js` stays empty.
3. `supabase-setup.sql` has been run, and the table is not marked "Unrestricted".
4. Only the **anon/publishable** key is in `config.js`, never the service_role or secret key.
5. If her data ever went into the public repository by mistake, deleting the file is not enough, because GitHub keeps history. The simplest fix is to delete the whole repository (**Settings**, then **Danger Zone**, then **Delete this repository**) and create a fresh one without the data.
6. The tracker is information to discuss with her doctor. It never replaces the doctor.

---

## Part 6: If something goes wrong

| Problem | Fix |
|---|---|
| The GitHub link shows 404 | Wait 3 minutes. Check Settings, then Pages, shows main and /(root), and that `index.html` sits at the top of the repository, not inside a folder. |
| The page is blank | A typo in the last file you edited. Undo it via the file's History on GitHub. |
| The Cloud backup card says "Not set up" | `config.js` is still empty, or the site has not updated yet. Refresh after 3 minutes. |
| The sign-in link opens a "localhost" or wrong page | Step 3.3: the Site URL and Redirect URL must be your GitHub Pages link. |
| No sign-in email arrives | Check spam. The free plan sends only a few emails per hour, so wait and try again. |
| The cloud says "permission denied" or "row-level security" | Run `supabase-setup.sql` again and make sure you are signed in. |
| Data vanished from the phone | Browser data was cleared. Use **Restore from cloud** or **Restore from backup**. |
| The cloud does not work when opening the file directly | Expected. Sign-in links need the published website. The offline file uses Download backup instead. |
