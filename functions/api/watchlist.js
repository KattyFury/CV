export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const action = searchParams.get('action') || 'list';
  const q      = searchParams.get('q') || '';
  const key    = context.env.SURF_API;
  const kv     = context.env.WATCHLIST;

  // Load saved projects + participation from KV
  if (action === 'kv-load') {
    if (!kv) return Response.json({ data: [], user: {} });
    const raw  = await kv.get('projects');
    const rawU = await kv.get('participation');
    return Response.json({
      data: raw  ? JSON.parse(raw)  : [],
      user: rawU ? JSON.parse(rawU) : {},
    });
  }

  if (!key) return Response.json({ error: 'SURF_API not configured' }, { status: 500 });

  const BASE    = 'https://api.asksurf.ai/gateway/v1';
  const headers = { Authorization: `Bearer ${key}` };

  if (action === 'list') {
    const res  = await fetch(`${BASE}/search/airdrop?sort_by=total_raise&order=desc&limit=100&phase=active`, { headers });
    const body = await res.json();
    return Response.json(body, { headers: { 'Cache-Control': 'no-store' } });
  }

  if (action === 'detail' && q) {
    const res  = await fetch(`${BASE}/project/detail?q=${encodeURIComponent(q)}`, { headers });
    const body = await res.json();
    return Response.json(body, { headers: { 'Cache-Control': 'no-store' } });
  }

  return Response.json({ error: 'invalid action' }, { status: 400 });
}

export async function onRequestPost(context) {
  const kv = context.env.WATCHLIST;
  if (!kv) return Response.json({ error: 'KV not configured' }, { status: 500 });

  const { action, data, user } = await context.request.json();

  // Save projects và/hoặc participation lên KV
  if (action === 'kv-save') {
    if (data !== undefined) await kv.put('projects', JSON.stringify(data));
    if (user !== undefined) await kv.put('participation', JSON.stringify(user));
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'invalid action' }, { status: 400 });
}
