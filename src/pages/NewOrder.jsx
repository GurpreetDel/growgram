import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Topbar from '../components/Topbar.jsx'
import {
  PLATFORMS, CATEGORIES, SERVICES, serviceById, categoriesForPlatform,
  categoryById, platformOfCategory, dropTypeOf,
} from '../data/services'
import { COUNTRIES, countryByCode } from '../data/countries'
import { isLiveEnabled, getProviderConfig } from '../lib/liveProvider'
import { money, compact, priceFor, clamp, parseIgTarget } from '../lib/helpers'

export default function NewOrder() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { placeOrder, balance } = useStore()
  const toast = useToast()

  // resolve any deep link (?service= or ?cat=)
  const deepSvc = params.get('service') ? serviceById(params.get('service')) : null
  const initialCat = deepSvc?.cat || params.get('cat') || 'ig_followers'
  const initialPlatform = platformOfCategory(initialCat)?.id || 'instagram'

  const [platform, setPlatform] = useState(initialPlatform)
  const [cat, setCat] = useState(initialCat)
  const catServices = useMemo(() => SERVICES.filter((s) => s.cat === cat), [cat])
  const [serviceId, setServiceId] = useState(deepSvc?.id || catServices[0]?.id)
  const [link, setLink] = useState('')
  const [qty, setQty] = useState(1000)
  const [drip, setDrip] = useState(false)
  const [dripRuns, setDripRuns] = useState(4)
  const [country, setCountry] = useState(params.get('country') || 'IN')
  const [liveServiceId, setLiveServiceId] = useState('')
  const live = isLiveEnabled()
  const nativeProvider = live && !!getProviderConfig()?.native

  useEffect(() => {
    if (!catServices.find((s) => s.id === serviceId)) setServiceId(catServices[0]?.id)
  }, [cat]) // eslint-disable-line

  // GrowGram Native serves this panel's own catalogue, so its service ids match 1:1
  useEffect(() => {
    if (nativeProvider && serviceId) setLiveServiceId(String(serviceId))
  }, [nativeProvider, serviceId])

  const service = SERVICES.find((s) => s.id === Number(serviceId))
  const target = parseIgTarget(link)
  const charge = service ? priceFor(service, qty, drip ? dripRuns : 1) : 0
  const qtyValid = service && qty >= service.min && qty <= service.max
  const canOrder = service && qtyValid && link.trim() && charge <= balance
  const cats = categoriesForPlatform(platform)

  const pickPlatform = (pid) => {
    setPlatform(pid)
    const firstCat = categoriesForPlatform(pid)[0]
    if (firstCat) setCat(firstCat.id)
  }

  const submit = () => {
    if (!service) return
    if (!link.trim()) return toast('Paste your profile / post link first', 'err')
    if (!qtyValid) return toast(`Quantity must be ${service.min}–${compact(service.max)}`, 'err')
    const res = placeOrder({ serviceId: service.id, link: link.trim(), qty: Number(qty), charge, dripRuns: drip ? dripRuns : 1, country: service.geo ? country : null, liveServiceId: live ? liveServiceId : null })
    if (res.ok) {
      toast(res.live ? `Order ${res.id} sent to provider — delivering for real 🚀` : `Order ${res.id} placed (demo) — simulating ⚡`, 'ok')
      navigate('/app/orders')
    } else {
      toast(res.error || 'Could not place order', 'err')
    }
  }

  return (
    <>
      <Topbar title="New Order" sub="Pick a platform, choose a service, paste your link and go live in seconds." />

      <div className={'mode-banner ' + (live ? 'live' : 'demo')}>
        {live
          ? <>🟢 <b>Live delivery ON</b> — enter your provider’s service ID below and this order is dispatched for real.</>
          : <>🟡 <b>Demo mode</b> — orders here are <b>simulated</b> for preview and do <b>not</b> add real followers. Connect a provider in <a href="/app/api">API &amp; Providers</a> to deliver for real.</>}
      </div>

      <div className="platform-rail">
        {PLATFORMS.map((p) => (
          <button key={p.id} className={'plat' + (platform === p.id ? ' active' : '')} onClick={() => pickPlatform(p.id)}>
            <span className="plat-ic">{p.icon}</span><span>{p.label}</span>
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className="card pad">
          <div className="field">
            <label>1 · Category</label>
            <div className="row wrap" style={{ gap: 8 }}>
              {cats.map((c) => (
                <button key={c.id} className={'btn sm' + (cat === c.id ? ' primary' : '')} onClick={() => setCat(c.id)}>{c.icon} {c.label}</button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>2 · Service</label>
            <select className="select" value={serviceId} onChange={(e) => setServiceId(Number(e.target.value))}>
              {catServices.map((s) => (
                <option key={s.id} value={s.id}>#{s.id} · {s.name} · {money(s.price)}/1k</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>3 · Link or @username</label>
            <input className="input" placeholder="https://instagram.com/yourhandle  ·  @yourhandle  ·  post URL" value={link} onChange={(e) => setLink(e.target.value)} />
            {target && <div style={{ fontSize: 12, color: 'var(--muted)' }}>🎯 Target detected: <b style={{ color: 'var(--text)' }}>{target.value}</b> ({target.type})</div>}
          </div>

          {service?.geo && (
            <div className="field">
              <label>🌍 Target country</label>
              <select className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
          )}

          <div className="field">
            <label>4 · Quantity {service && <span style={{ color: 'var(--muted-2)' }}>· min {service.min} · max {compact(service.max)}</span>}</label>
            <input className="input" type="number" value={qty} min={service?.min} max={service?.max}
              onChange={(e) => setQty(clamp(Number(e.target.value), 1, service?.max || 1))} />
            <div className="row wrap" style={{ gap: 6, marginTop: 4 }}>
              {[500, 1000, 5000, 10000, 50000].filter((qq) => service && qq >= service.min && qq <= service.max).map((qq) => (
                <button key={qq} className="btn sm ghost" onClick={() => setQty(qq)}>{compact(qq)}</button>
              ))}
            </div>
          </div>

          {live && (
            <div className="field">
              <label>{nativeProvider ? '🛰️ Provider service ID (auto-filled from GrowGram Native)' : '🟢 Provider service ID (required for real delivery)'}</label>
              <input className="input" value={liveServiceId} onChange={(e) => setLiveServiceId(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g. 1234 — copy from API & Providers → provider services" />
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {nativeProvider
                  ? <>Your self-hosted provider serves GrowGram's own catalogue, so the ID matches the selected service automatically.</>
                  : <>Leave empty to place a demo order instead. This must be the numeric service ID from <b>your</b> provider, not GrowGram's.</>}
              </div>
            </div>
          )}

          {service?.dripfeed && (
            <div className="field">
              <label>5 · Drip-feed (deliver gradually for natural growth)</label>
              <div className="row" style={{ gap: 10 }}>
                <button className={'btn sm' + (drip ? ' primary' : '')} onClick={() => setDrip(!drip)}>{drip ? '✓ Drip-feed on' : 'Enable drip-feed'}</button>
                {drip && (
                  <div className="row" style={{ gap: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>Runs</span>
                    <input className="input" style={{ width: 80 }} type="number" min={2} max={20} value={dripRuns} onChange={(e) => setDripRuns(clamp(Number(e.target.value), 2, 20))} />
                    <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>≈ {compact(Math.round(qty / dripRuns))} per run</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card pad" style={{ position: 'sticky', top: 20 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 17 }}>Order summary</h3>
          {service && (
            <>
              <div className="row between" style={{ marginBottom: 10 }}>
                <span style={{ color: 'var(--muted)' }}>Service</span>
                <span style={{ textAlign: 'right', maxWidth: 180, fontWeight: 600 }}>{service.name.split('—')[0].trim()}</span>
              </div>
              <div className="svc" style={{ padding: 0, cursor: 'default', marginBottom: 12 }}>
                <div className="meta">
                  <span className="m">Type: {dropTypeOf(service)}</span>
                  {service.power && <span className="m">Power: {service.power}</span>}
                  <span className="m">Quality: {service.quality}</span>
                  <span className="m">Refill: {service.refill}</span>
                  <span className="m">Drop: {service.drop}</span>
                  <span className="m">Speed: {service.speed}</span>
                  {service.geo && <span className="m">{countryByCode(country)?.flag} {countryByCode(country)?.name}</span>}
                </div>
              </div>
              <div className="row between" style={{ marginBottom: 8 }}><span style={{ color: 'var(--muted)' }}>Rate / 1,000</span><span>{money(service.price)}</span></div>
              <div className="row between" style={{ marginBottom: 8 }}><span style={{ color: 'var(--muted)' }}>Quantity</span><span>{Number(qty).toLocaleString('en-IN')}</span></div>
              {drip && <div className="row between" style={{ marginBottom: 8 }}><span style={{ color: 'var(--muted)' }}>Drip-feed</span><span>{dripRuns} runs (+5%)</span></div>}
              <div style={{ height: 1, background: 'var(--stroke)', margin: '12px 0' }} />
              <div className="row between" style={{ marginBottom: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                <span className="gradient-text" style={{ fontWeight: 800, fontSize: 24 }}>{money(charge)}</span>
              </div>
              {charge > balance && (
                <div className="card pad" style={{ padding: 12, marginBottom: 10, borderColor: 'rgba(255,93,115,.4)' }}>
                  <div style={{ color: 'var(--red)', fontWeight: 700, fontSize: 13 }}>Insufficient balance</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 8px' }}>You have {money(balance)} — this order needs {money(charge)}.</div>
                  <Link className="btn sm primary block" to="/app/wallet">💳 Add funds</Link>
                </div>
              )}
              <button className="btn primary block" onClick={submit} disabled={!canOrder}>Place order · {money(charge)}</button>
              <p style={{ fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', marginTop: 12, marginBottom: 0 }}>🛡️ We never ask for your password. Public link only.</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
