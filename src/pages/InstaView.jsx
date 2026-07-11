import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Topbar from '../components/Topbar.jsx'
import { serviceById } from '../data/services'
import { compact } from '../lib/helpers'

// A live Instagram-style profile that grows from your real orders, plus a full
// "profile intelligence" layer: level, grade, rank, coins, social graph, recent
// visitors, and a head-to-head comparison with the biggest accounts on Earth.

const POSTS = [
  { id: 1, emoji: '🏋️', grad: 'linear-gradient(135deg,#fa7e1e,#d62976)', base: { likes: 1240, views: 18200 }, reel: false },
  { id: 2, emoji: '🌊', grad: 'linear-gradient(135deg,#4f5bd5,#962fbf)', base: { likes: 3320, views: 45200 }, reel: true },
  { id: 3, emoji: '🍜', grad: 'linear-gradient(135deg,#22d18c,#4f5bd5)', base: { likes: 890, views: 12100 }, reel: false },
  { id: 4, emoji: '🎧', grad: 'linear-gradient(135deg,#d62976,#4f5bd5)', base: { likes: 5100, views: 98200 }, reel: true },
  { id: 5, emoji: '📸', grad: 'linear-gradient(135deg,#feda75,#fa7e1e)', base: { likes: 2110, views: 30400 }, reel: false },
  { id: 6, emoji: '🚀', grad: 'linear-gradient(135deg,#962fbf,#d62976)', base: { likes: 7420, views: 152000 }, reel: true },
  { id: 7, emoji: '☕', grad: 'linear-gradient(135deg,#fa7e1e,#feda75)', base: { likes: 640, views: 8900 }, reel: false },
  { id: 8, emoji: '🏔️', grad: 'linear-gradient(135deg,#4f5bd5,#22d18c)', base: { likes: 1980, views: 26700 }, reel: false },
  { id: 9, emoji: '💃', grad: 'linear-gradient(135deg,#d62976,#feda75)', base: { likes: 9100, views: 240000 }, reel: true },
]

const CELEBS = [
  { name: 'Cristiano Ronaldo', handle: '@cristiano', followers: 645000000, flag: '🇵🇹' },
  { name: 'Lionel Messi', handle: '@leomessi', followers: 505000000, flag: '🇦🇷' },
  { name: 'Selena Gomez', handle: '@selenagomez', followers: 429000000, flag: '🇺🇸' },
  { name: 'Kylie Jenner', handle: '@kyliejenner', followers: 400000000, flag: '🇺🇸' },
  { name: 'Taylor Swift', handle: '@taylorswift', followers: 283000000, flag: '🇺🇸' },
  { name: 'Virat Kohli', handle: '@virat.kohli', followers: 271000000, flag: '🇮🇳' },
  { name: 'MrBeast', handle: '@mrbeast', followers: 65000000, flag: '🇺🇸' },
]

const VISITOR_POOL = [
  ['aesthetic.arch', '👩‍🎨'], ['gymshark.raj', '💪'], ['wanderlust.maya', '✈️'], ['crypto.karan', '📈'],
  ['foodie.fern', '🍜'], ['reels.factory', '🎬'], ['brand.scout', '🤝'], ['viral.vibes', '🔥'],
  ['codewithalok', '💻'], ['music.drops', '🎧'], ['streetstyle.sam', '🧥'], ['travel.tara', '🌴'],
]

function tierFor(followers) {
  if (followers >= 1_000_000) return { grade: 'S', level: 99, label: 'Icon', color: '#feda75', next: 1_000_000 }
  if (followers >= 500_000) return { grade: 'A+', level: 80, label: 'Mega Creator', color: '#fa7e1e', next: 1_000_000 }
  if (followers >= 100_000) return { grade: 'A', level: 60, label: 'Macro Creator', color: '#d62976', next: 500_000 }
  if (followers >= 25_000) return { grade: 'B', level: 40, label: 'Rising Creator', color: '#962fbf', next: 100_000 }
  if (followers >= 5_000) return { grade: 'C', level: 22, label: 'Micro Creator', color: '#4f5bd5', next: 25_000 }
  return { grade: 'D', level: 8, label: 'Newcomer', color: '#7db4ff', next: 5_000 }
}

const HANDLE_KEY = 'growgram.instaview.handle'

