// A self-contained "AI" content studio. No external API key required — it composes
// captions, hashtags and best-time suggestions from curated pattern banks so the
// panel demonstrates the 2027 "AI growth co-pilot" feel while staying 100% client-side.
// (Swap generateCaption/generateHashtags for a real Claude API call to go live.)

const HOOKS = [
  'POV:', 'The truth about', 'Nobody talks about', 'Stop scrolling —', 'Here’s why',
  'I wish I knew this sooner:', '3 things about', 'Save this for later:', 'Real talk:',
]
const BODIES = [
  'this changed how I think about {t}.',
  '{t} done right actually looks like this.',
  'the {t} glow-up you didn’t know you needed.',
  'small habit, big {t} results.',
  'your {t} journey starts with one bold move.',
]
const CTAS = [
  'Double-tap if you agree ❤️', 'Which one are you? 👇', 'Tag someone who needs this.',
  'Follow for daily {t} tips.', 'Save it before it’s gone. 🔖', 'Drop a 🔥 in the comments.',
]

const TAG_BANK = {
  fitness: ['fitmotivation', 'gymlife', 'workout', 'fitfam', 'healthylifestyle', 'noexcuses', 'fitnessjourney', 'trainhard'],
  food: ['foodie', 'foodporn', 'instafood', 'homecooking', 'recipe', 'yum', 'foodstagram', 'tasty'],
  travel: ['travelgram', 'wanderlust', 'explore', 'travelphotography', 'passportready', 'roamtheplanet', 'travelmore'],
  fashion: ['ootd', 'style', 'fashionista', 'streetstyle', 'lookbook', 'outfitinspo', 'trendy', 'aesthetic'],
  business: ['entrepreneur', 'startup', 'hustle', 'marketing', 'smallbusiness', 'success', 'mindset', 'growth'],
  default: ['viral', 'explorepage', 'trending', 'reels', 'instadaily', 'contentcreator', 'growyourgram', 'foryou'],
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const detectNiche = (topic = '') => {
  const t = topic.toLowerCase()
  if (/gym|fit|workout|health|run/.test(t)) return 'fitness'
  if (/food|cook|recipe|eat|cafe|restaurant/.test(t)) return 'food'
  if (/travel|trip|beach|mountain|city|explore/.test(t)) return 'travel'
  if (/fashion|outfit|style|cloth|wear/.test(t)) return 'fashion'
  if (/business|startup|market|brand|money|sell/.test(t)) return 'business'
  return 'default'
}

export const generateCaption = (topic = 'your content') => {
  const t = topic.trim() || 'your content'
  const hook = pick(HOOKS)
  const body = pick(BODIES).replace('{t}', t)
  const cta = pick(CTAS).replace('{t}', t)
  return `${hook} ${body}\n\n${cta}`
}

export const generateHashtags = (topic = '', count = 12) => {
  const niche = detectNiche(topic)
  const pool = [...new Set([...TAG_BANK[niche], ...TAG_BANK.default])]
  const words = topic.toLowerCase().split(/\s+/).filter((w) => w.length > 2).slice(0, 3)
  const custom = words.map((w) => w.replace(/[^a-z0-9]/g, ''))
  const all = [...new Set([...custom, ...pool])].slice(0, count)
  return all.map((h) => '#' + h)
}

export const bestTimes = () => {
  const slots = [
    { day: 'Mon–Fri', time: '11:00 AM', score: 82 },
    { day: 'Mon–Fri', time: '7:30 PM', score: 94 },
    { day: 'Weekend', time: '10:00 AM', score: 88 },
    { day: 'Weekend', time: '9:00 PM', score: 79 },
  ]
  return slots.sort((a, b) => b.score - a.score)
}

// Fake but sensible "audit" of a handle to power the growth co-pilot card.
export const auditHandle = (handle = '@you') => {
  const seed = [...handle].reduce((a, c) => a + c.charCodeAt(0), 0)
  const rnd = (min, max, salt = 0) => min + ((seed * 9301 + salt * 49297) % 233280) / 233280 * (max - min)
  return {
    handle: handle.startsWith('@') ? handle : '@' + handle,
    engagement: (rnd(1.2, 6.8, 1)).toFixed(2) + '%',
    postingGap: Math.round(rnd(1, 5, 2)) + ' days',
    reelsShare: Math.round(rnd(20, 70, 3)) + '%',
    tips: [
      'Post Reels 4–5× / week — they out-reach static posts ~3×.',
      'Reply to every comment in the first hour to trigger the ranking boost.',
      'Use 8–12 mid-size hashtags, not 30 giant ones.',
      'Keep a consistent posting time so the algorithm learns your audience.',
    ],
  }
}
