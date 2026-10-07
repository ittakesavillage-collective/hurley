// Supabase connection. The publishable key is designed to be public; Row Level Security
// (supabase/schema.sql) is what protects the data.
const VILLAGE = 'hurley';
const SB_URL = 'https://lhwrktxmyeowkfncicli.supabase.co';
const SB_KEY = 'sb_publishable_hSxTn1OVsYnyHsum1zW0EQ_ySEvn3z1';
const sb = window.supabase ? window.supabase.createClient(SB_URL, SB_KEY, { auth: { storageKey: 'hurley.auth' } }) : null;

// Every phone gets its own anonymous identity on first use (no sign-up needed).
async function ensureUser() {
  if (!sb) throw new Error('offline');
  const { data: { session } } = await sb.auth.getSession();
  if (session) return session.user;
  const { data, error } = await sb.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
}

async function isAdmin() {
  if (!sb) return false;
  const { data: { session } } = await sb.auth.getSession();
  if (!session || session.user.is_anonymous) return false;
  const { data } = await sb.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle();
  return !!data;
}

const STATUS = { pending: 'Waiting for approval', suggested: 'Suggested', planned: 'Planned', building: 'Being built', done: 'Done', rejected: 'Not going ahead', live: 'Live', removed: 'Removed' };
const ago = t => {
  const s = (Date.now() - new Date(t)) / 1000;
  if (s < 3600) return Math.max(1, Math.round(s / 60)) + ' min ago';
  if (s < 86400) return Math.round(s / 3600) + ' h ago';
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};
