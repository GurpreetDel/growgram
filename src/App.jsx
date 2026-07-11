import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext.jsx'
import { useStore } from './context/StoreContext.jsx'
import { money } from './lib/helpers'

import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewOrder from './pages/NewOrder.jsx'
import Services from './pages/Services.jsx'
import Orders from './pages/Orders.jsx'
import Wallet from './pages/Wallet.jsx'
import Studio from './pages/Studio.jsx'
import Analytics from './pages/Analytics.jsx'
import Referrals from './pages/Referrals.jsx'

const NAV = [
  { to: '/app', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/app/new', label: 'New Order', icon: '➕' },
  { to: '/app/services', label: 'Services', icon: '🗂️' },
  { to: '/app/orders', label: 'Orders', icon: '📦' },
  { to: '/app/studio', label: 'AI Studio', icon: '✨' },
  { to: '/app/analytics', label: 'Analytics', icon: '📈' },
  { to: '/app/wallet', label: 'Wallet', icon: '💳' },
  { to: '/app/referrals', label: 'Refer & Earn', icon: '🎁' },
]

const MOBILE_NAV = [
  { to: '/app', label: 'Home', icon: '🏠', end: true },
  { to: '/app/new', label: 'Order', icon: '➕' },
  { to: '/app/orders', label: 'Orders', icon: '📦' },
  { to: '/app/studio', label: 'Studio', icon: '✨' },
  { to: '/app/wallet', label: 'Wallet', icon: '💳' },
]

function Shell({ children }) {
  const { balance, user } = useStore()
  return (
    <div className="shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="logo">📈</span>
          <b>Grow<span className="gradient-text">Gram</span></b>
        </NavLink>
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
            <span className="ic">{n.icon}</span> {n.label}
          </NavLink>
        ))}
        <div style={{ flex: 1 }} />
        <div className="card pad" style={{ padding: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Signed in as</div>
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>{user?.name || 'Demo Creator'}</div>
          <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 2 }}>{money(balance)} balance</div>
        </div>
      </aside>
      <main className="content">{children}</main>
      <nav className="mobile-tabbar">
        {MOBILE_NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="ic">{n.icon}</span>{n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <ToastProvider>
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route
          path="/app/*"
          element={
            <Shell>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="new" element={<NewOrder />} />
                <Route path="services" element={<Services />} />
                <Route path="orders" element={<Orders />} />
                <Route path="studio" element={<Studio />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="referrals" element={<Referrals />} />
                <Route path="*" element={<Navigate to="/app" replace />} />
              </Routes>
            </Shell>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}
