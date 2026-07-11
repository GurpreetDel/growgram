import { useState } from 'react'
import Topbar from '../components/Topbar.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { generateCaption, generateHashtags, bestTimes } from '../lib/aiStudio'

export default function Studio() {
  const toast = useToast()
  const [topic, setTopic] = useState('')
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState([])
  const [thinking, setThinking] = useState(false)
  const times = bestTimes()

  const run = () => {
    if (!topic.trim()) return toast('Tell the AI what your post is about', 'err')
    setThinking(true)
    setTimeout(() => {
      setCaption(generateCaption(topic))
      setTags(generateHashtags(topic, 14))
      setThinking(false)
    }, 700)
  }

  const copy = (text, what) => {
    navigator.clipboard?.writeText(text)
    toast(`${what} copied to clipboard 📋`, 'ok')
  }

  return (
    <>
      <Topbar title="AI Content Studio" sub="Your growth co-pilot — captions, hashtags & timing in one click." />

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <div className="card pad">
          <span className="badge grad" style={{ marginBottom: 12 }}>✨ Generate</span>
          <div className="field">
            <label>What's your post about?</label>
            <textarea
              className="input"
              rows={3}
              placeholder="e.g. my new home gym routine for busy people"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="row wrap" style={{ gap: 6, marginBottom: 14 }}>
            {['fitness transformation', 'street food tour', 'solo travel diary', 'startup founder tips'].map((s) => (
              <button key={s} className="btn sm ghost" onClick={() => setTopic(s)}>{s}</button>
            ))}
          </div>
          <button className="btn primary block" onClick={run} disabled={thinking}>
            {thinking ? '✨ Thinking…' : '✨ Generate caption + hashtags'}
          </button>

          {caption && (
            <div style={{ marginTop: 18 }}>
              <div className="row between" style={{ marginBottom: 6 }}>
                <label style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>CAPTION</label>
                <button className="btn sm ghost" onClick={() => copy(caption, 'Caption')}>Copy</button>
              </div>
              <div className="card" style={{ padding: 14, whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 14 }}>{caption}</div>

              <div className="row between" style={{ margin: '16px 0 6px' }}>
                <label style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 600 }}>HASHTAGS</label>
                <button className="btn sm ghost" onClick={() => copy(tags.join(' '), 'Hashtags')}>Copy all</button>
              </div>
              <div className="row wrap" style={{ gap: 6 }}>
                {tags.map((t) => (
                  <span key={t} className="badge" style={{ cursor: 'pointer' }} onClick={() => copy(t, t)}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid" style={{ gap: 16 }}>
          <div className="card pad">
            <span className="badge grad" style={{ marginBottom: 12 }}>⏰ Best time to post</span>
            <div className="grid g2" style={{ gap: 10 }}>
              {times.map((t, i) => (
                <div key={i} className="card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.day}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, margin: '2px 0 8px' }}>{t.time}</div>
                  <div className="progress"><span style={{ width: t.score + '%' }} /></div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{t.score}% reach score</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card pad">
            <span className="badge grad" style={{ marginBottom: 12 }}>🚀 Growth playbook</span>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)', fontSize: 14, lineHeight: 1.9 }}>
              <li>Post <b style={{ color: 'var(--text)' }}>Reels 4–5×/week</b> — they out-reach static posts ~3×.</li>
              <li>Hook viewers in the <b style={{ color: 'var(--text)' }}>first 3 seconds</b> or they scroll.</li>
              <li>Reply to every comment in the <b style={{ color: 'var(--text)' }}>first hour</b> to trigger ranking.</li>
              <li>Pair organic content with a <b style={{ color: 'var(--text)' }}>drip-feed order</b> for natural-looking lift.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
