import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Topbar from '../components/Topbar.jsx'
import { money, timeAgo } from '../lib/helpers'

const METHODS = [
  { id: 'UPI', label: 'UPI', icon: '📱' },
  { id: 'Card', label: 'Card', icon: '💳' },
  { id: 'Crypto', label: 'Crypto', icon: '₿' },
  { id: 'PayPal', label: 'PayPal', icon: '🅿️' },
]
const PRESETS = [100, 500, 1000, 2500, 5000]

export default function Wallet() {
  const { balance, transactions, addFunds } = useStore()
  const toast = useToast()
  const [amount, setAmount] = useState(500)
  const [method, setMethod] = useState('UPI')
  const [busy, setBusy] = useState(false)

  const topUp = () => {
    if (!amount || amount <= 0) return toast('Enter a valid amount', 'err')
    setBusy(true)
    // simulate a gateway round-trip
    setTimeout(() => {
      const bonus = amount >= 2500 ? Math.round(amount * 0.1) : 0
      const res = addFunds(Number(amount) + bonus, method + (bonus ? ' (+10% bonus)' : ''))
      setBusy(false)
      if (res.ok) toast(`Added ${money(Number(amount) + bonus)} via ${method} ✅`, 'ok')
      else toast(res.error, 'err')
    }, 900)
  }

  return (
    <>
      <Topbar title="Wallet" sub="Top up once, order in a tap. 10% bonus on ₹2,500+." />

      <div className="grid" style={{ gridTemplateColumns: '1fr 1.3fr', gap: 16, alignItems: 'start' }}>
        <div className="card pad">
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Current balance</div>
          <div className="gradient-text" style={{ fontSize: 42, fontWeight: 800, margin: '4px 0 20px' }}>{money(balance)}</div>

          <div className="field">
            <label>Payment method</label>
            <div className="row wrap" style={{ gap: 8 }}>
              {METHODS.map((m) => (
                <button key={m.id} className={'btn sm' + (method === m.id ? ' primary' : '')} onClick={() => setMethod(m.id)}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Amount (₹)</label>
            <input className="input" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <div className="row wrap" style={{ gap: 6, marginTop: 6 }}>
              {PRESETS.map((p) => (
                <button key={p} className="btn sm ghost" onClick={() => setAmount(p)}>{money(p).replace('.00', '')}</button>
              ))}
            </div>
          </div>

          {amount >= 2500 && (
            <div className="badge grad" style={{ marginBottom: 12 }}>🎉 +10% bonus = +{money(Math.round(amount * 0.1))}</div>
          )}

          <button className="btn primary block" onClick={topUp} disabled={busy}>
            {busy ? 'Processing…' : `Add ${money(amount || 0)}`}
          </button>
          <p style={{ fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', marginTop: 10 }}>
            Demo gateway — no real charge is made.
          </p>
        </div>

        <div className="card pad">
          <h3 style={{ margin: '0 0 12px', fontSize: 17 }}>Transaction history</h3>
          {transactions.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No transactions yet.</p>
          ) : (
            <table className="table">
              <thead><tr><th>Type</th><th className="hide-mobile">Note</th><th>When</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.type}</td>
                    <td className="hide-mobile" style={{ color: 'var(--muted)', fontFamily: t.type === 'Order' ? 'monospace' : 'inherit', fontSize: 12 }}>{t.note}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{timeAgo(t.at)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: t.amount >= 0 ? 'var(--green)' : 'var(--text)' }}>
                      {t.amount >= 0 ? '+' : '−'}{money(Math.abs(t.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
