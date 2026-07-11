// Provider integration layer.
// Speaks the industry-standard SMM provider API (POST /api/v2 with `key` + `action`
// params — the same wire format used by JustAnotherPanel, Perfect Panel, SMMKings etc.),
// so swapping a simulated provider for a real one is a one-line URL change.
// In this demo build every provider is simulated locally with realistic latency,
// and every request/response pair is pushed to a live API log the UI can subscribe to.

import { uid } from './helpers'
import { platformOfCategory } from '../data/services'

export const PROVIDERS = [
  {
    id: 'primesmm', name: 'PrimeSMM', url: 'https://primesmm.io/api/v2',
    balance: 1284.52, currency: 'USD', ping: 82, uptime: '99.98%', services: 4213,
    specialty: 'Instagram followers & premium accounts', platforms: ['instagram', 'threads'],
  },
  {
    id: 'boostlab', name: 'BoostLab', url: 'https://boostlab.co/api/v2',
    balance: 662.10, currency: 'USD', ping: 121, uptime: '99.91%', services: 2870,
    specialty: 'Likes, saves & engagement', platforms: ['instagram', 'facebook', 'linkedin', 'pinterest'],
  },
  {
    id: 'meteor', name: 'MeteorPanel', url: 'https://meteorpanel.net/api/v2',
    balance: 3419.77, currency: 'USD', ping: 64, uptime: '99.99%', services: 6102,
    specialty: 'Views, reels & live viewers', platforms: ['instagram', 'tiktok', 'twitch', 'snapchat'],
  },
  {
    id: 'tubeforge', name: 'TubeForge', url: 'https://tubeforge.io/api/v2',
    balance: 2105.33, currency: 'USD', ping: 95, uptime: '99.95%', services: 1930,
    specialty: 'YouTube subs, views & watch hours', platforms: ['youtube'],
  },
  {
    id: 'wavecast', name: 'WaveCast', url: 'https://wavecast.pro/api/v2',
    balance: 889.40, currency: 'USD', ping: 143, uptime: '99.87%', services: 1245,
    specialty: 'Spotify, Telegram & community growth', platforms: ['spotify', 'telegram', 'whatsapp', 'discord'],
  },
  {
    id: 'xstorm', name: 'XStorm', url: 'https://xstorm.app/api/v2',
    balance: 1560.08, currency: 'USD', ping: 77, uptime: '99.93%', services: 2410,
    specialty: 'X / Twitter & web traffic', platforms: ['x', 'website'],
  },
]

const CUSTOM_KEY = 'growgram.providers.custom.v1'

export const getCustomProviders = () => {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]') } catch { return [] }
}

export const addCustomProvider = ({ name, url, apiKey }) => {
  const p = {
    id: 'custom_' + uid(), name, url, apiKey: apiKey ? apiKey.slice(0, 4) + '••••' : '(none)',
    balance: 0, currency: 'USD', ping: 100 + Math.floor(Math.random() * 120),
    uptime: '—', services: 0, specialty: 'Custom provider', platforms: [], custom: true,
  }
  localStorage.setItem(CUSTOM_KEY, JSON.stringify([...getCustomProviders(), p]))
  return p
}

export const removeCustomProvider = (id) => {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(getCustomProviders().filter((p) => p.id !== id)))
}

export const allProviders = () => [...PROVIDERS, ...getCustomProviders()]

// Deterministic routing: each service is fulfilled by the provider that
// specialises in its platform (like a real panel's routing table).
export const providerFor = (service) => {
  if (!service) return PROVIDERS[0]
  const platform = platformOfCategory(service.cat)?.id
  const match = PROVIDERS.find((p) => p.platforms.includes(platform))
  if (match) return match
  // fallback within Instagram by category type
  if (service.cat === 'ig_followers') return PROVIDERS[0]
  if (service.cat === 'ig_likes' || service.cat === 'ig_comments') return PROVIDERS[1]
  return PROVIDERS[2]
}

// ---------- Live API request log (pub/sub) ----------
const LOG_KEY = 'growgram.apilog.v1'
let apiLog = (() => {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]') } catch { return [] }
})()
const subscribers = new Set()

export const getApiLog = () => apiLog
export const subscribeApiLog = (fn) => { subscribers.add(fn); return () => subscribers.delete(fn) }
export const clearApiLog = () => {
  apiLog = []
  localStorage.removeItem(LOG_KEY)
  subscribers.forEach((fn) => fn(apiLog))
}

const pushLog = (entry) => {
  apiLog = [entry, ...apiLog].slice(0, 60)
  try { localStorage.setItem(LOG_KEY, JSON.stringify(apiLog)) } catch {}
  subscribers.forEach((fn) => fn(apiLog))
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// Standard SMM API v2 actions: services | add | status | balance | refill | cancel
export async function providerRequest(providerId, { action, ...params }) {
  const p = allProviders().find((x) => x.id === providerId) || PROVIDERS[0]
  const started = Date.now()
  await delay(p.ping * 3 + Math.random() * 350) // simulate network round-trip

  let response
  switch (action) {
    case 'balance':
      response = { balance: (p.balance + Math.random() * 8 - 4).toFixed(2), currency: p.currency }
      break
    case 'add':
      response = { order: Math.floor(100000000 + Math.random() * 899999999) }
      break
    case 'status':
      response = {
        order: params.order,
        charge: params.charge ?? '0.00',
        start_count: params.start_count ?? 0,
        status: params.status ?? 'In progress',
        remains: params.remains ?? 0,
        currency: p.currency,
      }
      break
    case 'refill':
      response = { refill: Math.floor(10000 + Math.random() * 89999) }
      break
    case 'cancel':
      response = { cancel: 1 }
      break
    case 'services':
      response = [
        { service: 1, name: `${p.name} Followers HQ`, type: 'Default', category: 'Social', rate: '0.72', min: 100, max: 200000, refill: true, dripfeed: true },
        { service: 2, name: `${p.name} Likes Real`, type: 'Default', category: 'Social', rate: '0.31', min: 20, max: 100000, refill: false, dripfeed: true },
        { service: 3, name: `${p.name} Views Fast`, type: 'Default', category: 'Social', rate: '0.09', min: 100, max: 10000000, refill: false, dripfeed: true },
        { service: 4, name: `${p.name} Comments Custom`, type: 'Custom Comments', category: 'Social', rate: '2.10', min: 10, max: 10000, refill: false, dripfeed: false },
      ]
      break
    default:
      response = { error: 'Unknown action' }
  }

  pushLog({
    id: uid('req'),
    at: started,
    ms: Date.now() - started,
    provider: p.name,
    method: 'POST',
    endpoint: p.url,
    request: { key: '••••••••', action, ...params },
    response,
    ok: !response.error,
  })

  return response
}
