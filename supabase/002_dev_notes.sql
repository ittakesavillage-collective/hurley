-- Notes to Claude: Michael's private change/coding requests, typed on the admin (!) page.
-- Admin-only: villagers can never see or write these. Safe to re-run.
create table if not exists public.dev_notes (
  id          bigint generated always as identity primary key,
  village     text not null check (village in ('hurley','willian')),
  body        text not null check (char_length(body) between 1 and 4000),
  status      text not null default 'new' check (status in ('new','doing','done','parked')),
  reply       text check (char_length(reply) <= 4000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.dev_notes enable row level security;
drop policy if exists "admin only" on public.dev_notes;
create policy "admin only" on public.dev_notes for all using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.dev_notes to authenticated;
