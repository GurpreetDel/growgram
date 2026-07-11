import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const res = login(id, pw)
    if (res.ok) {
      toast(`Welcome back, ${res.account.name.split(' ')[0]}! ${res.account.role === 'admin' ? '👑' : '👋'}`, 'ok')
      navigate(location.state?.from || '/app', { replace: true })
    } else {
      toast(res.error, 'err')
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-art">
        <Link to="/" className="brand" style={{ padding: 0 }}>
          <span className="logo">📈</span>
          <b style={{ fontSize: 22 }}>Grow<span className="gradient-text">Gram</span></b>
        </Link>
        <h1>Grow every platform<br /><span className="gradient-text">from one panel.</span></h1>
        <p>Instagram, YouTube, TikTok, Spotify, Threads, Snapchat &amp; more — real services, live delivery, one wallet.</p>
        <div className="auth-badges">
          <span className="badge">🌍 150+ countries</span>
          <span className="badge">🛡️ Non-drop & power tiers</span>
          <span className="badge">⚡ Live order engine</span>
        </div>
      </div>

      <div className="auth-card card">
        <h2>Log in</h2>
        <p className="auth-sub">Members log in with email. Panel owner logs in with username <b>admin</b>.</p>
        <form onSubmit={submit}>
          <div className="field">
            <label>Email or username</label>
            <input className="input" autoFocus value={id} onChange={(e) => setId(e.target.value)} placeholder="you@email.com  ·  or  admin" />
          </div>
          <div className="field">
            <label>Password</label>
            <div className="pw-row">
              <input className="input" type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
              <button type="button" className="btn sm ghost" onClick={() => setShow((s) => !s)}>{show ? '🙈' : '👁️'}</button>
            </div>
          </div>
          <button className="btn primary block" type="submit" style={{ marginTop: 4 }}>Log in →</button>
        </form>
        <p className="auth-alt">New here? <Link to="/register" className="gradient-text">Create an account</Link></p>
      </div>
    </div>
  )
}
