// Vercel serverless proxy to a REAL SMM provider's HTTP API (the standard "SMM
// Panel API v2": form-encoded POST with `key` + `action`). This is what actually
// makes delivery real — the browser can't call a provider directly (CORS) and the
// secret API key must never live in frontend code.
//
// Configure ONE of:
//   1) Recommended — Vercel env vars: PROVIDER_API_URL and PROVIDER_API_KEY
//   2) Convenience — connect a provider in the panel (URL+key sent per request)
//
// Actions supported by SMM API v2: balance | services | add | status | refill | cancel

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const envUrl = process.env.PROVIDER_API_URL
  const envKey = process.env.PROVIDER_API_KEY

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, configuredByEnv: !!(envUrl && envKey) })
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  body = body || {}

  const url = body._url || envUrl
  const key = body._key || envKey
  if (!url || !key) {
    return res.status(400).json({ error: 'Provider not configured — set PROVIDER_API_URL & PROVIDER_API_KEY (or connect a provider in the panel).' })
  }

  const { _url, _key, ...params } = body
  const form = new URLSearchParams()
  form.set('key', key)
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') form.set(k, String(v))
  }

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    const text = await r.text()
    let data
    try { data = JSON.parse(text) } catch { data = { raw: text.slice(0, 500) } }
    return res.status(200).json({ ok: r.ok, status: r.status, data })
  } catch (e) {
    return res.status(502).json({ error: 'Provider request failed', detail: String(e && e.message || e) })
  }
}
