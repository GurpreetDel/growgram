import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar.jsx'
import { COUNTRIES, REGIONS } from '../data/countries'
import { geoServices, platformOfService, platformById } from '../data/services'
import { money, compact } from '../lib/helpers'

export default function Explore() {
  const navigate = useNavigate()
  const [region, setRegion] = useState('All')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)

  const list = useMemo(() => {
    return COUNTRIES
      .filter((c) => (region === 'All' || c.region === region) && c.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => b.reach - a.reach)
  }, [region, q])

  const geo = geoServices()
  const totalReach = COUNTRIES.reduce((a, c) => a + c.reach, 0)

  return (
    <>
      <Topbar title="Explore" sub={`Target real audiences across ${COUNTRIES.length} countries — geo-locked delivery worldwide.`} />

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <div className="card stat"><span className="k">🌍 Countries</span><div className="v gradient-text">{COUNTRIES.length}</div><div className="delta">every major market</div></div>
        <div className="card stat"><span className="k">👥 Reachable</span><div className="v">{compact(totalReach)}M+</div><div className="delta">monthly audience index</div></div>
        <div className="card stat"><span className="k">🎯 Geo services</span><div className="v">{geo.length}</div><div className="delta">country-locked delivery</div></div>
        <div className="card stat"><span className="k">🗺️ Regions</span><div className="v">{REGIONS.length - 1}</div><div className="delta">worldwide coverage</div></div>
      </div>

      <div className="card pad" style={{ marginBottom: 16 }}>
        <div className="row between wrap" style={{ gap: 12 }}>
          <div className="row wrap" style={{ gap: 8 }}>
            {REGIONS.map((r) => (
              <button key={r} className={'btn sm' + (region === r ? ' primary' : '')} onClick={() => setRegion(r)}>{r}</button>
            ))}
          </div>
          <input className="input" style={{ maxWidth: 240 }} placeholder="🔍 Search a country…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {selected && (
        <div className="card pad" style={{ marginBottom: 16, background: 'var(--ig-soft)' }}>
          <div className="row between wrap" style={{ gap: 12 }}>
            <div className="row" style={{ gap: 14 }}>
              <span style={{ fontSize: 44 }}>{selected.flag}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{selected.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{selected.region} · ~{selected.reach}M reachable audience</div>
              </div>
            </div>
            <button className="btn sm ghost" onClick={() => setSelected(null)}>✕ Close</button>
          </div>
          <h4 style={{ margin: '18px 0 10px', fontSize: 14, color: 'var(--muted)' }}>Geo-targeted services for {selected.name}</h4>
          <div className="grid g3">
            {geo.map((s) => {
              const pf = platformOfService(s)
              return (
                <div key={s.id} className="card svc" onClick={() => navigate(`/app/new?service=${s.id}&country=${selected.code}`)}>
                  <div className="row between">
                    <span className="badge">{pf?.icon} {pf?.label}</span>
                    <span className="price gradient-text">{money(s.price)}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.name.split('—')[0].trim()}</div>
                  <div className="per">per 1,000 · {selected.flag} {selected.name} · {s.speed}</div>
                  <button className="btn sm primary block">Target {selected.name} →</button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="explore-grid">
        {list.map((c, i) => (
          <button key={c.code} className={'country-tile card' + (selected?.code === c.code ? ' sel' : '')} onClick={() => setSelected(c)}>
            {i < 3 && region === 'All' && !q && <span className="rank-chip">#{i + 1}</span>}
            <span className="flag">{c.flag}</span>
            <span className="cname">{c.name}</span>
            <span className="reach">{c.reach >= 1 ? `${c.reach}M` : '<1M'} reach</span>
            {c.top && <span className="top-badge">🔥 Top market</span>}
          </button>
        ))}
      </div>
      {list.length === 0 && <div className="card pad" style={{ textAlign: 'center', color: 'var(--muted)' }}>No countries match “{q}”.</div>}
    </>
  )
}
