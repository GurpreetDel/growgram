import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Topbar from '../components/Topbar.jsx'
import { money } from '../lib/helpers'

export default function Referrals() {
  const { referralCode, referralEarnings, resetDemo } = useStore()
  const toast = useToast()
  const link = `https://growgram.app/join?ref=${referralCode}`

  const copy = (text, what) => {
    navigator.clipboard?.writeText(text)
    toast(`${what} copied 📋`, 'ok')
  }

  return (
    <>
      <Topbar title="Refer & Earn" sub="Earn 5% of every top-up your friends make — forever." />

      <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className="card pad" style={{ background: 'var(--ig-soft)' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎁</div>
          <h3 style={{ margin: '0 0 6px', fontSize: 20 }}>Your referral code</h3>
          <p style={{ color: 'var(--muted)', marginTop: 0 }}>Share it — you both win.</p>

          <div className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, letterSpacing: '.05em' }} className="gradient-text">{referralCode}</span>
            <button className="btn sm primary" onClick={() => copy(referralCode, 'Code')}>Copy</button>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <input className="input" readOnly value={link} />
            <button className="btn" onClick={() => copy(link, 'Link')}>Copy link</button>
          </div>
        </div>

        <div className="grid" style={{ gap: 16 }}>
          <div className="card stat">
            <span className="k">💰 Referral earnings</span>
            <div className="v gradient-text">{money(referralEarnings)}</div>
            <div className="delta">5% of every friend's top-up</div>
          </div>
          <div className="card pad">
            <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>How it works</h3>
            <ol style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)', fontSize: 14, lineHeight: 1.9 }}>
              <li>Share your code with fellow creators.</li>
              <li>They get <b style={{ color: 'var(--text)' }}>₹100 bonus</b> on first top-up.</li>
              <li>You earn <b style={{ color: 'var(--text)' }}>5% commission</b> on all their top-ups, for life.</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="card pad" style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700 }}>Reset demo data</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Clear all orders, wallet and history back to defaults.</div>
        </div>
        <button className="btn ghost" onClick={() => { resetDemo(); toast('Demo reset ✅', 'ok') }}>Reset panel</button>
      </div>
    </>
  )
}
