// send-push: admin-only. Sends a web push to everyone in a village (optionally one role) or to one user.
// Body: { village, title, body, url?, role?, user_id? }
// Secret needed (Supabase > Edge Functions > Secrets): VAPID_PRIVATE_KEY
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const VAPID_PUBLIC = "BKhN8fb8wvs-Av4rivo4tvI5cuI7eB_s6bsmNu-699yA2pCL_6v4aGGFek7UddSqDaYA0Q1Khcwde0ab8dbUxJs";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, "Content-Type": "application/json" } });

function serviceKey(): string {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  try { return JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}").default ?? ""; } catch { return ""; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  const priv = Deno.env.get("VAPID_PRIVATE_KEY");
  if (!priv) return json({ error: "VAPID_PRIVATE_KEY secret is not set" }, 500);

  // Who is calling? Must be signed in and listed in public.admins.
  const url = Deno.env.get("SUPABASE_URL")!;
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const admin = createClient(url, serviceKey(), { auth: { persistSession: false } });
  const { data: u, error: uerr } = await admin.auth.getUser(token);
  if (uerr || !u?.user) return json({ error: "Not signed in" }, 401);
  const { data: isAdm } = await admin.from("admins").select("user_id").eq("user_id", u.user.id).maybeSingle();
  if (!isAdm) return json({ error: "Admins only" }, 403);

  const b = await req.json().catch(() => ({}));
  const title = String(b.title ?? "").slice(0, 80).trim();
  const body = String(b.body ?? "").slice(0, 240).trim();
  if (!b.village || !title) return json({ error: "village and title are required" }, 400);

  let q = admin.from("push_subs").select("endpoint,p256dh,auth").eq("village", b.village);
  if (b.role) q = q.eq("role", b.role);
  if (b.user_id) q = q.eq("user_id", b.user_id);
  const { data: subs, error } = await q;
  if (error) return json({ error: error.message }, 500);

  webpush.setVapidDetails("mailto:broadfords@gmail.com", VAPID_PUBLIC, priv);
  const payload = JSON.stringify({ title, body, url: String(b.url ?? "./") });
  let sent = 0, gone = 0, failed = 0;
  await Promise.all((subs ?? []).map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 86400 });
      sent++;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) { gone++; await admin.from("push_subs").delete().eq("endpoint", s.endpoint); }
      else failed++;
    }
  }));
  return json({ sent, gone, failed, total: subs?.length ?? 0 });
});
