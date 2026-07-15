// GrowGram Native Provider — a self-hosted SMM API v2 endpoint.
// This is the panel acting as its OWN upstream provider: it speaks the exact
// wire format of JustAnotherPanel / Perfect Panel (form-encoded POST with
// `key` + `action`), so the panel's live-delivery pipeline (and any reseller)
// can point at https://<this-deployment>/api/v2 and get a fully working
// order lifecycle: add → status (progressing) → Completed.
//
// Fulfilment is a deterministic engine, not real engagement: the order id
// encodes created-at + service + quantity, so `status` computes delivery
// progress from elapsed time with no database. Real followers/likes require
// a third-party provider that controls real accounts — this endpoint makes
// the API pipeline real, not the engagement.
//
// Actions: services | add | status (order or orders=1,2,3) | balance | refill | cancel

import { SERVICES, serviceById } from '../src/data/services.js'

const EPOCH = 1767225600 // 2026-01-01T00:00:00Z, keeps encoded timestamps short
const CURRENCY = 'INR'

// order id: '1' + seconds-since-epoch(8) + serviceId(5) + quantity(8) — decimal
// string so it survives JSON round-trips without float precision loss
const encodeOrder = (sid, qty) => {
  const ts = Math.floor(Date.now() / 1000) - EPOCH
  return '1' + String(ts).padStart(8, '0') + String(sid).padStart(5, '0') + String(qty).padStart(8, '0')
}
const decodeOrder = (id) => {
  const m = /^1(\d{8})(\d{5})(\d{8})$/.exec(String(id || '').trim())
  if (!m) return null
  return { ts: Number(m[1]) + EPOCH, sid: Number(m[2]), qty: Number(m[3]) }
}

const hash = (s) => {
  let h = 0
  for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

// '50K/day' | '1M/day' | 'Auto' → units per day
const perDay = (speed) => {
  const m = /([\d.]+)\s*([KM]?)/i.exec(String(speed || ''))
  if (!m) return 20000
  return Number(m[1]) * (m[2]?.toUpperCase() === 'M' ? 1e6 : m[2]?.toUpperCase() === 'K' ? 1e3 : 1)
}

// Demo-compressed delivery: 100× the catalogue speed, clamped to 1.5–60 min
const durationSec = (svc, qty) => {
  const rate = (perDay(svc?.speed) * 100) / 86400 // units per second
  return Math.min(3600, Math.max(90, qty / Math.max(rate, 1)))
}

const statusOf = (id) => {
  const o = decodeOrder(id)
  if (!o) return { error: 'Incorrect order ID' }
  const svc = serviceById(o.sid)
  const elapsed = Math.floor(Date.now() / 1000) - o.ts
  const dur = durationSec(svc, o.qty)
  const progress = Math.max(0, Math.min(1, (elapsed - 12) / dur)) // ~12s pending window
  const delivered = Math.floor(o.qty * progress)
  return {
    order: String(id),
    charge: svc ? ((o.qty / 1000) * svc.price).toFixed(2) : '0.00',
    start_count: 500 + (hash(id) % 49500),
    status: elapsed < 12 ? 'Pending' : delivered >= o.qty ? 'Completed' : 'In progress',
    remains: Math.max(0, o.qty - delivered),
    currency: CURRENCY,
  }
}

const toV2Service = (s) => ({
  service: s.id, name: s.name, type: s.tag === 'Subscription' ? 'Subscription' : 'Default',
  category: s.cat, rate: s.price.toFixed(2), min: s.min, max: s.max,
  refill: s.refill !== 'No', dripfeed: !!s.dripfeed, currency: CURRENCY,
})

const readBody = (req) => {
  let b = req.body
  if (typeof b === 'string') {
    try { b = JSON.parse(b) } catch { b = Object.fromEntries(new URLSearchParams(b)) }
  }
  return { ...(req.query || {}), ...(b || {}) }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const p = readBody(req)
  if (req.method === 'GET' && !p.action) {
    return res.status(200).json({ ok: true, provider: 'GrowGram Native', api: 'SMM v2', services: SERVICES.length })
  }
  if (!p.key || String(p.key).length < 8) return res.status(200).json({ error: 'Invalid API key' })

  switch (p.action) {
    case 'balance':
      // self-hosted engine has no upstream spend — report a healthy float
      return res.status(200).json({ balance: '25000.00', currency: CURRENCY })

    case 'services':
      return res.status(200).json(SERVICES.map(toV2Service))

    case 'add': {
      const svc = serviceById(p.service)
      if (!svc) return res.status(200).json({ error: 'Incorrect service ID' })
      const qty = Number(p.quantity)
      if (!p.link || !String(p.link).trim()) return res.status(200).json({ error: 'Link is required' })
      if (!Number.isFinite(qty) || qty < svc.min) return res.status(200).json({ error: `Quantity less than minimal ${svc.min}` })
      if (qty > svc.max) return res.status(200).json({ error: `Quantity more than maximal ${svc.max}` })
      return res.status(200).json({ order: encodeOrder(svc.id, Math.floor(qty)) })
    }

    case 'status': {
      if (p.orders) {
        const out = {}
        for (const id of String(p.orders).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 100)) out[id] = statusOf(id)
        return res.status(200).json(out)
      }
      // some panels send the order id as `service` on status calls — accept both
      return res.status(200).json(statusOf(p.order || p.service))
    }

    case 'refill':
      if (!decodeOrder(p.order)) return res.status(200).json({ error: 'Incorrect order ID' })
      return res.status(200).json({ refill: 10000 + (hash(p.order) % 89999) })

    case 'cancel':
      if (!decodeOrder(p.order)) return res.status(200).json({ error: 'Incorrect order ID' })
      return res.status(200).json({ cancel: 1 })

    default:
      return res.status(200).json({ error: 'Incorrect request' })
  }
}
