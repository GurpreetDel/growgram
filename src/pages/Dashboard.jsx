import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import Topbar from '../components/Topbar.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { money, compact, timeAgo } from '../lib/helpers'
import { CATEGORIES } from '../data/services'
import { auditHandle } from '../lib/aiStudio'

function Stat({ icon, label, value, delta }) {
  return (
    <div className="card stat">
      <div className="row between">
        <span className="k">{label}</span>
        <span className="ic">{icon}</span>
      </div>
      <div className="v">{value}</div>
      {delta && <div className="delta">{delta}</div>}
    </div>
  )
}

export default function Dashboard() {
  const { orders, balance, transactions } = useStore()
  const [handle, setHandle] = useState('@yourbrand')
  const [audit, setAudit] = useState(null)

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status === 'In progress' || o.status === 'Pending').length
    const delivered = orders.reduce((a, o) => a + o.delivered, 0)
    const spent = transactions.filter((t) => t.type === 'Order').reduce((a, t) => a + Math.abs(t.amount), 0)
    return { active, delivered, spent }
  }, [orders, transactions])

  const recent = orders.slice(0, 5)

  return (
    <>
      <Topbar title="Dashboard" sub="Welcome back — here's your growth at a glance." />

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <Stat icon="💳" label="Wallet balance" value={money(balance)} delta="₹500 welcome credit" />
        <Stat icon="🔄" label="Active orders" value={stats.active} delta={stats.active ? 'Filling live now' : 'All caught up'} />
        <Stat icon="📤" label="Total delivered" value={compact(stats.delivered)} delta="across all campaigns" />
        <Stat icon="💰" label="Total spent" value={money(stats.spent)} delta="lifetime" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        {/* Recent orders */}
        <div className="card pad">
          <div className="row between" style={{ marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 17 }}>Recent orders</h3>
            <Link className="btn sm" to="/app/orders">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No orders yet — place your first one!</p>
          ) : (
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Service</th><th>Progress</th><th className="hide-mobile">When</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recent.map((o) => {
                  const pct = Math.round((o.delivered / o.qty) * 100)
                  return (
                    <tr key={o.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.id}</td>
                      <td style={{ maxWidth: 200 }}>
                        <div style={{ fontWeight: 600 }}>{o.serviceName.split('—')[0].trim()}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 12 }}>{compact(o.delivered)} / {compact(o.qty)}</div>
                      </td>
                      <td style={{ minWidth: 110 }}>
                        <div className="progress"><span style={{ width: pct + '%' }} /></div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{pct}%</div>
                      </td>
                      <td className="hide-mobile" style={{ color: 'var(--muted)', fontSize: 12 }}>{timeAgo(o.createdAt)}</td>
                      <td><StatusBadge status={o.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* AI growth co-pilot */}
        <div className="card pad">
          <span className="badge grad" style={{ marginBottom: 12 }}>✨ AI Growth Co-Pilot</span>
          <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>Audit your profile</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0 }}>Get instant, AI-style growth tips.</p>
          <div className="row" style={{ gap: 8 }}>
            <input className="input" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@yourhandle" />
            <button className="btn primary" onClick={() => setAudit(auditHandle(handle))}>Scan</button>
          </div>
          {audit && (
            <div style={{ marginTop: 16 }}>
              <div className="grid g3" style={{ gap: 8 }}>
                <div className="card" style={{ padding: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Engagement</div>
                  <div style={{ fontWeight: 800 }} className="gradient-text">{audit.engagement}</div>
                </div>
                <div className="card" style={{ padding: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Post gap</div>
                  <div style={{ fontWeight: 800 }}>{audit.postingGap}</div>
                </div>
                <div className="card" style={{ padding: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Reels</div>
                  <div style={{ fontWeight: 800 }}>{audit.reelsShare}</div>
                </div>
              </div>
              <ul style={{ margin: '14px 0 0', paddingLeft: 18, color: 'var(--muted)', fontSize: 13, lineHeight: 1.7 }}>
                {audit.tips.slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
              </ul>
              <Link className="btn block" to="/app/studio" style={{ marginTop: 12 }}>Open AI Studio →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick order categories */}
      <h3 style={{ margin: '26px 0 12px', fontSize: 17 }}>Quick order</h3>
      <div className="grid g4">
        {CATEGORIES.map((c) => (
          <Link key={c.id} to={`/app/new?cat=${c.id}`} className="card svc">
            <div style={{ fontSize: 26 }}>{c.icon}</div>
            <div style={{ fontWeight: 700 }}>{c.label.replace('Instagram ', '')}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Order now →</div>
          </Link>
        ))}
      </div>
    </>
  )
}
