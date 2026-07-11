import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Topbar from '../components/Topbar.jsx'
import {
  PLATFORMS, CATEGORIES, SERVICES, SERVICE_TYPES, POWER_TIERS,
  categoriesForPlatform, dropTypeOf,
} from '../data/services'
import { money, compact } from '../lib/helpers'

export default function Services() {
  const [platform, setPlatform] = useState('all')
  const [cat, setCat] = useState('all')
  const [type, setType] = useState('all')
  const [power, setPower] = useState('all')
  const [q, setQ] = useState('')

  const cats = platform === 'all' ? [] : categoriesForPlatform(platform)

  const list = useMemo(() => {
    return SERVICES.filter((s) => {
      const pf = CATEGORIES.find((c) => c.id === s.cat)?.platform
      if (platform !== 'all' && pf !== platform) return false
      if (cat !== 'all' && s.cat !== cat) return false
      if (type !== 'all' && dropTypeOf(s) !== type) return false
      if (power !== 'all' && s.power !== power) return false
      if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && String(s.id) !== q.trim()) return false
      return true
    })
  }, [platform, cat, type, power, q])

  return (
    <>
      <Topbar title="Services" sub={`${SERVICES.length} services · ${PLATFORMS.length} platforms · live pricing per 1,000`} />

      {/* platform selector */}
      <div className="platform-rail">
        <button className={'plat' + (platform === 'all' ? ' active' : '')} onClick={() => { setPlatform('all'); setCat('all') }}>
          <span className="plat-ic">🌐</span><span>All</span>
        </button>
        {PLATFORMS.map((p) => (
          <button key={p.id} className={'plat' + (platform === p.id ? ' active' : '')} onClick={() => { setPlatform(p.id); setCat('all') }}>
            <span className="plat-ic">{p.icon}</span><span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="card pad" style={{ marginBottom: 16 }}>
        {cats.length > 0 && (
          <div className="row wrap" style={{ gap: 8, marginBottom: 12 }}>
            <button className={'btn sm' + (cat === 'all' ? ' primary' : '')} onClick={() => setCat('all')}>All categories</button>
            {cats.map((c) => (
              <button key={c.id} className={'btn sm' + (cat === c.id ? ' primary' : '')} onClick={() => setCat(c.id)}>{c.icon} {c.label}</button>
            ))}
          </div>
        )}
        <div className="row between wrap" style={{ gap: 12 }}>
          <div className="row wrap" style={{ gap: 8 }}>
            {SERVICE_TYPES.map((t) => (
              <button key={t.id} className={'btn sm' + (type === t.id ? ' primary' : ' ghost')} onClick={() => setType(t.id)}>{t.icon} {t.label}</button>
            ))}
          </div>
          <input className="input" style={{ maxWidth: 240 }} placeholder="🔍 Search or paste service ID…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>Power tier:</span>
          <button className={'btn sm' + (power === 'all' ? ' primary' : ' ghost')} onClick={() => setPower('all')}>All</button>
          {POWER_TIERS.map((p) => (
            <button key={p.id} className={'btn sm' + (power === p.id ? ' primary' : ' ghost')} onClick={() => setPower(p.id)} title={p.desc}>{p.icon} {p.label}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Service</th><th>Type</th><th>Rate / 1k</th>
              <th className="hide-mobile">Min–Max</th><th className="hide-mobile">Refill</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => {
              const dt = dropTypeOf(s)
              return (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>{s.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {s.name}
                      {s.tag && <span className="badge grad" style={{ fontSize: 10 }}>{s.tag}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Quality: {s.quality} · Drop: {s.drop} · Speed: {s.speed}</div>
                  </td>
                  <td><span className={'badge ' + (dt === 'Non-Drop' ? 'ok-badge' : dt === 'Custom' ? '' : '')} style={{ fontSize: 10.5 }}>{dt}</span></td>
                  <td style={{ fontWeight: 800 }} className="gradient-text">{money(s.price)}</td>
                  <td className="hide-mobile" style={{ color: 'var(--muted)' }}>{s.min} – {compact(s.max)}</td>
                  <td className="hide-mobile">{s.refill}</td>
                  <td><Link className="btn sm primary" to={`/app/new?service=${s.id}`}>Order</Link></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {list.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: 'var(--muted)' }}>No services match these filters.</div>}
      </div>
    </>
  )
}
