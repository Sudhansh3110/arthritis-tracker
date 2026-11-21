-- =====================================================================
-- Arthritis tracker: cloud backup table for Supabase
-- Paste all of this into Supabase > SQL Editor > New query, then Run.
-- It creates one private table. Each signed-in person can only read and
-- write their OWN row. Nobody else (not even other signed-in users, and
-- not anyone who only has the public "anon" key) can see her data.
-- =====================================================================

create table if not exists public.tracker_backups (
  user_id    uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- Turn on row-level security: without a matching policy, nothing is visible.
alter table public.tracker_backups enable row level security;

-- Only the owner can read, add, change or delete their row.
drop policy if exists "owner can read"   on public.tracker_backups;
drop policy if exists "owner can insert" on public.tracker_backups;
drop policy if exists "owner can update" on public.tracker_backups;
drop policy if exists "owner can delete" on public.tracker_backups;

create policy "owner can read"   on public.tracker_backups for select to authenticated using (auth.uid() = user_id);
create policy "owner can insert" on public.tracker_backups for insert to authenticated with check (auth.uid() = user_id);
create policy "owner can update" on public.tracker_backups for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner can delete" on public.tracker_backups for delete to authenticated using (auth.uid() = user_id);

-- Visitors who are not signed in get no access at all.
revoke all on public.tracker_backups from anon;
grant select, insert, update, delete on public.tracker_backups to authenticated;

-- Check (should list 4 policies):
-- select policyname, cmd from pg_policies where tablename = 'tracker_backups';
