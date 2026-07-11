import { useState } from 'react'
import { Link } from 'react-router-dom'
import Topbar from '../components/Topbar.jsx'
import { CATEGORIES, SERVICES } from '../data/services'
import { money, compact } from '../lib/helpers'

export default function Services() {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const list = SERVICES.filter((s) => (cat === 'all' || s.cat === cat) && s.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <Topbar title="Services" sub={`${SERVICES.length} Instagram services · live pricing per 1,000`} />

      <div className="card pad" style={{ marginBottom: 16 }}>
        <div className="row between wrap" style={{ gap: 12 }}>
          <div className="row wrap" style={{ gap: 8 }}>
            <button className={'btn sm' + (cat === 'all' ? ' primary' : '')} onClick={() => setCat('all')}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={'btn sm' + (cat === c.id ? ' primary' : '')} onClick={() => setCat(c.id)}>
                {c.icon} {c.label.replace('Instagram ', '')}
              </button>
            ))}
          </div>
          <input className="input" style={{ maxWidth: 240 }} placeholder="🔍 Search services…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Service</th><th>Rate / 1k</th>
              <th className="hide-mobile">Min–Max</th><th className="hide-mobile">Refill</th>
              <th className="hide-mobile">Speed</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>{s.id}</td>
                <td>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {s.name}
                    {s.tag && <span className="badge grad" style={{ fontSize: 10 }}>{s.tag}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Quality: {s.quality} · Drop: {s.drop}</div>
                </td>
                <td style={{ fontWeight: 800 }} className="gradient-text">{money(s.price)}</td>
                <td className="hide-mobile" style={{ color: 'var(--muted)' }}>{s.min} – {compact(s.max)}</td>
                <td className="hide-mobile">{s.refill}</td>
                <td className="hide-mobile" style={{ color: 'var(--muted)' }}>{s.speed}</td>
                <td><Link className="btn sm primary" to={`/app/new?cat=${s.cat}`}>Order</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
