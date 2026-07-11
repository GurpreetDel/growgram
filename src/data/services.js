// GrowGram service catalogue.
// Prices are "per 1000" in the panel's demo currency (₹). Every service carries the
// metadata a real SMM panel exposes: min/max quantity, refill window, drop rate,
// average speed and whether it supports drip-feed.

export const CATEGORIES = [
  { id: 'ig_followers', label: 'Instagram Followers', icon: '👥', platform: 'Instagram' },
  { id: 'ig_likes', label: 'Instagram Likes', icon: '❤️', platform: 'Instagram' },
  { id: 'ig_views', label: 'Instagram Views & Reels', icon: '▶️', platform: 'Instagram' },
  { id: 'ig_comments', label: 'Instagram Comments', icon: '💬', platform: 'Instagram' },
  { id: 'ig_story', label: 'Instagram Story / Live', icon: '⚡', platform: 'Instagram' },
]

export const SERVICES = [
  // ---- Followers ----
  { id: 1001, cat: 'ig_followers', name: 'Instagram Followers — Bot [Instant]', price: 30, min: 100, max: 100000, refill: 'No', drop: '~40%', speed: '50K/day', quality: 'Bot', dripfeed: true, tag: 'Cheapest' },
  { id: 1002, cat: 'ig_followers', name: 'Instagram Followers — HQ [30d Refill]', price: 65, min: 100, max: 200000, refill: '30 Days', drop: '~15%', speed: '25K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 1003, cat: 'ig_followers', name: 'Instagram Followers — Real Mix [99d Refill]', price: 110, min: 50, max: 500000, refill: '99 Days', drop: '~8%', speed: '15K/day', quality: 'Real Mix', dripfeed: true },
  { id: 1004, cat: 'ig_followers', name: 'Instagram Followers — Premium Real [365d Refill]', price: 190, min: 50, max: 300000, refill: '365 Days', drop: '~3%', speed: '10K/day', quality: 'Premium', dripfeed: true, tag: 'Best Quality' },
  { id: 1005, cat: 'ig_followers', name: 'Instagram Followers — Indian Real Active [Lifetime]', price: 240, min: 50, max: 100000, refill: 'Lifetime', drop: '~2%', speed: '5K/day', quality: 'Targeted', dripfeed: true, tag: 'Geo-Targeted' },

  // ---- Likes ----
  { id: 2001, cat: 'ig_likes', name: 'Instagram Likes — Instant Bot', price: 12, min: 20, max: 100000, refill: 'No', drop: '~20%', speed: '100K/day', quality: 'Bot', dripfeed: true, tag: 'Cheapest' },
  { id: 2002, cat: 'ig_likes', name: 'Instagram Likes — Real HQ [Refill]', price: 28, min: 20, max: 200000, refill: '30 Days', drop: '~5%', speed: '50K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 2003, cat: 'ig_likes', name: 'Instagram Likes — Power (Verified Accounts)', price: 70, min: 20, max: 50000, refill: '60 Days', drop: '~2%', speed: '20K/day', quality: 'Premium', dripfeed: true },

  // ---- Views / Reels ----
  { id: 3001, cat: 'ig_views', name: 'Instagram Video Views', price: 6, min: 100, max: 10000000, refill: 'No', drop: '0%', speed: '1M/day', quality: 'HQ', dripfeed: true, tag: 'Cheapest' },
  { id: 3002, cat: 'ig_views', name: 'Instagram Reels Views [Boosted]', price: 9, min: 100, max: 10000000, refill: 'No', drop: '0%', speed: '2M/day', quality: 'HQ', dripfeed: true, tag: 'Popular' },
  { id: 3003, cat: 'ig_views', name: 'Instagram Reels Views + Saves + Reach', price: 45, min: 100, max: 1000000, refill: 'No', drop: '0%', speed: '500K/day', quality: 'Premium', dripfeed: true, tag: 'Algorithm Boost' },

  // ---- Comments ----
  { id: 4001, cat: 'ig_comments', name: 'Instagram Custom Comments (You Provide Text)', price: 260, min: 10, max: 10000, refill: 'No', drop: '~5%', speed: '2K/day', quality: 'Real', dripfeed: false, tag: 'Custom' },
  { id: 4002, cat: 'ig_comments', name: 'Instagram Random Positive Comments', price: 150, min: 10, max: 20000, refill: 'No', drop: '~5%', speed: '5K/day', quality: 'Real', dripfeed: false },
  { id: 4003, cat: 'ig_comments', name: 'Instagram Emoji Comments', price: 90, min: 10, max: 20000, refill: 'No', drop: '~5%', speed: '5K/day', quality: 'Real', dripfeed: false },

  // ---- Story / Live ----
  { id: 5001, cat: 'ig_story', name: 'Instagram Story Views (All Stories)', price: 18, min: 100, max: 500000, refill: 'No', drop: '0%', speed: '200K/day', quality: 'HQ', dripfeed: false },
  { id: 5002, cat: 'ig_story', name: 'Instagram Live Video Viewers (15 min)', price: 320, min: 50, max: 20000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'HQ', dripfeed: false, tag: 'Live' },
  { id: 5003, cat: 'ig_story', name: 'Instagram Story Poll Votes', price: 60, min: 50, max: 50000, refill: 'No', drop: '0%', speed: '20K/day', quality: 'Real', dripfeed: false },
]

export const serviceById = (id) => SERVICES.find((s) => s.id === Number(id))
export const categoryById = (id) => CATEGORIES.find((c) => c.id === id)
