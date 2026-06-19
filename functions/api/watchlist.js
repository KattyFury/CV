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
    const ov   = body && body.data && body.data.overview;

    // Surf tìm thấy → trả luôn (Sync chỉ dùng nhánh này)
    if (ov && ov.name) {
      return Response.json({ ...body, source: 'surf' }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Surf trống. Chỉ luồng Add (llm=1) mới fallback sang Claude → OpenAI
    if (searchParams.get('llm') === '1') {
      let info = await askClaude(context.env, q);
      let src  = 'claude';
      if (!info) { info = await askOpenAI(context.env, q); src = 'openai'; }
      if (info) {
        return Response.json(llmToSurf(info, src), { headers: { 'Cache-Control': 'no-store' } });
      }
    }

    return Response.json({ data: null, source: 'surf' }, { headers: { 'Cache-Control': 'no-store' } });
  }

  return Response.json({ error: 'invalid action' }, { status: 400 });
}

// ── LLM fallback: hỏi project info khi Surf không có ──────────────
const LLM_PROMPT = (name) =>
  `You are a crypto research assistant. For the crypto project named "${name}", ` +
  `return ONLY a JSON object (no prose, no markdown) with this exact shape:\n` +
  `{"found": true|false, "name": "official project name", "investors": ["VC or angel names"], ` +
  `"tge_status": "pre"|"post", "x_handle": "twitter handle without @", "category": "short category", ` +
  `"total_raise": number_in_USD_or_null}\n` +
  `Rules: "found" is false if you do not recognize the project. ` +
  `"tge_status" is "post" ONLY if the project has already launched a tradable token; otherwise "pre". ` +
  `List the most notable investors you know (a16z, Paradigm, etc.).`;

function parseLLMJson(text) {
  if (!text) return null;
  const a = text.indexOf('{');
  const z = text.lastIndexOf('}');
  if (a < 0 || z < 0 || z < a) return null;
  try {
    const o = JSON.parse(text.slice(a, z + 1));
    return o && o.found ? o : null;
  } catch { return null; }
}

function llmToSurf(o, source) {
  const investors = Array.isArray(o.investors) ? o.investors.filter(Boolean) : [];
  return {
    source,
    data: {
      overview: {
        name:       o.name || '',
        tags:       o.category ? [o.category] : [],
        x_handle:   o.x_handle || '',
        logo_url:   o.x_handle ? `https://unavatar.io/twitter/${o.x_handle}` : '',
        tge_status: o.tge_status === 'post' ? 'post' : 'pre',
      },
      funding: {
        rounds:      investors.length ? [{ investors: investors.map((n) => ({ name: n })) }] : [],
        total_raise: typeof o.total_raise === 'number' ? o.total_raise : 0,
      },
    },
  };
}

async function askClaude(env, name) {
  if (!env.CLAUDE) return null;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.CLAUDE,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 1024,
        messages: [{ role: 'user', content: LLM_PROMPT(name) }],
      }),
    });
    const b = await r.json();
    const text = (b.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
    return parseLLMJson(text);
  } catch { return null; }
}

async function askOpenAI(env, name) {
  if (!env.OPENAI) return null;
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.OPENAI}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: LLM_PROMPT(name) }],
        response_format: { type: 'json_object' },
      }),
    });
    const b = await r.json();
    const text = b.choices && b.choices[0] && b.choices[0].message ? b.choices[0].message.content : '';
    return parseLLMJson(text);
  } catch { return null; }
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
