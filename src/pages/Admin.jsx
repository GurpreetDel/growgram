import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Topbar from '../components/Topbar.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { money, compact, timeAgo } from '../lib/helpers'
import { PROVIDERS } from '../lib/providerApi'
import { SERVICES, PLATFORMS } from '../data/services'
import { listAccounts } from '../lib/auth'
import { loadData, getTopups } from '../lib/accountData'

export default function Admin() {
  const {
    orders, transactions, balance,
    adminCompleteOrder, adminRefundOrder, cancelOrder,
    approveTopup, rejectTopup, creditUser, resetMyData,
  } = useStore()
  const toast = useToast()
  const [tab, setTab] = useState('approvals')
  const [refresh, setRefresh] = useState(0)
  const bump = () => setRefresh((r) => r + 1)

  const topups = useMemo(() => getTopups(), [refresh])
  const users = useMemo(() => listAccounts(), [refresh])
  const pendingCount = topups.filter((t) => t.status === 'Pending').length

  const stats = useMemo(() => {
    const revenue = users.reduce((a, u) => {
      const d = loadData(u.id)
      return a + d.transactions.filter((t) => t.type === 'Order').reduce((x, t) => x + Math.abs(t.amount), 0)
    }, 0)
    const active = orders.filter((o) => o.status === 'In progress' || o.status === 'Pending').length
    const deposits = topups.filter((t) => t.status === 'Approved').reduce((a, t) => a + t.amount, 0)
    return { revenue, active, deposits }
  }, [users, orders, topups]) // eslint-disable-line

  const TABS = { approvals: `💰 Approvals${pendingCount ? ` (${pendingCount})` : ''}`, orders: '📦 My Orders', users: '👥 Users', providers: '🔌 Providers', danger: '⚠️ Danger' }

  return (
    <>
      <Topbar title="Admin Panel" sub="Owner cockpit — approve payments, manage users, orders and providers." />

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <div className="card stat"><span className="k">Approved deposits</span><div className="v gradient-text">{money(stats.deposits)}</div><div className="delta">{topups.length} requests total</div></div>
        <div className="card stat"><span className="k">Pending approvals</span><div className="v">{pendingCount}</div><div className="delta">{pendingCount ? 'needs your review' : 'all clear'}</div></div>
        <div className="card stat"><span className="k">Registered users</span><div className="v">{users.length}</div><div className="delta">+ you (owner)</div></div>
        <div className="card stat"><span className="k">Catalog</span><div className="v">{SERVICES.length}</div><div className="delta">{PLATFORMS.length} platforms live</div></div>
      </div>

      <div className="row wrap" style={{ gap: 8, marginBottom: 16 }}>
        {Object.entries(TABS).map(([t, label]) => (
          <button key={t} className={'btn sm' + (tab === t ? ' primary' : '')} onClick={() => { setTab(t); bump() }}>{label}</button>
        ))}
      </div>

      {tab === 'approvals' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {topups.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>💸</div>No payment requests yet. When members pay via UPI they show up here for approval.
            </div>
          ) : (
            <table className="table">
              <thead><tr><th>Request</th><th>User</th><th>UPI Ref</th><th>Amount</th><th className="hide-mobile">When</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {topups.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.id}</td>
                    <td><div style={{ fontWeight: 600 }}>{t.accountName}</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{t.accountEmail}</div></td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--muted)' }}>{t.ref || '—'}</td>
                    <td style={{ fontWeight: 800 }} className="gradient-text">{money(t.amount)}</td>
                    <td className="hide-mobile" style={{ color: 'var(--muted)', fontSize: 12 }}>{timeAgo(t.at)}</td>
                    <td><span className={'badge ' + (t.status === 'Approved' ? 'ok-badge' : t.status === 'Rejected' ? 'err-badge' : '')}>{t.status}</span></td>
                    <td>
                      {t.status === 'Pending' && (
                        <div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
                          <button className="btn sm primary" onClick={() => { approveTopup(t.id); toast(`Approved ${money(t.amount)} for ${t.accountName} ✅`, 'ok'); bump() }}>Approve</button>
                          <button className="btn sm ghost" onClick={() => { rejectTopup(t.id); toast('Request rejected', 'err'); bump() }}>Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {orders.length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No orders on your account yet.</div> : (
            <table className="table">
              <thead><tr><th>ID</th><th>Service</th><th>Progress</th><th className="hide-mobile">Provider</th><th className="hide-mobile">Charge</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {orders.map((o) => {
                  const pct = Math.round((o.delivered / o.qty) * 100)
                  const live = o.status === 'In progress' || o.status === 'Pending'
                  return (
                    <tr key={o.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.id}</td>
                      <td style={{ maxWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{o.serviceName.split('—')[0].trim()}</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{o.link}</div></td>
                      <td style={{ minWidth: 90 }}><div className="progress"><span style={{ width: pct + '%' }} /></div><div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{compact(o.delivered)}/{compact(o.qty)}</div></td>
                      <td className="hide-mobile" style={{ fontSize: 12 }}>{o.provider || '—'}</td>
                      <td className="hide-mobile" style={{ fontWeight: 700 }}>{money(o.charge)}</td>
                      <td><StatusBadge status={o.status} /></td>
                      <td>
                        <div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
                          {live && <><button className="btn sm" onClick={() => { adminCompleteOrder(o.id); toast(`${o.id} completed ✅`, 'ok') }}>✅</button><button className="btn sm ghost" onClick={() => { cancelOrder(o.id); toast(`${o.id} canceled`, 'ok') }}>✕</button></>}
                          {o.status === 'Completed' && <button className="btn sm ghost" onClick={() => { adminRefundOrder(o.id); toast(`${o.id} refunded 💸`, 'ok') }}>💸</button>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {users.length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No members registered yet.</div> : (
            <table className="table">
              <thead><tr><th>User</th><th>Balance</th><th className="hide-mobile">Orders</th><th className="hide-mobile">Joined</th><th>Credit</th></tr></thead>
              <tbody>
                {users.map((u) => {
                  const d = loadData(u.id)
                  return (
                    <tr key={u.id}>
                      <td><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{u.email}</div></td>
                      <td style={{ fontWeight: 700 }} className="gradient-text">{money(d.balance)}</td>
                      <td className="hide-mobile">{d.orders?.length || 0}</td>
                      <td className="hide-mobile" style={{ color: 'var(--muted)', fontSize: 12 }}>{d.orders?.length ? '' : ''}—</td>
                      <td><CreditCell userId={u.id} name={u.name} creditUser={creditUser} toast={toast} onDone={bump} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'providers' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead><tr><th>Provider</th><th>Handles</th><th className="hide-mobile">Ping</th><th className="hide-mobile">Uptime</th><th>Balance</th></tr></thead>
            <tbody>
              {PROVIDERS.map((p) => (
                <tr key={p.id}>
                  <td><div style={{ fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 11.5, color: 'var(--muted)', fontFamily: 'monospace' }}>{p.url}</div></td>
                  <td style={{ fontSize: 12.5 }}>{p.platforms.map((pl) => PLATFORMS.find((x) => x.id === pl)?.icon).join(' ')} {p.specialty}</td>
                  <td className="hide-mobile" style={{ color: p.ping < 100 ? 'var(--green)' : 'var(--amber)' }}>{p.ping}ms</td>
                  <td className="hide-mobile">{p.uptime}</td>
                  <td style={{ fontWeight: 700 }} className="gradient-text">${p.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'danger' && (
        <div className="card pad" style={{ borderColor: 'rgba(255,93,115,.4)' }}>
          <h3 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--red)' }}>⚠️ Danger zone</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>Reset wipes YOUR account's orders, transactions and notifications. Members' accounts are untouched.</p>
          <button className="btn" style={{ borderColor: 'rgba(255,93,115,.5)', color: 'var(--red)' }} onClick={() => { resetMyData(); toast('Your account reset 🧹', 'ok') }}>Reset my account</button>
        </div>
      )}
    </>
  )
}

function CreditCell({ userId, name, creditUser, toast, onDone }) {
  const [amt, setAmt] = useState('')
  return (
    <div className="row" style={{ gap: 6 }}>
      <input className="input" style={{ width: 90, padding: '7px 10px' }} type="number" placeholder="₹" value={amt} onChange={(e) => setAmt(e.target.value)} />
      <button className="btn sm primary" onClick={() => {
        const n = Number(amt)
        if (!n || n <= 0) return toast('Enter an amount', 'err')
        creditUser(userId, n, 'Gift by admin'); toast(`Credited ${money(n)} to ${name} ✅`, 'ok'); setAmt(''); onDone()
      }}>Add</button>
    </div>
  )
}
