import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { money, timeAgo } from '../lib/helpers'

export default function Topbar({ title, sub }) {
  const { balance, notifications = [], markNotificationsRead } = useStore()
  const [open, setOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length

  const toggle = () => {
    setOpen((o) => {
      if (!o && unread) markNotificationsRead()
      return !o
    })
  }

  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="row" style={{ gap: 10 }}>
        <div style={{ position: 'relative' }} onMouseLeave={() => setOpen(false)}>
          <button className="wallet-pill" onClick={toggle} style={{ cursor: 'pointer' }} title="Notifications">
            <span style={{ fontSize: 18 }}>🔔</span>
            {unread > 0 && <span className="notif-dot">{unread}</span>}
          </button>
          {open && (
            <div className="notif-menu card">
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--stroke)', fontWeight: 700, fontSize: 13 }}>Notifications</div>
              {notifications.length === 0 ? (
                <div style={{ padding: 18, color: 'var(--muted)', fontSize: 13 }}>Nothing yet.</div>
              ) : notifications.slice(0, 12).map((n) => (
                <div key={n.id} className="notif-item">
                  <span style={{ fontSize: 16 }}>{n.icon}</span>
                  <div><div style={{ fontSize: 12.5 }}>{n.text}</div><div style={{ fontSize: 10.5, color: 'var(--muted-2)' }}>{timeAgo(n.at)}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link to="/app/wallet" className="wallet-pill" title="Wallet balance">
          <span style={{ fontSize: 18 }}>💳</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Balance</div>
            <div className="bal gradient-text">{money(balance)}</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
