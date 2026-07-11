import { Link } from 'react-router-dom'
import { SERVICES } from '../data/services'
import { money, compact } from '../lib/helpers'

const FEATURES = [
  { ic: '⚡', t: 'Instant Auto-Delivery', d: 'Orders start in seconds through our automated fulfilment engine — watch every order fill live on your dashboard.' },
  { ic: '🔁', t: 'Refill & Drip-Feed', d: 'Guaranteed refills up to 365 days and drip-feed scheduling so growth looks natural, never spammy.' },
  { ic: '✨', t: 'AI Content Studio', d: 'Generate captions, viral hashtags and best-time-to-post plans with the built-in growth co-pilot.' },
  { ic: '📈', t: 'Real Analytics', d: 'Track spend, delivery speed, and engagement lift across every campaign in one clean dashboard.' },
  { ic: '💳', t: 'Wallet & 25+ Gateways', d: 'Top up once with UPI, cards or crypto and order in a tap. Auto-refund on partial delivery.' },
  { ic: '🛡️', t: 'Safe & Password-Free', d: 'We never ask for your password. Just paste a public link — your account stays 100% in your control.' },
]

export default function Landing() {
  const topServices = SERVICES.filter((s) => s.tag === 'Popular' || s.tag === 'Best Quality' || s.tag === 'Algorithm Boost').slice(0, 3)
  return (
    <div className="landing">
      <nav className="lnav">
        <div className="brand" style={{ padding: 0 }}>
          <span className="logo">📈</span>
          <b style={{ fontSize: 20 }}>Grow<span className="gradient-text">Gram</span></b>
        </div>
        <div className="row">
          <a className="btn ghost hide-mobile" href="#features">Features</a>
          <a className="btn ghost hide-mobile" href="#pricing">Pricing</a>
          <Link className="btn ghost hide-mobile" to="/login">Log in</Link>
          <Link className="btn primary" to="/register">Get started →</Link>
        </div>
      </nav>

      <header className="hero">
        <span className="pill-tag">🚀 The 2026 all-platform growth panel — reimagined</span>
        <h1>Grow every platform<br /><span className="gradient-text">from one panel.</span></h1>
        <p>
          Instagram, YouTube, TikTok, Spotify, Threads, Snapchat, X, Telegram &amp; more —
          real followers, likes, views, story views, power tiers &amp; geo-targeting across 150+ countries.
          Order in a tap, watch it fill live, and let the algorithm do the rest.
        </p>
        <div className="hero-cta">
          <Link className="btn primary" to="/register" style={{ padding: '14px 26px', fontSize: 15 }}>Create free account</Link>
          <Link className="btn" to="/login" style={{ padding: '14px 26px', fontSize: 15 }}>Log in</Link>
        </div>
        <div className="marquee-strip">
          <span className="badge">🌍 150+ countries</span>
          <span className="badge">🛡️ Non-drop & Power tiers</span>
          <span className="badge">⚡ Live order engine</span>
          <span className="badge">🔁 365-day refill</span>
        </div>
      </header>

      <section id="features">
        <div className="section-title">
          <h2>Everything a creator needs to <span className="gradient-text">go viral</span></h2>
          <p>Built like the tools of 2027 — automated, intelligent, and beautiful.</p>
        </div>
        <div className="grid g3">
          {FEATURES.map((f) => (
            <div key={f.t} className="card feature">
              <div className="fic">{f.ic}</div>
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing">
        <div className="section-title">
          <h2>Transparent, <span className="gradient-text">creator-friendly</span> pricing</h2>
          <p>Pay per 1,000. No subscriptions, no lock-in.</p>
        </div>
        <div className="grid g3">
          {topServices.map((s) => (
            <div key={s.id} className="card feature">
              <span className="badge grad" style={{ alignSelf: 'flex-start' }}>{s.tag}</span>
              <h3 style={{ marginTop: 14 }}>{s.name}</h3>
              <div style={{ fontSize: 34, fontWeight: 800, margin: '6px 0' }} className="gradient-text">{money(s.price)}</div>
              <p style={{ marginBottom: 14 }}>per 1,000 · {s.refill} refill · up to {compact(s.max)}</p>
              <Link className="btn primary block" to="/app/new">Order now</Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="card pad" style={{ marginTop: 60, textAlign: 'center', padding: '48px 24px', background: 'var(--ig-soft)' }}>
          <h2 style={{ fontSize: 32, margin: '0 0 12px' }}>Ready to grow?</h2>
          <p style={{ color: 'var(--muted)', margin: '0 auto 24px', maxWidth: 480 }}>
            Create your account, top up your wallet once, and order across <b className="gradient-text">every platform</b> in a tap.
          </p>
          <Link className="btn primary" to="/register" style={{ padding: '14px 28px', fontSize: 15 }}>Create your account →</Link>
        </div>
      </section>

      <footer className="footer">
        <p>GrowGram · A next-gen Instagram SMM panel demo · Built for education &amp; portfolio use.</p>
        <p style={{ marginTop: 6 }}>Not affiliated with Instagram / Meta. All fulfilment is simulated in this demo.</p>
      </footer>
    </div>
  )
}
