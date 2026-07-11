import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Topbar from '../components/Topbar.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { money, compact, timeAgo } from '../lib/helpers'
import { isLiveEnabled } from '../lib/liveProvider'

const FILTERS = ['All', 'In progress', 'Pending', 'Completed', 'Partial', 'Canceled']

export default function Orders() {
  const { orders, requestRefill, cancelOrder } = useStore()
  const toast = useToast()
  const [filter, setFilter] = useState('All')
  const live = isLiveEnabled()

  const list = orders.filter((o) => filter === 'All' || o.status === filter)

  return (
    <>
      <Topbar title="Orders" sub="Track every order in real time." />

      {!live && (
        <div className="mode-banner demo" style={{ marginBottom: 16 }}>
          🟡 <b>Demo mode</b> — these orders are <b>simulated</b> and do <b>not</b> add real engagement. Connect a funded provider in <a href="/app/api">API &amp; Providers</a> to deliver for real.
        </div>
      )}

      <div className="row wrap" style={{ gap: 8, marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button key={f} className={'btn sm' + (filter === f ? ' primary' : '')} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card pad" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          <p style={{ color: 'var(--muted)' }}>No {filter !== 'All' ? filter.toLowerCase() : ''} orders yet.</p>
          <Link className="btn primary" to="/app/new">Place an order</Link>
        </div>
      ) : (
        <div className="grid" style={{ gap: 12 }}>
          {list.map((o) => {
            const pct = Math.round((o.delivered / o.qty) * 100)
            const live = o.status === 'In progress' || o.status === 'Pending'
            return (
              <div key={o.id} className="card pad">
                <div className="row between wrap" style={{ gap: 12, marginBottom: 12 }}>
                  <div>
                    <div className="row" style={{ gap: 10 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--muted)' }}>{o.id}</span>
                      <StatusBadge status={o.status} />
                      <span className={'badge ' + (o.live ? 'ok-badge' : '')} style={{ fontSize: 10 }}>{o.live ? '🟢 LIVE' : '🧪 DEMO'}</span>
                      {o.live && o.providerOrderId && <span style={{ fontSize: 11, color: 'var(--muted-2)', fontFamily: 'monospace' }}>#{o.providerOrderId}</span>}
                    </div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>{o.serviceName}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                      🎯 {o.link} · placed {timeAgo(o.createdAt)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="gradient-text" style={{ fontWeight: 800, fontSize: 18 }}>{money(o.charge)}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{compact(o.delivered)} / {compact(o.qty)}</div>
                  </div>
                </div>

                <div className="progress"><span style={{ width: pct + '%' }} /></div>
                <div className="row between" style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: live ? 'var(--amber)' : 'var(--muted)' }} className={live ? 'pulse' : ''}>
                    {live ? `⚡ Filling… ${pct}%` : `${pct}% delivered`}
                  </span>
                  <div className="row" style={{ gap: 8 }}>
                    {o.status === 'Completed' && (
                      <button className="btn sm" onClick={() => { requestRefill(o.id); toast('Refill requested 🔁', 'ok') }}>🔁 Refill</button>
                    )}
                    {live && (
                      <button className="btn sm ghost" onClick={() => { cancelOrder(o.id); toast('Order canceled — partial refund issued', 'ok') }}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
