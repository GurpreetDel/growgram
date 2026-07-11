import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const res = register(form)
    if (res.ok) {
      toast(`Account created — welcome, ${res.account.name.split(' ')[0]}! 🎉`, 'ok')
      navigate('/app/wallet', { replace: true })
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
        <h1>Create your<br /><span className="gradient-text">creator account.</span></h1>
        <p>Register, add funds once, then order any service across every platform. You only pay for what you use.</p>
        <div className="auth-badges">
          <span className="badge">💳 Wallet with UPI</span>
          <span className="badge">📦 Live order tracking</span>
          <span className="badge">✨ AI content studio</span>
        </div>
      </div>

      <div className="auth-card card">
        <h2>Register</h2>
        <p className="auth-sub">Takes 20 seconds. Your data stays in your browser.</p>
        <form onSubmit={submit}>
          <div className="field">
            <label>Full name</label>
            <input className="input" autoFocus value={form.name} onChange={set('name')} placeholder="Your name" />
          </div>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />
          </div>
          <div className="field">
            <label>Phone (optional)</label>
            <input className="input" value={form.phone} onChange={set('phone')} placeholder="+91 ..." />
          </div>
          <div className="field">
            <label>Password</label>
            <input className="input" type="password" value={form.password} onChange={set('password')} placeholder="min 6 characters" />
          </div>
          <button className="btn primary block" type="submit">Create account →</button>
        </form>
        <p className="auth-alt">Already have an account? <Link to="/login" className="gradient-text">Log in</Link></p>
      </div>
    </div>
  )
}
