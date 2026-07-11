// Client side of the real-delivery pipeline. Talks to the /api/provider serverless
// proxy, which forwards to your funded SMM provider. When a provider is connected
// AND a live provider service-id is given, orders are dispatched for REAL and their
// status is polled from the provider. Otherwise the panel runs in labelled DEMO mode.

const CFG_KEY = 'growgram.liveprovider.v1'

export const getProviderConfig = () => {
  try { return JSON.parse(localStorage.getItem(CFG_KEY) || 'null') } catch { return null }
}
export const setProviderConfig = (cfg) => localStorage.setItem(CFG_KEY, JSON.stringify(cfg))
export const clearProviderConfig = () => localStorage.removeItem(CFG_KEY)

// live delivery is ON when the admin has tested + enabled a connection
export const isLiveEnabled = () => !!getProviderConfig()?.enabled

export async function liveRequest(action, params = {}) {
  const c = getProviderConfig() || {}
  const res = await fetch('/api/provider', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _url: c.url, _key: c.key, action, ...params }),
  })
  let j
  try { j = await res.json() } catch { throw new Error('Bad response from proxy') }
  if (!res.ok || j.error) throw new Error(j.error || `HTTP ${res.status}`)
  if (j.data && j.data.error) throw new Error(String(j.data.error))
  return j.data
}

// map assorted provider status strings to the panel's canonical set
export function normalizeStatus(s) {
  const v = String(s || '').toLowerCase()
  if (v.includes('complete')) return 'Completed'
  if (v.includes('partial')) return 'Partial'
  if (v.includes('cancel')) return 'Canceled'
  if (v.includes('pending') || v.includes('await') || v.includes('queue')) return 'Pending'
  return 'In progress' // processing / in progress / active
}
