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

// Profile lives on the phone for now; both name and role are needed to post.
function profile() {
  try { return { name: (localStorage.getItem('hurley.name') || '').trim(), role: localStorage.getItem('hurley.role') || '' }; }
  catch (e) { return { name: '', role: '' }; }
}
const profileOk = () => { const p = profile(); return !!(p.name && p.role); };

// Copy the on-phone profile to the database (first save also alerts the admin: "New Hurley user").
// Best-effort and in the background: never holds the villager up.
async function syncProfile(force) {
  const p = profile();
  if (!sb || !p.name || !p.role) return;
  const stamp = p.name + '|' + p.role;
  try { if (!force && localStorage.getItem('hurley.profileSynced') === stamp) return; } catch (e) {}
  try {
    const me = await ensureUser();
    const { error } = await sb.from('profiles').upsert({ user_id: me.id, village: VILLAGE, name: p.name, role: p.role, updated_at: new Date().toISOString() });
    if (!error) try { localStorage.setItem('hurley.profileSynced', stamp); } catch (e) {}
  } catch (e) {}
}

const STATUS = { pending: 'Waiting for approval', suggested: 'Suggested', planned: 'Planned', building: 'Being built', done: 'Done', rejected: 'Not going ahead', live: 'Live', removed: 'Removed' };
const ago = t => {
  const s = (Date.now() - new Date(t)) / 1000;
  if (s < 3600) return Math.max(1, Math.round(s / 60)) + ' min ago';
  if (s < 86400) return Math.round(s / 3600) + ' h ago';
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};
