import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { money } from '../lib/helpers'

export default function Topbar({ title, sub }) {
  const { balance } = useStore()
  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <Link to="/app/wallet" className="wallet-pill" title="Wallet balance">
        <span style={{ fontSize: 18 }}>💳</span>
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Balance</div>
          <div className="bal gradient-text">{money(balance)}</div>
        </div>
      </Link>
    </div>
  )
}