export default function InstaView() {
  const { orders, transactions } = useStore()
  const toast = useToast()
  const [handle, setHandle] = useState(() => localStorage.getItem(HANDLE_KEY) || 'growgram.demo')
  const [tab, setTab] = useState('grid')
  const [following, setFollowing] = useState(false)
  const [visitors, setVisitors] = useState(() => VISITOR_POOL.slice(0, 6))

  useEffect(() => localStorage.setItem(HANDLE_KEY, handle), [handle])

  useEffect(() => {
    const t = setInterval(() => {
      setVisitors((v) => {
        const next = VISITOR_POOL[Math.floor(Math.random() * VISITOR_POOL.length)]
        if (v[0][0] === next[0]) return v
        return [next, ...v].slice(0, 6)
      })
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const delivered = useMemo(() => {
    const t = { followers: 0, likes: 0, views: 0, comments: 0 }
    orders.forEach((o) => {
      const cat = serviceById(o.serviceId)?.cat || ''
      if (cat.includes('followers') || cat.includes('subs') || cat.includes('members')) t.followers += o.delivered
      else if (cat.includes('likes')) t.likes += o.delivered
      else if (cat.includes('views') || cat.includes('story')) t.views += o.delivered
      else if (cat.includes('comments')) t.comments += o.delivered
    })
    return t
  }, [orders])

  const followers = 12400 + delivered.followers
  const following_ct = 412
  const friends = Math.round(following_ct * 0.34)
  const groups = 7 + Math.floor(delivered.followers / 5000)
  const mutuals = Math.min(following_ct, 180 + Math.floor(delivered.followers / 800))
  const spent = transactions.filter((t) => t.type === 'Order').reduce((a, t) => a + Math.abs(t.amount), 0)
  const coins = Math.floor(spent * 2 + delivered.likes / 10 + delivered.followers / 5)
  const tier = tierFor(followers)
  const rank = Math.max(1, Math.round(48_000_000 / Math.pow(followers, 0.82)))

  const totalBaseLikes = POSTS.reduce((a, p) => a + p.base.likes, 0)
  const postLikes = (p) => p.base.likes + Math.floor(delivered.likes * (p.base.likes / totalBaseLikes))
  const postViews = (p) => p.base.views + Math.floor(delivered.views * (p.base.likes / totalBaseLikes))

  const prevFollowers = useRef(followers)
  const [floaters, setFloaters] = useState([])
  useEffect(() => {
    const diff = followers - prevFollowers.current
    prevFollowers.current = followers
    if (diff > 0) {
      const id = Math.random().toString(36).slice(2)
      setFloaters((f) => [...f.slice(-4), { id, text: `+${diff.toLocaleString('en-IN')}` }])
      setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1800)
    }
  }, [followers])

  const activeOrders = orders.filter((o) => o.status === 'In progress' || o.status === 'Pending')
  const nextCeleb = [...CELEBS].reverse().find((c) => c.followers > followers) || CELEBS[0]
  const tierPct = Math.min(100, Math.round((followers / tier.next) * 100))

  return (
    <>
      <Topbar title="My Profile" sub="Your live profile + full intelligence: rank, grade, coins, visitors and how you stack up against the world." />

      <div className="grid" style={{ gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: 20, alignItems: 'start' }}>
        {/* ============ PHONE ============ */}
        <div className="phone">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="ig-header">
              <input className="ig-handle" value={handle} onChange={(e) => setHandle(e.target.value.replace(/[^\w.]/g, ''))} spellCheck={false} />
              <span style={{ fontSize: 18 }}>☰</span>
            </div>
            <div className="ig-profile">
              <div style={{ position: 'relative' }}>
                <div className="ig-avatar">📈</div>
                {floaters.map((f) => <span key={f.id} className="ig-floater">{f.text}</span>)}
              </div>
              <div className="ig-stats">
                <div><b>{POSTS.length * 14}</b><span>Posts</span></div>
                <div><b className="tick-up">{compact(followers)}</b><span>Followers</span></div>
                <div><b>{following_ct}</b><span>Following</span></div>
              </div>
            </div>
            <div style={{ padding: '0 16px', fontSize: 12.5, lineHeight: 1.5 }}>
              <b>{handle} ✨</b>
              <div style={{ color: 'var(--muted)' }}>Grade <b style={{ color: tier.color }}>{tier.grade}</b> · {tier.label} · Growing with GrowGram 🚀</div>
            </div>
            <div className="row" style={{ gap: 8, padding: '10px 16px' }}>
              <button className={'btn sm block' + (following ? '' : ' primary')} onClick={() => setFollowing(!following)}>{following ? 'Following ✓' : 'Follow'}</button>
              <Link className="btn sm block" to="/app/inbox">Message</Link>
            </div>
            <div className="ig-tabs">
              <button className={tab === 'grid' ? 'active' : ''} onClick={() => setTab('grid')}>▦ Posts</button>
              <button className={tab === 'reels' ? 'active' : ''} onClick={() => setTab('reels')}>▶ Reels</button>
            </div>
            <div className="ig-grid">
              {POSTS.filter((p) => tab === 'grid' || p.reel).map((p) => (
                <div key={p.id} className="ig-cell" style={{ background: p.grad }} onClick={() => toast(`❤️ ${compact(postLikes(p))} · ▶ ${compact(postViews(p))}`, 'ok')}>
                  <span>{p.emoji}</span>
                  <div className="ig-cell-overlay">
                    <span>❤️ {compact(postLikes(p))}</span>
                    {p.reel && <span>▶ {compact(postViews(p))}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ INTELLIGENCE ============ */}
        <div className="grid" style={{ gap: 16 }}>
          <div className="grid g4" style={{ gap: 12 }}>
            <div className="card stat"><span className="k">🏅 Grade</span><div className="v" style={{ color: tier.color }}>{tier.grade}</div><div className="delta" style={{ color: 'var(--muted)' }}>{tier.label}</div></div>
            <div className="card stat"><span className="k">⭐ Level</span><div className="v">{tier.level}</div><div className="delta" style={{ color: 'var(--muted)' }}>XP from growth</div></div>
            <div className="card stat"><span className="k">🌐 Global rank</span><div className="v gradient-text">#{rank.toLocaleString('en-IN')}</div><div className="delta" style={{ color: 'var(--muted)' }}>climbs as you grow</div></div>
            <div className="card stat"><span className="k">🪙 GrowCoins</span><div className="v">{compact(coins)}</div><div className="delta"><Link to="/app/wallet" className="gradient-text">Recharge →</Link></div></div>
          </div>

          <div className="card pad">
            <div className="row between" style={{ marginBottom: 8 }}>
              <b>Progress to next tier</b>
              <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{compact(followers)} / {compact(tier.next)} followers</span>
            </div>
            <div className="progress lg"><span style={{ width: tierPct + '%' }} /></div>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '10px 0 0' }}>
              Place follower orders to level up — every delivery raises your grade, level and global rank in real time.
            </p>
          </div>

          <div className="card pad">
            <span className="badge grad" style={{ marginBottom: 12 }}>🕸️ Social graph</span>
            <div className="grid g4" style={{ gap: 10 }}>
              {[['Followers', compact(followers), '👥'], ['Following', following_ct, '➡️'], ['Friends', friends, '🤝'], ['Mutuals', mutuals, '♾️'], ['Groups', groups, '👨‍👩‍👧'], ['Likes', compact(delivered.likes || 0), '❤️'], ['Views', compact(delivered.views || 0), '▶️'], ['Comments', compact(delivered.comments || 0), '💬']].map(([k, v, ic]) => (
                <div key={k} className="card" style={{ padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 18 }}>{ic}</div>
                  <div style={{ fontWeight: 800, fontSize: 18 }} className="tick-up">{v}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{k}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card pad">
            <div className="row between" style={{ marginBottom: 4 }}>
              <span className="badge grad">⚔️ Compare with the world</span>
              <Link className="btn sm primary" to="/app/new?cat=ig_followers">Close the gap →</Link>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '6px 0 14px' }}>You’re <b style={{ color: 'var(--text)' }}>#{rank.toLocaleString('en-IN')}</b> globally. Here’s how you stack up against the biggest accounts on Earth:</p>
            <div className="grid" style={{ gap: 10 }}>
              <CompareRow label={`You (${handle})`} value={followers} max={CELEBS[0].followers} me />
              {CELEBS.map((c) => <CompareRow key={c.handle} label={`${c.flag} ${c.name}`} sub={c.handle} value={c.followers} max={CELEBS[0].followers} />)}
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted-2)', margin: '12px 0 0' }}>
              You need <b style={{ color: 'var(--text)' }}>{compact(nextCeleb.followers - followers)}</b> more followers to overtake {nextCeleb.name}.
            </p>
          </div>

          <div className="card pad">
            <span className="badge grad" style={{ marginBottom: 12 }}>👀 Recent visitors</span>
            <div className="row wrap" style={{ gap: 10 }}>
              {visitors.map((v, i) => (
                <div key={v[0] + i} className="visitor" title={'@' + v[0]}>
                  <span className="visitor-av">{v[1]}</span>
                  <span style={{ fontSize: 11.5 }}>@{v[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card pad">
            <div className="row between" style={{ marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>⚡ Orders feeding this profile</h3>
              <Link className="btn sm primary" to="/app/new">+ Boost</Link>
            </div>
            {activeOrders.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>No active orders. Place one and watch this profile climb live.</p>
            ) : (
              <div className="grid" style={{ gap: 10 }}>
                {activeOrders.slice(0, 5).map((o) => {
                  const pct = Math.round((o.delivered / o.qty) * 100)
                  return (
                    <div key={o.id}>
                      <div className="row between" style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>{o.serviceName.split('—')[0].trim()}</span>
                        <span style={{ fontSize: 12, color: 'var(--amber)' }} className="pulse">⚡ {pct}%</span>
                      </div>
                      <div className="progress"><span style={{ width: pct + '%' }} /></div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function CompareRow({ label, sub, value, max, me }) {
  const pct = Math.max(1.5, (value / max) * 100)
  return (
    <div>
      <div className="row between" style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: me ? 800 : 600, color: me ? 'var(--text)' : 'var(--muted)' }}>
          {label} {sub && <span style={{ color: 'var(--muted-2)', fontWeight: 400 }}>{sub}</span>}
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 700 }}>{compact(value)}</span>
      </div>
      <div className="progress"><span style={{ width: pct + '%', background: me ? 'var(--ig)' : 'rgba(255,255,255,.25)' }} /></div>
    </div>
  )
}
