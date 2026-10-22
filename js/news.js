// Village news: newest first. Admins see a "Post news" form here, with an option to notify everyone.
function renderNews(main, hero, esc) {
  const $ = id => document.getElementById(id);
  main.innerHTML = hero('What’s happening in Hurley.')
    + '<form class="card" id="nform" hidden><b>Post news</b>'
    +   '<label class="f">Headline<input type="text" id="ntitle" maxlength="120" minlength="2" required></label>'
    +   '<label class="f">Story<textarea id="nbody" maxlength="2000" rows="4"></textarea></label>'
    +   '<label class="f">Link (optional)<input type="url" id="nlink" maxlength="300" placeholder="https://"></label>'
    +   '<label class="tick"><input type="checkbox" id="npush" checked> Send a notification to everyone</label>'
    +   '<div class="btns"><button class="btn terra" id="nsend">Post</button></div></form>'
    + '<p class="note" id="msg" hidden></p>'
    + '<div id="list"><p class="note">Loading…</p></div>'
    + '<a class="linkcard ghostcard" target="_blank" rel="noopener" href="https://www.henleystandard.co.uk/news/hurley/">'
    +   '<span><b>More Hurley news</b><small>The Henley Standard’s Hurley pages</small></span><span class="chev">›</span></a>';
  const say = t => { $('msg').textContent = t; $('msg').hidden = !t; };
  let admin = false;

  async function load() {
    try {
      await ensureUser();
      const { data, error } = await sb.from('news').select('*').eq('village', VILLAGE).order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      $('list').innerHTML = data.length ? data.map(n => {
        const link = n.link && /^https?:\/\//i.test(n.link) ? n.link : '';
        return '<section class="card news" data-id="' + n.id + '"><small class="muted">'
          + new Date(n.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' }) + '</small>'
          + '<b class="tn">' + esc(n.title) + '</b>'
          + (n.body ? '<p style="white-space:pre-wrap">' + esc(n.body) + '</p>' : '')
          + (link ? '<a target="_blank" rel="noopener" href="' + esc(link) + '">Read more</a>' : '')
          + (admin ? '<div class="btns"><button class="btn danger" data-del="' + n.id + '">Delete</button></div>' : '')
          + '</section>';
      }).join('') : '<section class="card"><p class="note">No news yet.</p></section>';
    } catch (e) { $('list').innerHTML = '<p class="note">Couldn’t load the news. Check your signal and try again.</p>'; }
  }

  $('list').onclick = async e => {
    const b = e.target.closest('[data-del]'); if (!b || !confirm('Delete this news item?')) return;
    const { error } = await sb.from('news').delete().eq('id', +b.dataset.del);
    if (error) return say('Didn’t delete: ' + error.message);
    load();
  };

  $('nform').onsubmit = async e => {
    e.preventDefault(); $('nsend').disabled = true; say('');
    const title = $('ntitle').value.trim(), body = $('nbody').value.trim(), link = $('nlink').value.trim();
    const { data, error } = await sb.from('news').insert({ village: VILLAGE, title, body: body || null, link: link || null }).select('id').single();
    if (error) { say('Didn’t post: ' + error.message); $('nsend').disabled = false; return; }
    if ($('npush').checked) {
      try { await sb.functions.invoke('send-push', { body: { village: VILLAGE, title: 'Hurley news: ' + title, body: body.slice(0, 160), url: 'place.html?p=news' } }); }
      catch (err) {}
    }
    $('nform').reset(); $('npush').checked = true; $('nsend').disabled = false;
    say('Posted.'); load();
  };

  (async () => { admin = await isAdmin(); if (admin) $('nform').hidden = false; load(); })();
}
