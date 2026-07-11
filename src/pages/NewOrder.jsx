import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Topbar from '../components/Topbar.jsx'
import { CATEGORIES, SERVICES, categoryById } from '../data/services'
import { money, compact, priceFor, clamp, parseIgTarget } from '../lib/helpers'

export default function NewOrder() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { placeOrder, balance } = useStore()
  const toast = useToast()

  const [cat, setCat] = useState(params.get('cat') || 'ig_followers')
  const catServices = useMemo(() => SERVICES.filter((s) => s.cat === cat), [cat])
  const [serviceId, setServiceId] = useState(catServices[0]?.id)
  const [link, setLink] = useState('')
  const [qty, setQty] = useState(1000)
  const [drip, setDrip] = useState(false)
  const [dripRuns, setDripRuns] = useState(4)

  useEffect(() => {
    // keep a valid service selected whenever the category changes
    if (!catServices.find((s) => s.id === serviceId)) setServiceId(catServices[0]?.id)
  }, [cat]) // eslint-disable-line

  const service = SERVICES.find((s) => s.id === Number(serviceId))
  const target = parseIgTarget(link)
  const charge = service ? priceFor(service, qty, drip ? dripRuns : 1) : 0
  const qtyValid = service && qty >= service.min && qty <= service.max
  const canOrder = service && qtyValid && link.trim() && charge <= balance

  const submit = () => {
    if (!service) return
    if (!link.trim()) return toast('Paste your Instagram link first', 'err')
    if (!qtyValid) return toast(`Quantity must be ${service.min}–${compact(service.max)}`, 'err')
    const res = placeOrder({ serviceId: service.id, link: link.trim(), qty: Number(qty), charge, dripRuns: drip ? dripRuns : 1 })
    if (res.ok) {
      toast(`Order ${res.id} placed — filling now! ⚡`, 'ok')
      navigate('/app/orders')
    } else {
      toast(res.error || 'Could not place order', 'err')
    }
  }

  return (
    <>
      <Topbar title="New Order" sub="Pick a service, paste your link, and go live in seconds." />

      <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className="card pad">
          {/* Category */}
          <div className="field">
            <label>1 · Category</label>
            <div className="row wrap" style={{ gap: 8 }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={'btn sm' + (cat === c.id ? ' primary' : '')}
                  onClick={() => setCat(c.id)}
                >
                  {c.icon} {c.label.replace('Instagram ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Service */}
          <div className="field">
            <label>2 · Service</label>
            <select className="select" value={serviceId} onChange={(e) => setServiceId(Number(e.target.value))}>
              {catServices.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} · {s.name} · {money(s.price)}/1k
                </option>
              ))}
            </select>
          </div>

          {/* Link */}
          <div className="field">
            <label>3 · Instagram link or @username</label>
            <input
              className="input"
              placeholder="https://instagram.com/yourhandle  or  @yourhandle"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            {target && (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                🎯 Target detected: <b style={{ color: 'var(--text)' }}>{target.value}</b> ({target.type})
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="field">
            <label>4 · Quantity {service && <span style={{ color: 'var(--muted-2)' }}>· min {service.min} · max {compact(service.max)}</span>}</label>
            <input
              className="input"
              type="number"
              value={qty}
              min={service?.min}
              max={service?.max}
              onChange={(e) => setQty(clamp(Number(e.target.value), 1, service?.max || 1))}
            />
            <div className="row wrap" style={{ gap: 6, marginTop: 4 }}>
              {[500, 1000, 5000, 10000, 50000].filter((q) => service && q >= service.min && q <= service.max).map((q) => (
                <button key={q} className="btn sm ghost" onClick={() => setQty(q)}>{compact(q)}</button>
              ))}
            </div>
          </div>

          {/* Drip feed */}
          {service?.dripfeed && (
            <div className="field">
              <label>5 · Drip-feed (deliver gradually for natural growth)</label>
              <div className="row" style={{ gap: 10 }}>
                <button className={'btn sm' + (drip ? ' primary' : '')} onClick={() => setDrip(!drip)}>
                  {drip ? '✓ Drip-feed on' : 'Enable drip-feed'}
                </button>
                {drip && (
                  <div className="row" style={{ gap: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>Runs</span>
                    <input className="input" style={{ width: 80 }} type="number" min={2} max={20}
                      value={dripRuns} onChange={(e) => setDripRuns(clamp(Number(e.target.value), 2, 20))} />
                    <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>≈ {compact(Math.round(qty / dripRuns))} per run</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
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
                  <span className="m">Quality: {service.quality}</span>
                  <span className="m">Refill: {service.refill}</span>
                  <span className="m">Drop: {service.drop}</span>
                  <span className="m">Speed: {service.speed}</span>
                </div>
              </div>
              <div className="row between" style={{ marginBottom: 8 }}>
                <span style={{ color: 'var(--muted)' }}>Rate / 1,000</span><span>{money(service.price)}</span>
              </div>
              <div className="row between" style={{ marginBottom: 8 }}>
                <span style={{ color: 'var(--muted)' }}>Quantity</span><span>{Number(qty).toLocaleString('en-IN')}</span>
              </div>
              {drip && (
                <div className="row between" style={{ marginBottom: 8 }}>
                  <span style={{ color: 'var(--muted)' }}>Drip-feed</span><span>{dripRuns} runs (+5%)</span>
                </div>
              )}
              <div style={{ height: 1, background: 'var(--stroke)', margin: '12px 0' }} />
              <div className="row between" style={{ marginBottom: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                <span className="gradient-text" style={{ fontWeight: 800, fontSize: 24 }}>{money(charge)}</span>
              </div>
              {charge > balance && (
                <div className="badge" style={{ color: 'var(--red)', marginBottom: 10, width: '100%', justifyContent: 'center' }}>
                  Insufficient balance — add funds
                </div>
              )}
              <button className="btn primary block" onClick={submit} disabled={!canOrder}>
                Place order · {money(charge)}
              </button>
              <p style={{ fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', marginTop: 12, marginBottom: 0 }}>
                🛡️ We never ask for your password. Public link only.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
