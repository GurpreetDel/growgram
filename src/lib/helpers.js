export const money = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const compact = (n) => {
  const x = Number(n || 0)
  if (x >= 1_000_000) return (x / 1_000_000).toFixed(x % 1_000_000 === 0 ? 0 : 1) + 'M'
  if (x >= 1_000) return (x / 1_000).toFixed(x % 1_000 === 0 ? 0 : 1) + 'K'
  return String(x)
}

export const uid = (prefix = '') =>
  prefix + Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 6)

// price = rate-per-1000 * qty / 1000, with an optional drip-feed premium
export const priceFor = (service, qty, dripRuns = 1) => {
  if (!service) return 0
  const base = (service.price * qty) / 1000
  const premium = dripRuns > 1 ? base * 0.05 : 0 // small scheduling premium
  return Math.round((base * dripRuns + premium) * 100) / 100
}

export const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return s + 's ago'
  const m = Math.floor(s / 60)
  if (m < 60) return m + 'm ago'
  const h = Math.floor(m / 60)
  if (h < 24) return h + 'h ago'
  return Math.floor(h / 24) + 'd ago'
}

export const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

// crude but useful: pull the @handle or shortcode out of a pasted IG url
export const parseIgTarget = (link = '') => {
  const l = link.trim()
  const post = l.match(/instagram\.com\/(?:p|reel|reels)\/([\w-]+)/i)
  if (post) return { type: 'post', value: post[1] }
  const user = l.match(/instagram\.com\/([\w.]+)/i)
  if (user) return { type: 'profile', value: '@' + user[1] }
  if (l.startsWith('@')) return { type: 'profile', value: l }
  if (l) return { type: 'unknown', value: l }
  return null
}
