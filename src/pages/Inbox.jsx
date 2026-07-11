import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import Topbar from '../components/Topbar.jsx'
import { timeAgo } from '../lib/helpers'

const SEED = [
  { id: 'growgram.support', name: 'GrowGram Support', avatar: '🛟', verified: true, bio: 'Here to help 24/7' },
  { id: 'ig.growth.coach', name: 'Aanya · Growth Coach', avatar: '🚀', verified: true, bio: 'Reels & algorithm tips' },
  { id: 'reels.editor', name: 'Dev · Reels Editor', avatar: '🎬', bio: 'Edits that go viral' },
  { id: 'brand.deals', name: 'BrandBridge', avatar: '🤝', verified: true, bio: 'Paid collabs & UGC' },
]

const AUTO = {
  'growgram.support': ['Hey! 👋 How can we help you grow today?', 'You can order any service from the New Order tab — need a recommendation?', 'Tip: Non-Drop followers + Power Likes is our most loved combo 🔥'],
  'ig.growth.coach': ['Post 3 Reels/week at 7–9pm for the best reach 📈', 'Want me to audit your last post?', 'Consistency beats virality — trust the process ✨'],
  'reels.editor': ['Send me the raw clip, I’ll turn it around in 24h 🎬', 'Trending audio right now: “aesthetic slowed” 🎵'],
  'brand.deals': ['We have 3 paid collabs open this week 🤝', 'What niche are you in?'],
}

export default function Inbox() {
  const { threads, sendMessage, receiveMessage } = useStore()
  const [active, setActive] = useState(SEED[0].id)
  const [text, setText] = useState('')
  const [contacts, setContacts] = useState(SEED)
  const [newHandle, setNewHandle] = useState('')
  const endRef = useRef(null)

  const thread = threads?.[active] || []
  const contact = contacts.find((c) => c.id === active)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [thread.length, active])

  const send = () => {
    const t = text.trim()
    if (!t) return
    sendMessage(active, t)
    setText('')
    const replies = AUTO[active]
    const reply = replies ? replies[Math.floor(Math.random() * replies.length)] : 'Got it! 🙌'
    setTimeout(() => receiveMessage(active, reply), 900 + Math.random() * 900)
  }

  const startChat = () => {
    const h = newHandle.trim().replace(/^@/, '').replace(/[^\w.]/g, '')
    if (!h) return
    const id = h
    if (!contacts.find((c) => c.id === id)) setContacts((c) => [{ id, name: '@' + h, avatar: '👤', bio: 'New conversation' }, ...c])
    setActive(id); setNewHandle('')
  }

  const lastOf = (id) => {
    const t = threads?.[id]
    return t?.length ? t[t.length - 1] : null
  }

  return (
    <>
      <Topbar title="Inbox" sub="Message anyone — support, coaches, editors, brands, or any @handle you like." />
      <div className="chat-shell card">
        {/* contacts */}
        <div className="chat-list">
          <div className="chat-new">
            <input className="input" style={{ padding: '9px 12px' }} placeholder="Message @anyone…" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && startChat()} />
            <button className="btn sm primary" onClick={startChat}>+</button>
          </div>
          {contacts.map((c) => {
            const last = lastOf(c.id)
            return (
              <button key={c.id} className={'chat-contact' + (active === c.id ? ' active' : '')} onClick={() => setActive(c.id)}>
                <span className="chat-av">{c.avatar}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="row between"><b style={{ fontSize: 13 }}>{c.name} {c.verified && '☑️'}</b>{last && <span style={{ fontSize: 10.5, color: 'var(--muted-2)' }}>{timeAgo(last.at)}</span>}</div>
                  <div className="chat-preview">{last ? (last.from === 'me' ? 'You: ' : '') + last.text : c.bio}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* thread */}
        <div className="chat-main">
          <div className="chat-header">
            <span className="chat-av">{contact?.avatar || '👤'}</span>
            <div><b style={{ fontSize: 14 }}>{contact?.name} {contact?.verified && '☑️'}</b><div style={{ fontSize: 11.5, color: 'var(--green)' }}>● Active now</div></div>
          </div>
          <div className="chat-body">
            {thread.length === 0 && <div className="chat-empty">Say hi to {contact?.name} 👋</div>}
            {thread.map((m, i) => (
              <div key={i} className={'bubble ' + (m.from === 'me' ? 'me' : 'them')}>
                {m.text}
                <span className="bubble-time">{timeAgo(m.at)}</span>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="chat-input">
            <input className="input" placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
            <button className="btn primary" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </>
  )
}
