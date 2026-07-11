import { useMemo } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import Topbar from '../components/Topbar.jsx'
import { money, compact } from '../lib/helpers'
import { CATEGORIES, serviceById } from '../data/services'

export default function Analytics() {
  const { orders, transactions } = useStore()

  // spend per day for the last 7 days
  const spendSeries = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - (6 - i))
      return { label: d.toLocaleDateString('en-IN', { weekday: 'short' }), start: d.getTime(), total: 0 }
    })
    transactions.filter((t) => t.type === 'Order').forEach((t) => {
      const bucket = days.find((d) => t.at >= d.start && t.at < d.start + 86_400_000)
      if (bucket) bucket.total += Math.abs(t.amount)
    })
    return days
  }, [transactions])
  const maxSpend = Math.max(1, ...spendSeries.map((d) => d.total))

  // service mix by category
  const mix = useMemo(() => {
    const m = {}
    orders.forEach((o) => {
      const svc = serviceById(o.serviceId)
      if (!svc) return
      m[svc.cat] = (m[svc.cat] || 0) + o.delivered
    })
    const total = Object.values(m).reduce((a, b) => a + b, 0) || 1
    return CATEGORIES.map((c) => ({ ...c, value: m[c.id] || 0, pct: Math.round(((m[c.id] || 0) / total) * 100) }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [orders])

  const totals = useMemo(() => {
    const delivered = orders.reduce((a, o) => a + o.delivered, 0)
    const spent = transactions.filter((t) => t.type === 'Order').reduce((a, t) => a + Math.abs(t.amount), 0)
    const completed = orders.filter((o) => o.status === 'Completed').length
    const rate = orders.length ? Math.round((completed / orders.length) * 100) : 0
    return { delivered, spent, rate, avg: orders.length ? spent / orders.length : 0 }
  }, [orders, transactions])

  return (
    <>
      <Topbar title="Analytics" sub="Your campaign performance across every order." />

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <div className="card stat"><span className="k">Engagement delivered</span><div className="v">{compact(totals.delivered)}</div></div>
        <div className="card stat"><span className="k">Total spend</span><div className="v">{money(totals.spent)}</div></div>
        <div className="card stat"><span className="k">Avg order value</span><div className="v">{money(totals.avg)}</div></div>
        <div className="card stat"><span className="k">Completion rate</span><div className="v">{totals.rate}%</div></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div className="card pad">
          <h3 style={{ margin: '0 0 18px', fontSize: 17 }}>Spend · last 7 days</h3>
          <div className="row" style={{ alignItems: 'flex-end', gap: 12, height: 180 }}>
            {spendSeries.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{d.total ? money(d.total).replace('.00', '') : ''}</div>
                <div style={{ width: '100%', height: 130, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%', height: `${(d.total / maxSpend) * 100}%`, minHeight: d.total ? 6 : 2,
                    background: d.total ? 'var(--ig)' : 'rgba(255,255,255,.08)', borderRadius: 8,
                    transition: 'height .6s ease',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card pad">
          <h3 style={{ margin: '0 0 18px', fontSize: 17 }}>Service mix</h3>
          {mix.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>Place an order to see your mix.</p>
          ) : (
            <div className="grid" style={{ gap: 14 }}>
              {mix.map((c) => (
                <div key={c.id}>
                  <div className="row between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5 }}>{c.icon} {c.label.replace('Instagram ', '')}</span>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>{compact(c.value)} · {c.pct}%</span>
                  </div>
                  <div className="progress"><span style={{ width: c.pct + '%' }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
