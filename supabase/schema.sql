-- It Takes a Village: shared Supabase schema for the village apps (Hurley first; Willian reuses it).
-- Paste the whole file into Supabase > SQL Editor > New query > Run. Safe to re-run.
-- Security model: every visitor gets an anonymous sign-in (one identity per phone). Row Level Security
-- decides what each identity can see/do. Only users listed in public.admins can approve or edit.

-- ---------- Admins ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins see admins" on public.admins;
create policy "admins see admins" on public.admins for select using (user_id = auth.uid() or public.is_admin());

-- ---------- "Your App, your way" requests ----------
-- status: pending (waiting for approval, hidden) > suggested > planned > building > done; rejected = hidden
create table if not exists public.requests (
  id          bigint generated always as identity primary key,
  village     text not null check (village in ('hurley','willian')),
  title       text not null check (char_length(title) between 3 and 120),
  body        text check (char_length(body) <= 1000),
  status      text not null default 'pending' check (status in ('pending','suggested','planned','building','done','rejected')),
  reply       text check (char_length(reply) <= 1000),
  created_by  uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);
alter table public.requests enable row level security;

drop policy if exists "read approved, own, or admin" on public.requests;
create policy "read approved, own, or admin" on public.requests for select
  using (status in ('suggested','planned','building','done') or created_by = auth.uid() or public.is_admin());
drop policy if exists "anyone signed in can suggest" on public.requests;
create policy "anyone signed in can suggest" on public.requests for insert
  with check (created_by = auth.uid() and (status = 'pending' or public.is_admin()));
drop policy if exists "admin edits" on public.requests;
create policy "admin edits" on public.requests for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin deletes" on public.requests;
create policy "admin deletes" on public.requests for delete using (public.is_admin());

-- ---------- Votes (one per phone per request; +1 thumbs up, -1 thumbs down) ----------
create table if not exists public.votes (
  request_id  bigint not null references public.requests(id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  value       smallint not null check (value in (-1, 1)),
  created_at  timestamptz not null default now(),
  primary key (request_id, user_id)
);
alter table public.votes enable row level security;

drop policy if exists "votes are public" on public.votes;
create policy "votes are public" on public.votes for select using (true);
drop policy if exists "vote as yourself" on public.votes;
create policy "vote as yourself" on public.votes for insert with check (user_id = auth.uid());
drop policy if exists "change your vote" on public.votes;
create policy "change your vote" on public.votes for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "remove your vote" on public.votes;
create policy "remove your vote" on public.votes for delete using (user_id = auth.uid());

-- Requests with vote counts (respects the policies above)
create or replace view public.request_list with (security_invoker = true) as
  select r.*,
         coalesce(sum(case when v.value = 1 then 1 end), 0)::int  as ups,
         coalesce(sum(case when v.value = -1 then 1 end), 0)::int as downs
  from public.requests r left join public.votes v on v.request_id = r.id
  group by r.id;

-- ---------- Message board ----------
-- status: pending (waiting for approval, hidden) > live; removed = hidden
create table if not exists public.posts (
  id          bigint generated always as identity primary key,
  village     text not null check (village in ('hurley','willian')),
  name        text not null check (char_length(name) between 1 and 40),
  title       text not null check (char_length(title) between 3 and 120),
  body        text not null check (char_length(body) between 1 and 1000),
  status      text not null default 'pending' check (status in ('pending','live','removed')),
  created_by  uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);
alter table public.posts enable row level security;

drop policy if exists "read live, own, or admin" on public.posts;
create policy "read live, own, or admin" on public.posts for select
  using (status = 'live' or created_by = auth.uid() or public.is_admin());
drop policy if exists "anyone signed in can post" on public.posts;
create policy "anyone signed in can post" on public.posts for insert
  with check (created_by = auth.uid() and (status = 'pending' or public.is_admin()));
drop policy if exists "admin edits posts" on public.posts;
create policy "admin edits posts" on public.posts for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin deletes posts" on public.posts;
create policy "admin deletes posts" on public.posts for delete using (public.is_admin());

-- ---------- Anti-spam: max 5 items waiting for approval per phone ----------
create or replace function public.limit_pending() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin() then return new; end if;
  if (select count(*) from public.requests where created_by = auth.uid() and status = 'pending')
   + (select count(*) from public.posts    where created_by = auth.uid() and status = 'pending') >= 5 then
    raise exception 'Too many items waiting for approval. Please wait for them to be checked.';
  end if;
  return new;
end $$;
drop trigger if exists requests_limit on public.requests;
create trigger requests_limit before insert on public.requests for each row execute function public.limit_pending();
drop trigger if exists posts_limit on public.posts;
create trigger posts_limit before insert on public.posts for each row execute function public.limit_pending();

-- ---------- API access (RLS above still applies to every row) ----------
grant usage on schema public to anon, authenticated;
grant select on public.admins to authenticated;
grant select, insert, update, delete on public.requests, public.votes, public.posts to authenticated;
grant select on public.request_list to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
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
