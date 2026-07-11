import { Routes, Route, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ToastProvider } from './context/ToastContext.jsx'
import { useStore } from './context/StoreContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { money } from './lib/helpers'

import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewOrder from './pages/NewOrder.jsx'
import Services from './pages/Services.jsx'
import Orders from './pages/Orders.jsx'
import Wallet from './pages/Wallet.jsx'
import Studio from './pages/Studio.jsx'
import Analytics from './pages/Analytics.jsx'
import Referrals from './pages/Referrals.jsx'
import Explore from './pages/Explore.jsx'
import Inbox from './pages/Inbox.jsx'
import Profile from './pages/InstaView.jsx'
import Admin from './pages/Admin.jsx'
import ApiPage from './pages/ApiPage.jsx'

const USER_NAV = [
  { to: '/app', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/app/new', label: 'New Order', icon: '➕' },
  { to: '/app/services', label: 'Services', icon: '🗂️' },
  { to: '/app/explore', label: 'Explore', icon: '🌍' },
  { to: '/app/orders', label: 'Orders', icon: '📦' },
  { to: '/app/profile', label: 'My Profile', icon: '👤' },
  { to: '/app/inbox', label: 'Inbox', icon: '💬' },
  { to: '/app/studio', label: 'AI Studio', icon: '✨' },
  { to: '/app/analytics', label: 'Analytics', icon: '📈' },
  { to: '/app/wallet', label: 'Wallet', icon: '💳' },
  { to: '/app/referrals', label: 'Refer & Earn', icon: '🎁' },
]

const ADMIN_EXTRA = [
  { to: '/app/admin', label: 'Admin Panel', icon: '🛡️' },
  { to: '/app/api', label: 'API & Providers', icon: '🔌' },
]

const MOBILE_NAV = [
  { to: '/app', label: 'Home', icon: '🏠', end: true },
  { to: '/app/services', label: 'Services', icon: '🗂️' },
  { to: '/app/explore', label: 'Explore', icon: '🌍' },
  { to: '/app/orders', label: 'Orders', icon: '📦' },
  { to: '/app/wallet', label: 'Wallet', icon: '💳' },
]

function AccountMenu() {
  const { account, isAdmin, logout } = useAuth()
  const { balance } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const initials = (account?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="acct" onMouseLeave={() => setOpen(false)}>
      <button className="acct-btn" onClick={() => setOpen((o) => !o)}>
        <span className={'acct-av' + (isAdmin ? ' admin' : '')}>{isAdmin ? '👑' : initials}</span>
        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{account?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>{money(balance)}</div>
        </div>
      </button>
      {open && (
        <div className="acct-menu card">
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--stroke)' }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{account?.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{account?.email}</div>
            <span className={'badge' + (isAdmin ? ' grad' : '')} style={{ marginTop: 8, fontSize: 10 }}>{isAdmin ? '👑 Panel Owner' : '🧑‍🎓 Member'}</span>
          </div>
          <button className="acct-item" onClick={() => { setOpen(false); navigate('/app/wallet') }}>💳 Wallet</button>
          <button className="acct-item" onClick={() => { setOpen(false); navigate('/app/profile') }}>👤 My Profile</button>
          <button className="acct-item danger" onClick={() => { logout(); navigate('/') }}>🚪 Log out</button>
        </div>
      )}
    </div>
  )
}

function Shell({ children }) {
  const { isAdmin } = useAuth()
  const nav = isAdmin ? [...USER_NAV, ...ADMIN_EXTRA] : USER_NAV
  return (
    <div className="shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="logo">📈</span>
          <b>Grow<span className="gradient-text">Gram</span></b>
        </NavLink>
        <div className="sidebar-scroll">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
              <span className="ic">{n.icon}</span> {n.label}
            </NavLink>
          ))}
        </div>
        <AccountMenu />
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

function RequireAuth({ children }) {
  const { isAuthed } = useAuth()
  const location = useLocation()
  if (!isAuthed) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

function RequireAdmin({ children }) {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/app" replace />
  return children
}

export default function App() {
  const location = useLocation()
  const { isAuthed } = useAuth()
  return (
    <ToastProvider>
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isAuthed ? <Navigate to="/app" replace /> : <Login />} />
        <Route path="/register" element={isAuthed ? <Navigate to="/app" replace /> : <Register />} />
        <Route
          path="/app/*"
          element={
            <RequireAuth>
              <Shell>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="new" element={<NewOrder />} />
                  <Route path="services" element={<Services />} />
                  <Route path="explore" element={<Explore />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="inbox" element={<Inbox />} />
                  <Route path="studio" element={<Studio />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="wallet" element={<Wallet />} />
                  <Route path="referrals" element={<Referrals />} />
                  <Route path="admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
                  <Route path="api" element={<RequireAdmin><ApiPage /></RequireAdmin>} />
                  <Route path="*" element={<Navigate to="/app" replace />} />
                </Routes>
              </Shell>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}
