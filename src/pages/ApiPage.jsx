import { useEffect, useMemo, useState } from 'react'
import Topbar from '../components/Topbar.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  allProviders, addCustomProvider, removeCustomProvider,
  providerRequest, getApiLog, subscribeApiLog, clearApiLog,
} from '../lib/providerApi'
import { timeAgo, uid } from '../lib/helpers'
import { SERVICES } from '../data/services'
import { getProviderConfig, setProviderConfig, clearProviderConfig, isLiveEnabled, liveRequest } from '../lib/liveProvider'

const RESELLER_KEY_STORAGE = 'growgram.reseller.key'

const genKey = () => 'gg_' + Array.from({ length: 3 }, () => Math.random().toString(36).slice(2, 12)).join('')

export default function ApiPage() {
  const toast = useToast()
  const [providers, setProviders] = useState(allProviders)
  const [log, setLog] = useState(getApiLog)
  const [balances, setBalances] = useState({})
  const [busy, setBusy] = useState({})
  const [synced, setSynced] = useState(null) // { provider, services }
  const [form, setForm] = useState({ name: '', url: '', apiKey: '' })
  const [resellerKey, setResellerKey] = useState(() => {
    const k = localStorage.getItem(RESELLER_KEY_STORAGE) || genKey()
    localStorage.setItem(RESELLER_KEY_STORAGE, k)
    return k
  })
  const [showKey, setShowKey] = useState(false)

  useEffect(() => subscribeApiLog(setLog), [])

  const refreshBalance = async (p) => {
    setBusy((b) => ({ ...b, [p.id]: true }))
    const res = await providerRequest(p.id, { action: 'balance' })
    setBalances((x) => ({ ...x, [p.id]: res }))
    setBusy((b) => ({ ...b, [p.id]: false }))
  }

  const syncServices = async (p) => {
    setBusy((b) => ({ ...b, [p.id]: true }))
    const res = await providerRequest(p.id, { action: 'services' })
    setSynced({ provider: p.name, services: res })
    setBusy((b) => ({ ...b, [p.id]: false }))
    toast(`Synced ${res.length} services from ${p.name} 🔄`, 'ok')
  }

  const connect = () => {
    if (!form.name.trim() || !form.url.trim()) return toast('Provider name and API URL are required', 'err')
    addCustomProvider(form)
    setProviders(allProviders())
    setForm({ name: '', url: '', apiKey: '' })
    toast('Provider connected — it now appears in your routing table ✅', 'ok')
  }

  const regenerate = () => {
    const k = genKey()
    localStorage.setItem(RESELLER_KEY_STORAGE, k)
    setResellerKey(k)
    toast('New API key generated — old key revoked 🔑', 'ok')
  }

  const copy = (text, what) => {
    navigator.clipboard?.writeText(text)
    toast(`${what} copied 📋`, 'ok')
  }

  const curlExample = useMemo(() => (
    `curl -X POST https://growgram-ebon.vercel.app/api/v2 \\
  -d key=${showKey ? resellerKey : 'gg_••••••••••••••••'} \\
  -d action=add \\
  -d service=1002 \\
  -d link=https://instagram.com/yourhandle \\
  -d quantity=1000`
  ), [resellerKey, showKey])

  return (
    <>
      <Topbar title="API & Providers" sub="The integration layer: connect a real provider for live delivery, plus the request console and your reseller API." />

      <LiveDelivery toast={toast} />

      {/* ---------- Reseller API ---------- */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card pad">
          <span className="badge grad" style={{ marginBottom: 12 }}>🔑 Your reseller API</span>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 0 }}>
            Resell GrowGram services from your own panel. Standard SMM API v2 — actions:
            <code style={{ color: 'var(--text)' }}> services · add · status · balance · refill · cancel</code>
          </p>
          <div className="field">
            <label>API key</label>
            <div className="row" style={{ gap: 8 }}>
              <input className="input" readOnly value={showKey ? resellerKey : '•'.repeat(34)} style={{ fontFamily: 'monospace', fontSize: 13 }} />
              <button className="btn sm" onClick={() => setShowKey(!showKey)}>{showKey ? '🙈' : '👁️'}</button>
              <button className="btn sm" onClick={() => copy(resellerKey, 'API key')}>Copy</button>
              <button className="btn sm ghost" onClick={regenerate}>↻</button>
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Endpoint</label>
            <div className="row" style={{ gap: 8 }}>
              <input className="input" readOnly value="https://growgram-ebon.vercel.app/api/v2" style={{ fontFamily: 'monospace', fontSize: 13 }} />
              <button className="btn sm" onClick={() => copy('https://growgram-ebon.vercel.app/api/v2', 'Endpoint')}>Copy</button>
            </div>
          </div>
        </div>

        <div className="card pad">
          <span className="badge grad" style={{ marginBottom: 12 }}>📖 Example request</span>
          <pre className="api-code">{curlExample}</pre>
          <p style={{ fontSize: 12, color: 'var(--muted-2)', margin: '10px 0 0' }}>
            Response: <code>{'{"order": 483920117}'}</code> — then poll <code>action=status</code> for
            <code> start_count</code>, <code>remains</code> and <code>status</code>. {SERVICES.length} services available via <code>action=services</code>.
          </p>
        </div>
      </div>

      {/* ---------- Providers table ---------- */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 16 }}>
        <div className="row between" style={{ padding: '16px 20px 0' }}>
          <h3 style={{ margin: 0, fontSize: 17 }}>Upstream providers</h3>
          <span className="badge"><span className="dot bg-Completed pulse" /> {providers.length} connected</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Provider</th><th>Balance</th><th>Ping</th>
              <th className="hide-mobile">Uptime</th><th className="hide-mobile">Services</th><th className="hide-mobile">Routes</th><th></th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{p.name} {p.custom && <span className="badge" style={{ fontSize: 10 }}>Custom</span>}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', fontFamily: 'monospace' }}>{p.url}</div>
                </td>
                <td style={{ fontWeight: 700 }} className="gradient-text">
                  ${balances[p.id]?.balance ?? p.balance.toFixed(2)}
                </td>
                <td><span style={{ color: p.ping < 100 ? 'var(--green)' : 'var(--amber)' }}>{p.ping}ms</span></td>
                <td className="hide-mobile">{p.uptime}</td>
                <td className="hide-mobile">{p.services ? p.services.toLocaleString() : '—'}</td>
                <td className="hide-mobile" style={{ fontSize: 12, color: 'var(--muted)' }}>{p.specialty}</td>
                <td>
                  <div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
                    <button className="btn sm" disabled={busy[p.id]} onClick={() => refreshBalance(p)}>
                      {busy[p.id] ? '…' : '💰'}
                    </button>
                    <button className="btn sm" disabled={busy[p.id]} onClick={() => syncServices(p)}>🔄</button>
                    {p.custom && (
                      <button className="btn sm ghost" onClick={() => { removeCustomProvider(p.id); setProviders(allProviders()) }}>✕</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {synced && (
        <div className="card pad" style={{ marginBottom: 16 }}>
          <div className="row between" style={{ marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>🔄 Service sync — {synced.provider}</h3>
            <button className="btn sm ghost" onClick={() => setSynced(null)}>Close</button>
          </div>
          <table className="table">
            <thead><tr><th>ID</th><th>Service</th><th>Rate/1k</th><th className="hide-mobile">Min–Max</th><th className="hide-mobile">Refill</th></tr></thead>
            <tbody>
              {synced.services.map((s) => (
                <tr key={s.service}>
                  <td style={{ fontFamily: 'monospace' }}>{s.service}</td>
                  <td>{s.name}</td>
                  <td>${s.rate}</td>
                  <td className="hide-mobile">{s.min}–{s.max.toLocaleString()}</td>
                  <td className="hide-mobile">{s.refill ? '✅' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
        {/* ---------- Connect custom provider ---------- */}
        <div className="card pad">
          <span className="badge grad" style={{ marginBottom: 12 }}>➕ Connect your own provider</span>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 0 }}>
            Any panel speaking SMM API v2 plugs straight into the routing table.
          </p>
          <div className="field">
            <label>Provider name</label>
            <input className="input" placeholder="e.g. MyPanel" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>API URL</label>
            <input className="input" placeholder="https://mypanel.com/api/v2" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          <div className="field">
            <label>API key</label>
            <input className="input" type="password" placeholder="Your provider API key" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} />
          </div>
          <button className="btn primary block" onClick={connect}>Connect provider</button>
          <p style={{ fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
            Stored locally in your browser only.
          </p>
        </div>

        {/* ---------- Live API console ---------- */}
        <div className="card pad">
          <div className="row between" style={{ marginBottom: 12 }}>
            <span className="badge grad">🖥️ Live API console</span>
            <button className="btn sm ghost" onClick={clearApiLog}>Clear</button>
          </div>
          {log.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>
              No requests yet. Place an order, refresh a balance, or sync services — every provider
              round-trip appears here in real time.
            </p>
          ) : (
            <div className="api-console">
              {log.map((e) => (
                <details key={e.id || uid()} className="api-entry">
                  <summary>
                    <span className={'api-dot ' + (e.ok ? 'ok' : 'err')} />
                    <span className="api-method">{e.method}</span>
                    <span className="api-action">{e.request?.action}</span>
                    <span className="api-provider">{e.provider}</span>
                    <span className="api-ms">{e.ms}ms · {timeAgo(e.at)}</span>
                  </summary>
                  <pre className="api-code">{`→ ${e.endpoint}\n${JSON.stringify(e.request, null, 2)}\n\n← 200 OK (${e.ms}ms)\n${JSON.stringify(e.response, null, 2)}`}</pre>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ---------- Live delivery: connect a real, funded SMM provider ---------- */
function LiveDelivery({ toast }) {
  const [cfg, setCfg] = useState(() => getProviderConfig() || { url: '', key: '', enabled: false })
  const [testing, setTesting] = useState(false)
  const [balance, setBalance] = useState(null)
  const [services, setServices] = useState(null)
  const [svcQ, setSvcQ] = useState('')
  const enabled = isLiveEnabled()

  const save = (patch) => { const next = { ...cfg, ...patch }; setCfg(next); setProviderConfig(next) }

  const testEnable = async () => {
    if (!cfg.url.trim() || !cfg.key.trim()) return toast('Enter your provider API URL and key', 'err')
    setTesting(true)
    setProviderConfig({ ...cfg, enabled: false }) // ensure proxy uses these creds for the test
    try {
      const bal = await liveRequest('balance')
      setBalance(bal)
      save({ enabled: true, balance: bal.balance, currency: bal.currency })
      toast(`Connected! Provider balance: ${bal.balance ?? '—'} ${bal.currency ?? ''} 🟢`, 'ok')
    } catch (e) {
      save({ enabled: false })
      toast(`Connection failed: ${e.message}`, 'err')
    } finally { setTesting(false) }
  }

  const disable = () => { clearProviderConfig(); setCfg({ url: '', key: '', enabled: false }); setBalance(null); setServices(null); toast('Live delivery disabled — back to demo mode', 'ok') }

  const loadServices = async () => {
    setTesting(true)
    try {
      const list = await liveRequest('services')
      setServices(Array.isArray(list) ? list : [])
      toast(`Loaded ${Array.isArray(list) ? list.length : 0} provider services 🔄`, 'ok')
    } catch (e) { toast(`Could not load services: ${e.message}`, 'err') } finally { setTesting(false) }
  }

  const filtered = (services || []).filter((s) =>
    !svcQ || String(s.service).includes(svcQ) || String(s.name || '').toLowerCase().includes(svcQ.toLowerCase())
  ).slice(0, 60)

  return (
    <div className="card pad" style={{ marginBottom: 16, borderColor: enabled ? 'rgba(34,209,140,.4)' : 'rgba(255,181,69,.4)' }}>
      <div className="row between wrap" style={{ gap: 10, marginBottom: 8 }}>
        <span className="badge grad">🚀 Live delivery {enabled ? '· ON' : '· OFF (demo mode)'}</span>
        <span className={'badge ' + (enabled ? 'ok-badge' : 'err-badge')}>{enabled ? '🟢 Real orders will be dispatched' : '🟡 Orders are simulated'}</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 0 }}>
        To deliver <b style={{ color: 'var(--text)' }}>real</b> followers/likes/views you must connect a <b style={{ color: 'var(--text)' }}>funded SMM provider</b> that
        speaks the standard SMM API v2. Sign up with a provider, add funds there, then paste its API URL + key below.
        For best security set <code>PROVIDER_API_URL</code> &amp; <code>PROVIDER_API_KEY</code> as Vercel env vars instead.
      </p>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Provider API URL</label>
          <input className="input" placeholder="https://yourprovider.com/api/v2" value={cfg.url} onChange={(e) => setCfg({ ...cfg, url: e.target.value.trim() })} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Provider API key</label>
          <input className="input" type="password" placeholder="your provider api key" value={cfg.key} onChange={(e) => setCfg({ ...cfg, key: e.target.value.trim() })} />
        </div>
      </div>
      <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
        <button className="btn primary" disabled={testing} onClick={testEnable}>{testing ? 'Testing…' : (enabled ? '↻ Re-test connection' : '🔌 Test & enable live delivery')}</button>
        {enabled && <button className="btn" disabled={testing} onClick={loadServices}>📋 Load provider services</button>}
        {enabled && <button className="btn ghost" onClick={disable}>Disable</button>}
        {balance && <span className="badge">Balance: {balance.balance} {balance.currency}</span>}
      </div>

      {services && (
        <div style={{ marginTop: 14 }}>
          <div className="row between" style={{ marginBottom: 8 }}>
            <b style={{ fontSize: 13 }}>Provider services — copy an ID into New Order</b>
            <input className="input" style={{ maxWidth: 220, padding: '7px 10px' }} placeholder="🔍 filter…" value={svcQ} onChange={(e) => setSvcQ(e.target.value)} />
          </div>
          <div style={{ maxHeight: 260, overflow: 'auto' }}>
            <table className="table">
              <thead><tr><th>ID</th><th>Service</th><th>Rate/1k</th><th className="hide-mobile">Min–Max</th></tr></thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.service}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      <button className="btn sm ghost" onClick={() => { navigator.clipboard?.writeText(String(s.service)); toast(`Service ID ${s.service} copied 📋`, 'ok') }}>{s.service} 📋</button>
                    </td>
                    <td style={{ fontSize: 12.5 }}>{s.name}</td>
                    <td>{s.rate}</td>
                    <td className="hide-mobile">{s.min}–{s.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
