-- Applied 2026-10-07 via the Supabase connector.
-- Posting needs a profile: name + who you are (role list is per village, kept in the app).
alter table public.requests add column if not exists name text check (char_length(name) <= 40);
alter table public.requests add column if not exists role text check (char_length(role) <= 40);
alter table public.posts    add column if not exists role text check (char_length(role) <= 40);
-- NOT VALID: older rows are left alone, every new row must have both.
alter table public.requests drop constraint if exists requests_need_profile;
alter table public.requests add constraint requests_need_profile
  check (char_length(btrim(name)) >= 1 and char_length(btrim(role)) >= 1) not valid;
alter table public.posts drop constraint if exists posts_need_profile;
alter table public.posts add constraint posts_need_profile
  check (char_length(btrim(name)) >= 1 and char_length(btrim(role)) >= 1) not valid;
drop view if exists public.request_list;
create view public.request_list with (security_invoker = true) as
  select r.*,
         coalesce(sum(case when v.value = 1 then 1 end), 0)::int  as ups,
         coalesce(sum(case when v.value = -1 then 1 end), 0)::int as downs
  from public.requests r left join public.votes v on v.request_id = r.id
  group by r.id;
grant select on public.request_list to authenticated;
