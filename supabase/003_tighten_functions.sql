-- Applied 2026-10-07 via the Supabase connector (security advisor tidy-up).
revoke execute on function public.limit_pending() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
