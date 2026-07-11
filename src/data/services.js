// GrowGram service catalogue.
// Prices are "per 1000" in the panel's demo currency (₹). Every service carries the
// metadata a real SMM panel exposes: min/max quantity, refill window, drop rate,
// average speed and whether it supports drip-feed.
// Instagram service IDs (1001–6199) are stable — orders placed on older builds keep resolving.

export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'x', label: 'X / Twitter', icon: '🐦' },
  { id: 'telegram', label: 'Telegram', icon: '✈️' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'spotify', label: 'Spotify', icon: '🎧' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'threads', label: 'Threads', icon: '🧵' },
  { id: 'twitch', label: 'Twitch', icon: '🎮' },
  { id: 'discord', label: 'Discord', icon: '🎯' },
  { id: 'snapchat', label: 'Snapchat', icon: '👻' },
  { id: 'pinterest', label: 'Pinterest', icon: '📌' },
  { id: 'website', label: 'Website Traffic', icon: '🌐' },
]

// Fulfilment types every modern panel exposes.
export const SERVICE_TYPES = [
  { id: 'all', label: 'All types', icon: '✨' },
  { id: 'Non-Drop', label: 'Non-Drop (Guaranteed)', icon: '🛡️' },
  { id: 'Drop', label: 'Drop (Cheapest)', icon: '💧' },
  { id: 'Custom', label: 'Custom (You Provide)', icon: '✍️' },
  { id: 'Subscription', label: 'Auto / Subscription', icon: '🔁' },
]

// "Power" engagement tiers — the audience quality behind a like/follow.
// Maps to the real "power like" concept: engagement placed by real, active,
// high-follower accounts so it surfaces in Top Likers and looks organic.
export const POWER_TIERS = [
  { id: 'Girls', label: 'Power Girls', icon: '👩', desc: 'Real active female creator accounts' },
  { id: 'Boys', label: 'Power Boys', icon: '👨', desc: 'Real active male creator accounts' },
  { id: 'Tops', label: 'Power Tops', icon: '👑', desc: 'Verified / 100K+ follower accounts (Top Likers)' },
  { id: 'Base', label: 'Power Base', icon: '🌊', desc: 'High-volume foundational reach' },
]

export const CATEGORIES = [
  // Instagram
  { id: 'ig_followers', label: 'Followers', icon: '👥', platform: 'instagram' },
  { id: 'ig_likes', label: 'Likes', icon: '❤️', platform: 'instagram' },
  { id: 'ig_views', label: 'Views & Reels', icon: '▶️', platform: 'instagram' },
  { id: 'ig_comments', label: 'Comments', icon: '💬', platform: 'instagram' },
  { id: 'ig_story', label: 'Story / Live', icon: '⚡', platform: 'instagram' },
  { id: 'ig_saves', label: 'Saves & Shares', icon: '🔖', platform: 'instagram' },
  { id: 'ig_channel', label: 'Channel Members', icon: '📢', platform: 'instagram' },
  // YouTube
  { id: 'yt_subs', label: 'Subscribers', icon: '🔔', platform: 'youtube' },
  { id: 'yt_views', label: 'Video Views', icon: '👁️', platform: 'youtube' },
  { id: 'yt_shorts', label: 'Shorts', icon: '📱', platform: 'youtube' },
  { id: 'yt_likes', label: 'Likes & Comments', icon: '👍', platform: 'youtube' },
  { id: 'yt_watch', label: 'Watch Hours', icon: '⏱️', platform: 'youtube' },
  { id: 'yt_live', label: 'Live Stream', icon: '🔴', platform: 'youtube' },
  // TikTok
  { id: 'tt_followers', label: 'Followers', icon: '👥', platform: 'tiktok' },
  { id: 'tt_likes', label: 'Likes', icon: '❤️', platform: 'tiktok' },
  { id: 'tt_views', label: 'Views', icon: '▶️', platform: 'tiktok' },
  { id: 'tt_shares', label: 'Shares & Saves', icon: '🔁', platform: 'tiktok' },
  { id: 'tt_live', label: 'Live', icon: '🔴', platform: 'tiktok' },
  // Facebook
  { id: 'fb_page', label: 'Page Likes / Followers', icon: '📄', platform: 'facebook' },
  { id: 'fb_post', label: 'Post Engagement', icon: '👍', platform: 'facebook' },
  { id: 'fb_video', label: 'Video Views', icon: '🎬', platform: 'facebook' },
  { id: 'fb_group', label: 'Group Members', icon: '👨‍👩‍👧', platform: 'facebook' },
  // X / Twitter
  { id: 'tw_followers', label: 'Followers', icon: '👥', platform: 'x' },
  { id: 'tw_likes', label: 'Likes', icon: '❤️', platform: 'x' },
  { id: 'tw_retweets', label: 'Reposts & Quotes', icon: '🔁', platform: 'x' },
  { id: 'tw_views', label: 'Views & Impressions', icon: '👁️', platform: 'x' },
  // Telegram
  { id: 'tg_members', label: 'Channel Members', icon: '👥', platform: 'telegram' },
  { id: 'tg_views', label: 'Post Views', icon: '👁️', platform: 'telegram' },
  { id: 'tg_reactions', label: 'Reactions', icon: '🎉', platform: 'telegram' },
  // WhatsApp
  { id: 'wa_channel', label: 'Channel Followers', icon: '📢', platform: 'whatsapp' },
  // Spotify
  { id: 'sp_plays', label: 'Plays & Streams', icon: '▶️', platform: 'spotify' },
  { id: 'sp_followers', label: 'Followers', icon: '👥', platform: 'spotify' },
  { id: 'sp_listeners', label: 'Monthly Listeners', icon: '📊', platform: 'spotify' },
  // LinkedIn
  { id: 'li_followers', label: 'Followers & Connections', icon: '👥', platform: 'linkedin' },
  { id: 'li_engagement', label: 'Post Engagement', icon: '👍', platform: 'linkedin' },
  // Threads
  { id: 'th_followers', label: 'Followers', icon: '👥', platform: 'threads' },
  { id: 'th_likes', label: 'Likes & Reposts', icon: '❤️', platform: 'threads' },
  // Twitch
  { id: 'tc_followers', label: 'Followers', icon: '👥', platform: 'twitch' },
  { id: 'tc_live', label: 'Live Viewers', icon: '🔴', platform: 'twitch' },
  // Discord
  { id: 'dc_members', label: 'Server Members', icon: '👥', platform: 'discord' },
  // Snapchat
  { id: 'sc_followers', label: 'Followers & Views', icon: '👥', platform: 'snapchat' },
  // Pinterest
  { id: 'pin_followers', label: 'Followers & Saves', icon: '📌', platform: 'pinterest' },
  // Website
  { id: 'web_traffic', label: 'Visitors', icon: '🌐', platform: 'website' },
]

export const SERVICES = [
  // ================= INSTAGRAM =================
  // ---- Followers ----
  { id: 1001, cat: 'ig_followers', name: 'Instagram Followers — Bot [Instant]', price: 30, min: 100, max: 100000, refill: 'No', drop: '~40%', speed: '50K/day', quality: 'Bot', dripfeed: true, tag: 'Cheapest' },
  { id: 1002, cat: 'ig_followers', name: 'Instagram Followers — HQ [30d Refill]', price: 65, min: 100, max: 200000, refill: '30 Days', drop: '~15%', speed: '25K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 1003, cat: 'ig_followers', name: 'Instagram Followers — Real Mix [99d Refill]', price: 110, min: 50, max: 500000, refill: '99 Days', drop: '~8%', speed: '15K/day', quality: 'Real Mix', dripfeed: true },
  { id: 1004, cat: 'ig_followers', name: 'Instagram Followers — Premium Real [365d Refill]', price: 190, min: 50, max: 300000, refill: '365 Days', drop: '~3%', speed: '10K/day', quality: 'Premium', dripfeed: true, tag: 'Best Quality' },
  { id: 1005, cat: 'ig_followers', name: 'Instagram Followers — Indian Real Active [Lifetime]', price: 240, min: 50, max: 100000, refill: 'Lifetime', drop: '~2%', speed: '5K/day', quality: 'Targeted', dripfeed: true, tag: 'Geo-Targeted' },
  { id: 1006, cat: 'ig_followers', name: 'Instagram Followers — USA Real [90d Refill]', price: 310, min: 50, max: 80000, refill: '90 Days', drop: '~4%', speed: '4K/day', quality: 'Targeted', dripfeed: true },
  { id: 1007, cat: 'ig_followers', name: 'Instagram Followers — Female Accounts [30d Refill]', price: 280, min: 50, max: 50000, refill: '30 Days', drop: '~6%', speed: '3K/day', quality: 'Targeted', dripfeed: true },

  // ---- Likes ----
  { id: 2001, cat: 'ig_likes', name: 'Instagram Likes — Instant Bot', price: 12, min: 20, max: 100000, refill: 'No', drop: '~20%', speed: '100K/day', quality: 'Bot', dripfeed: true, tag: 'Cheapest' },
  { id: 2002, cat: 'ig_likes', name: 'Instagram Likes — Real HQ [Refill]', price: 28, min: 20, max: 200000, refill: '30 Days', drop: '~5%', speed: '50K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 2003, cat: 'ig_likes', name: 'Instagram Likes — Power (Verified Accounts)', price: 70, min: 20, max: 50000, refill: '60 Days', drop: '~2%', speed: '20K/day', quality: 'Premium', dripfeed: true },
  { id: 2004, cat: 'ig_likes', name: 'Instagram Likes — Indian Real', price: 45, min: 20, max: 100000, refill: '30 Days', drop: '~4%', speed: '25K/day', quality: 'Targeted', dripfeed: true, tag: 'Geo-Targeted' },
  { id: 2005, cat: 'ig_likes', name: 'Instagram Auto-Likes — Next 10 Posts', price: 250, min: 100, max: 20000, refill: '30 Days', drop: '~5%', speed: 'Auto', quality: 'High', dripfeed: false, tag: 'Subscription' },

  // ---- Views / Reels ----
  { id: 3001, cat: 'ig_views', name: 'Instagram Video Views', price: 6, min: 100, max: 10000000, refill: 'No', drop: '0%', speed: '1M/day', quality: 'HQ', dripfeed: true, tag: 'Cheapest' },
  { id: 3002, cat: 'ig_views', name: 'Instagram Reels Views [Boosted]', price: 9, min: 100, max: 10000000, refill: 'No', drop: '0%', speed: '2M/day', quality: 'HQ', dripfeed: true, tag: 'Popular' },
  { id: 3003, cat: 'ig_views', name: 'Instagram Reels Views + Saves + Reach', price: 45, min: 100, max: 1000000, refill: 'No', drop: '0%', speed: '500K/day', quality: 'Premium', dripfeed: true, tag: 'Algorithm Boost' },
  { id: 3004, cat: 'ig_views', name: 'Instagram Profile Visits', price: 22, min: 100, max: 1000000, refill: 'No', drop: '0%', speed: '300K/day', quality: 'HQ', dripfeed: true },
  { id: 3005, cat: 'ig_views', name: 'Instagram Impressions + Reach [Explore]', price: 18, min: 100, max: 5000000, refill: 'No', drop: '0%', speed: '500K/day', quality: 'HQ', dripfeed: true },

  // ---- Comments ----
  { id: 4001, cat: 'ig_comments', name: 'Instagram Custom Comments (You Provide Text)', price: 260, min: 10, max: 10000, refill: 'No', drop: '~5%', speed: '2K/day', quality: 'Real', dripfeed: false, tag: 'Custom' },
  { id: 4002, cat: 'ig_comments', name: 'Instagram Random Positive Comments', price: 150, min: 10, max: 20000, refill: 'No', drop: '~5%', speed: '5K/day', quality: 'Real', dripfeed: false },
  { id: 4003, cat: 'ig_comments', name: 'Instagram Emoji Comments', price: 90, min: 10, max: 20000, refill: 'No', drop: '~5%', speed: '5K/day', quality: 'Real', dripfeed: false },
  { id: 4004, cat: 'ig_comments', name: 'Instagram Comments — Verified Accounts (Blue Tick)', price: 950, min: 5, max: 1000, refill: 'No', drop: '~2%', speed: '500/day', quality: 'Premium', dripfeed: false, tag: 'VIP' },
  { id: 4005, cat: 'ig_comments', name: 'Instagram Comment Likes', price: 40, min: 20, max: 50000, refill: 'No', drop: '~5%', speed: '20K/day', quality: 'HQ', dripfeed: false },

  // ---- Story / Live ----
  { id: 5001, cat: 'ig_story', name: 'Instagram Story Views (All Stories)', price: 18, min: 100, max: 500000, refill: 'No', drop: '0%', speed: '200K/day', quality: 'HQ', dripfeed: false },
  { id: 5002, cat: 'ig_story', name: 'Instagram Live Video Viewers (15 min)', price: 320, min: 50, max: 20000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'HQ', dripfeed: false, tag: 'Live' },
  { id: 5003, cat: 'ig_story', name: 'Instagram Story Poll Votes', price: 60, min: 50, max: 50000, refill: 'No', drop: '0%', speed: '20K/day', quality: 'Real', dripfeed: false },
  { id: 5004, cat: 'ig_story', name: 'Instagram Live Viewers + Likes + Comments (30 min)', price: 520, min: 50, max: 10000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'Premium', dripfeed: false, tag: 'Live' },
  { id: 5005, cat: 'ig_story', name: 'Instagram Story Link Clicks', price: 130, min: 50, max: 100000, refill: 'No', drop: '0%', speed: '30K/day', quality: 'Real', dripfeed: false },

  // ---- Saves & Shares ----
  { id: 6001, cat: 'ig_saves', name: 'Instagram Saves [Algorithm Signal]', price: 15, min: 50, max: 500000, refill: 'No', drop: '0%', speed: '100K/day', quality: 'HQ', dripfeed: true, tag: 'Algorithm Boost' },
  { id: 6002, cat: 'ig_saves', name: 'Instagram Shares (Send to DM / Story)', price: 35, min: 50, max: 200000, refill: 'No', drop: '0%', speed: '50K/day', quality: 'HQ', dripfeed: true },
  { id: 6003, cat: 'ig_saves', name: 'Instagram Saves + Shares Combo Pack', price: 42, min: 50, max: 200000, refill: 'No', drop: '0%', speed: '50K/day', quality: 'Premium', dripfeed: true },

  // ---- Broadcast Channel ----
  { id: 6101, cat: 'ig_channel', name: 'Instagram Broadcast Channel Members', price: 180, min: 50, max: 50000, refill: '30 Days', drop: '~8%', speed: '5K/day', quality: 'High', dripfeed: true, tag: 'New' },
  { id: 6102, cat: 'ig_channel', name: 'Instagram Channel Poll Votes / Reactions', price: 55, min: 50, max: 50000, refill: 'No', drop: '0%', speed: '20K/day', quality: 'HQ', dripfeed: false },

  // ================= YOUTUBE =================
  { id: 10001, cat: 'yt_subs', name: 'YouTube Subscribers — HQ [30d Refill]', price: 850, min: 50, max: 100000, refill: '30 Days', drop: '~10%', speed: '1K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 10002, cat: 'yt_subs', name: 'YouTube Subscribers — Real Active [Lifetime]', price: 1600, min: 50, max: 50000, refill: 'Lifetime', drop: '~2%', speed: '500/day', quality: 'Premium', dripfeed: true, tag: 'Best Quality' },
  { id: 10003, cat: 'yt_subs', name: 'YouTube Subscribers — Indian [90d Refill]', price: 1200, min: 50, max: 30000, refill: '90 Days', drop: '~5%', speed: '700/day', quality: 'Targeted', dripfeed: true, tag: 'Geo-Targeted' },
  { id: 10101, cat: 'yt_views', name: 'YouTube Views — High Retention (2-5 min)', price: 140, min: 500, max: 10000000, refill: '30 Days', drop: '~1%', speed: '100K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 10102, cat: 'yt_views', name: 'YouTube Views — Suggested / Browse Source', price: 260, min: 500, max: 5000000, refill: '30 Days', drop: '~1%', speed: '50K/day', quality: 'Premium', dripfeed: true, tag: 'Algorithm Boost' },
  { id: 10103, cat: 'yt_views', name: 'YouTube Views — Ads Quality [No Drop]', price: 480, min: 1000, max: 10000000, refill: 'Lifetime', drop: '0%', speed: '200K/day', quality: 'Premium', dripfeed: true },
  { id: 10201, cat: 'yt_shorts', name: 'YouTube Shorts Views [Fast]', price: 45, min: 500, max: 10000000, refill: 'No', drop: '0%', speed: '500K/day', quality: 'HQ', dripfeed: true, tag: 'Cheapest' },
  { id: 10202, cat: 'yt_shorts', name: 'YouTube Shorts Likes', price: 90, min: 50, max: 500000, refill: '30 Days', drop: '~3%', speed: '50K/day', quality: 'High', dripfeed: true },
  { id: 10301, cat: 'yt_likes', name: 'YouTube Video Likes [Refill]', price: 110, min: 50, max: 500000, refill: '30 Days', drop: '~3%', speed: '50K/day', quality: 'High', dripfeed: true },
  { id: 10302, cat: 'yt_likes', name: 'YouTube Custom Comments', price: 900, min: 10, max: 5000, refill: 'No', drop: '~5%', speed: '500/day', quality: 'Real', dripfeed: false, tag: 'Custom' },
  { id: 10303, cat: 'yt_likes', name: 'YouTube Comment Upvotes', price: 180, min: 20, max: 50000, refill: 'No', drop: '~3%', speed: '10K/day', quality: 'HQ', dripfeed: false },
  { id: 10401, cat: 'yt_watch', name: 'YouTube Watch Time — 4000 Hours Pack (60min+ video)', price: 5200, min: 100, max: 4000, refill: '30 Days', drop: '~2%', speed: '150h/day', quality: 'Premium', dripfeed: false, tag: 'Monetization' },
  { id: 10402, cat: 'yt_watch', name: 'YouTube Watch Hours — 15min+ Video', price: 1800, min: 100, max: 4000, refill: '30 Days', drop: '~3%', speed: '100h/day', quality: 'High', dripfeed: false },
  { id: 10501, cat: 'yt_live', name: 'YouTube Live Stream Viewers (30 min)', price: 380, min: 50, max: 20000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'HQ', dripfeed: false, tag: 'Live' },
  { id: 10502, cat: 'yt_live', name: 'YouTube Live Stream Viewers (2 hours)', price: 1150, min: 50, max: 10000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'HQ', dripfeed: false, tag: 'Live' },

  // ================= TIKTOK =================
  { id: 11001, cat: 'tt_followers', name: 'TikTok Followers — HQ [30d Refill]', price: 210, min: 100, max: 200000, refill: '30 Days', drop: '~10%', speed: '20K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 11002, cat: 'tt_followers', name: 'TikTok Followers — Real [365d Refill]', price: 420, min: 100, max: 100000, refill: '365 Days', drop: '~3%', speed: '10K/day', quality: 'Premium', dripfeed: true, tag: 'Best Quality' },
  { id: 11101, cat: 'tt_likes', name: 'TikTok Likes — Instant', price: 40, min: 50, max: 500000, refill: 'No', drop: '~10%', speed: '100K/day', quality: 'HQ', dripfeed: true, tag: 'Cheapest' },
  { id: 11102, cat: 'tt_likes', name: 'TikTok Likes — Real [Refill]', price: 85, min: 50, max: 200000, refill: '30 Days', drop: '~3%', speed: '50K/day', quality: 'High', dripfeed: true },
  { id: 11201, cat: 'tt_views', name: 'TikTok Video Views [Blazing Fast]', price: 4, min: 500, max: 100000000, refill: 'No', drop: '0%', speed: '5M/day', quality: 'HQ', dripfeed: true, tag: 'Cheapest' },
  { id: 11202, cat: 'tt_views', name: 'TikTok Views + Likes + Shares [FYP Boost]', price: 60, min: 500, max: 5000000, refill: 'No', drop: '0%', speed: '1M/day', quality: 'Premium', dripfeed: true, tag: 'Algorithm Boost' },
  { id: 11301, cat: 'tt_shares', name: 'TikTok Shares', price: 25, min: 50, max: 1000000, refill: 'No', drop: '0%', speed: '200K/day', quality: 'HQ', dripfeed: true },
  { id: 11302, cat: 'tt_shares', name: 'TikTok Saves (Favorites)', price: 20, min: 50, max: 500000, refill: 'No', drop: '0%', speed: '200K/day', quality: 'HQ', dripfeed: true },
  { id: 11401, cat: 'tt_live', name: 'TikTok Live Viewers (30 min)', price: 350, min: 50, max: 20000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'HQ', dripfeed: false, tag: 'Live' },
  { id: 11402, cat: 'tt_live', name: 'TikTok Live Likes (Hearts)', price: 12, min: 500, max: 1000000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'HQ', dripfeed: false },

  // ================= FACEBOOK =================
  { id: 12001, cat: 'fb_page', name: 'Facebook Page Likes + Followers [30d Refill]', price: 240, min: 100, max: 200000, refill: '30 Days', drop: '~8%', speed: '10K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 12002, cat: 'fb_page', name: 'Facebook Profile Followers', price: 190, min: 100, max: 100000, refill: '30 Days', drop: '~8%', speed: '10K/day', quality: 'High', dripfeed: true },
  { id: 12101, cat: 'fb_post', name: 'Facebook Post Likes', price: 60, min: 50, max: 100000, refill: '30 Days', drop: '~5%', speed: '20K/day', quality: 'High', dripfeed: true },
  { id: 12102, cat: 'fb_post', name: 'Facebook Post Reactions (Love / Wow / Haha)', price: 75, min: 50, max: 100000, refill: 'No', drop: '~5%', speed: '20K/day', quality: 'HQ', dripfeed: true },
  { id: 12103, cat: 'fb_post', name: 'Facebook Post Shares', price: 140, min: 50, max: 50000, refill: 'No', drop: '~3%', speed: '10K/day', quality: 'High', dripfeed: true },
  { id: 12201, cat: 'fb_video', name: 'Facebook Video / Reel Views', price: 30, min: 500, max: 10000000, refill: 'No', drop: '0%', speed: '1M/day', quality: 'HQ', dripfeed: true, tag: 'Cheapest' },
  { id: 12202, cat: 'fb_video', name: 'Facebook Live Stream Viewers (30 min)', price: 420, min: 50, max: 10000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'HQ', dripfeed: false, tag: 'Live' },
  { id: 12301, cat: 'fb_group', name: 'Facebook Group Members — Real Mix', price: 260, min: 100, max: 100000, refill: '30 Days', drop: '~8%', speed: '5K/day', quality: 'High', dripfeed: true },

  // ================= X / TWITTER =================
  { id: 13001, cat: 'tw_followers', name: 'X Followers — HQ [30d Refill]', price: 480, min: 100, max: 200000, refill: '30 Days', drop: '~10%', speed: '10K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 13002, cat: 'tw_followers', name: 'X Followers — NFT / Crypto Niche', price: 850, min: 100, max: 50000, refill: '60 Days', drop: '~5%', speed: '5K/day', quality: 'Targeted', dripfeed: true, tag: 'Niche' },
  { id: 13101, cat: 'tw_likes', name: 'X Post Likes', price: 190, min: 20, max: 100000, refill: '30 Days', drop: '~5%', speed: '20K/day', quality: 'High', dripfeed: true },
  { id: 13201, cat: 'tw_retweets', name: 'X Reposts (Retweets)', price: 260, min: 20, max: 50000, refill: '30 Days', drop: '~5%', speed: '10K/day', quality: 'High', dripfeed: true },
  { id: 13202, cat: 'tw_retweets', name: 'X Quote Posts — Custom Text', price: 1200, min: 5, max: 2000, refill: 'No', drop: '~3%', speed: '300/day', quality: 'Real', dripfeed: false, tag: 'Custom' },
  { id: 13301, cat: 'tw_views', name: 'X Video Views', price: 12, min: 500, max: 10000000, refill: 'No', drop: '0%', speed: '2M/day', quality: 'HQ', dripfeed: true, tag: 'Cheapest' },
  { id: 13302, cat: 'tw_views', name: 'X Post Impressions', price: 8, min: 500, max: 10000000, refill: 'No', drop: '0%', speed: '5M/day', quality: 'HQ', dripfeed: true },
  { id: 13303, cat: 'tw_views', name: 'X Space Listeners (60 min)', price: 650, min: 50, max: 10000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'HQ', dripfeed: false, tag: 'Live' },

  // ================= TELEGRAM =================
  { id: 14001, cat: 'tg_members', name: 'Telegram Channel Members — HQ', price: 120, min: 100, max: 200000, refill: '30 Days', drop: '~10%', speed: '20K/day', quality: 'High', dripfeed: true, tag: 'Popular' },
  { id: 14002, cat: 'tg_members', name: 'Telegram Group Members — Real Active', price: 320, min: 100, max: 50000, refill: '60 Days', drop: '~5%', speed: '5K/day', quality: 'Premium', dripfeed: true },
  { id: 14101, cat: 'tg_views', name: 'Telegram Post Views (Last Post)', price: 3, min: 500, max: 10000000, refill: 'No', drop: '0%', speed: '5M/day', quality: 'HQ', dripfeed: true, tag: 'Cheapest' },
  { id: 14102, cat: 'tg_views', name: 'Telegram Post Views (Last 20 Posts)', price: 28, min: 500, max: 1000000, refill: 'No', drop: '0%', speed: '1M/day', quality: 'HQ', dripfeed: false },
  { id: 14201, cat: 'tg_reactions', name: 'Telegram Reactions (👍 ❤️ 🔥 Mix)', price: 22, min: 50, max: 500000, refill: 'No', drop: '0%', speed: '100K/day', quality: 'HQ', dripfeed: true },

  // ================= WHATSAPP =================
  { id: 15001, cat: 'wa_channel', name: 'WhatsApp Channel Followers', price: 380, min: 50, max: 50000, refill: '30 Days', drop: '~8%', speed: '3K/day', quality: 'High', dripfeed: true, tag: 'New' },
  { id: 15002, cat: 'wa_channel', name: 'WhatsApp Channel Post Reactions', price: 90, min: 50, max: 50000, refill: 'No', drop: '0%', speed: '20K/day', quality: 'HQ', dripfeed: false },

  // ================= SPOTIFY =================
  { id: 16001, cat: 'sp_plays', name: 'Spotify Plays — Worldwide', price: 55, min: 1000, max: 10000000, refill: 'Lifetime', drop: '0%', speed: '50K/day', quality: 'Premium', dripfeed: true, tag: 'Popular' },
  { id: 16002, cat: 'sp_plays', name: 'Spotify Playlist Plays — USA/UK', price: 110, min: 1000, max: 1000000, refill: 'Lifetime', drop: '0%', speed: '20K/day', quality: 'Targeted', dripfeed: true, tag: 'Royalty Eligible' },
  { id: 16101, cat: 'sp_followers', name: 'Spotify Artist / Playlist Followers', price: 95, min: 100, max: 500000, refill: '30 Days', drop: '~2%', speed: '20K/day', quality: 'High', dripfeed: true },
  { id: 16201, cat: 'sp_listeners', name: 'Spotify Monthly Listeners', price: 140, min: 500, max: 500000, refill: 'No', drop: '0%', speed: '20K/day', quality: 'High', dripfeed: true },

  // ================= LINKEDIN =================
  { id: 17001, cat: 'li_followers', name: 'LinkedIn Company Page Followers', price: 950, min: 50, max: 50000, refill: '30 Days', drop: '~5%', speed: '2K/day', quality: 'High', dripfeed: true, tag: 'B2B' },
  { id: 17002, cat: 'li_followers', name: 'LinkedIn Profile Followers / Connections', price: 1100, min: 50, max: 20000, refill: '30 Days', drop: '~5%', speed: '1K/day', quality: 'High', dripfeed: true },
  { id: 17101, cat: 'li_engagement', name: 'LinkedIn Post Likes / Reactions', price: 380, min: 25, max: 20000, refill: '30 Days', drop: '~3%', speed: '3K/day', quality: 'High', dripfeed: true },
  { id: 17102, cat: 'li_engagement', name: 'LinkedIn Post Reposts', price: 700, min: 10, max: 5000, refill: 'No', drop: '~3%', speed: '1K/day', quality: 'Real', dripfeed: false },

  // ================= THREADS =================
  { id: 18001, cat: 'th_followers', name: 'Threads Followers — HQ', price: 260, min: 100, max: 100000, refill: '30 Days', drop: '~8%', speed: '10K/day', quality: 'High', dripfeed: true, tag: 'New' },
  { id: 18101, cat: 'th_likes', name: 'Threads Post Likes', price: 80, min: 20, max: 100000, refill: '30 Days', drop: '~5%', speed: '20K/day', quality: 'High', dripfeed: true },
  { id: 18102, cat: 'th_likes', name: 'Threads Reposts', price: 160, min: 20, max: 50000, refill: 'No', drop: '~5%', speed: '10K/day', quality: 'HQ', dripfeed: true },

  // ================= TWITCH =================
  { id: 19001, cat: 'tc_followers', name: 'Twitch Channel Followers', price: 150, min: 100, max: 200000, refill: '30 Days', drop: '~5%', speed: '20K/day', quality: 'High', dripfeed: true },
  { id: 19101, cat: 'tc_live', name: 'Twitch Live Viewers (1 hour)', price: 480, min: 25, max: 5000, refill: 'No', drop: '0%', speed: 'Instant', quality: 'HQ', dripfeed: false, tag: 'Live' },
  { id: 19102, cat: 'tc_live', name: 'Twitch Clip / VOD Views', price: 35, min: 500, max: 1000000, refill: 'No', drop: '0%', speed: '200K/day', quality: 'HQ', dripfeed: true },

  // ================= DISCORD =================
  { id: 20001, cat: 'dc_members', name: 'Discord Server Members — Offline', price: 280, min: 100, max: 50000, refill: '30 Days', drop: '~10%', speed: '10K/day', quality: 'HQ', dripfeed: true },
  { id: 20002, cat: 'dc_members', name: 'Discord Server Members — Online [Active]', price: 650, min: 100, max: 20000, refill: '30 Days', drop: '~5%', speed: '3K/day', quality: 'Premium', dripfeed: true, tag: 'Best Quality' },

  // ================= SNAPCHAT =================
  { id: 21001, cat: 'sc_followers', name: 'Snapchat Followers', price: 900, min: 50, max: 20000, refill: '30 Days', drop: '~8%', speed: '1K/day', quality: 'High', dripfeed: true },
  { id: 21002, cat: 'sc_followers', name: 'Snapchat Story / Spotlight Views', price: 60, min: 100, max: 1000000, refill: 'No', drop: '0%', speed: '200K/day', quality: 'HQ', dripfeed: true },

  // ================= PINTEREST =================
  { id: 22001, cat: 'pin_followers', name: 'Pinterest Followers', price: 340, min: 100, max: 50000, refill: '30 Days', drop: '~5%', speed: '5K/day', quality: 'High', dripfeed: true },
  { id: 22002, cat: 'pin_followers', name: 'Pinterest Pin Saves (Repins)', price: 110, min: 50, max: 100000, refill: 'No', drop: '0%', speed: '20K/day', quality: 'HQ', dripfeed: true },

  // ================= WEBSITE TRAFFIC =================
  { id: 23001, cat: 'web_traffic', name: 'Website Traffic — Worldwide [Google Analytics Visible]', price: 45, min: 1000, max: 10000000, refill: 'No', drop: '0%', speed: '100K/day', quality: 'HQ', dripfeed: true, tag: 'Cheapest' },
  { id: 23002, cat: 'web_traffic', name: 'Website Traffic — From Instagram Referral', price: 85, min: 1000, max: 1000000, refill: 'No', drop: '0%', speed: '50K/day', quality: 'High', dripfeed: true },
  { id: 23003, cat: 'web_traffic', name: 'Website Traffic — USA Targeted + 60s Visit', price: 190, min: 500, max: 500000, refill: 'No', drop: '0%', speed: '20K/day', quality: 'Premium', dripfeed: true, tag: 'Geo-Targeted' },

  // ================= POWER ENGAGEMENT TIERS (2026) =================
  // Real high-follower / niche accounts. Surfaces in "Top Likers" and looks organic.
  { id: 70001, cat: 'ig_likes', name: 'Instagram Power Likes — Power Girls (Female Creators)', price: 320, min: 20, max: 20000, refill: '60 Days', drop: '~2%', speed: '10K/day', quality: 'Power', power: 'Girls', type: 'Non-Drop', dripfeed: true, tag: 'Power' },
  { id: 70002, cat: 'ig_likes', name: 'Instagram Power Likes — Power Boys (Male Creators)', price: 320, min: 20, max: 20000, refill: '60 Days', drop: '~2%', speed: '10K/day', quality: 'Power', power: 'Boys', type: 'Non-Drop', dripfeed: true, tag: 'Power' },
  { id: 70003, cat: 'ig_likes', name: 'Instagram Power Likes — Power Tops (Verified / 100K+)', price: 1400, min: 10, max: 3000, refill: '90 Days', drop: '~1%', speed: '2K/day', quality: 'Power', power: 'Tops', type: 'Non-Drop', dripfeed: false, tag: 'VIP' },
  { id: 70004, cat: 'ig_likes', name: 'Instagram Power Likes — Power Base (Mass Reach)', price: 55, min: 100, max: 500000, refill: '30 Days', drop: '~4%', speed: '80K/day', quality: 'Power', power: 'Base', type: 'Drop', dripfeed: true, tag: 'Power' },
  { id: 70011, cat: 'ig_followers', name: 'Instagram Power Followers — Power Girls', price: 360, min: 50, max: 50000, refill: '99 Days', drop: '~3%', speed: '5K/day', quality: 'Power', power: 'Girls', type: 'Non-Drop', dripfeed: true, tag: 'Power' },
  { id: 70012, cat: 'ig_followers', name: 'Instagram Power Followers — Power Boys', price: 360, min: 50, max: 50000, refill: '99 Days', drop: '~3%', speed: '5K/day', quality: 'Power', power: 'Boys', type: 'Non-Drop', dripfeed: true, tag: 'Power' },
  { id: 70013, cat: 'ig_followers', name: 'Instagram Power Followers — Power Tops (Influencer Tier)', price: 1900, min: 25, max: 5000, refill: 'Lifetime', drop: '~1%', speed: '1K/day', quality: 'Power', power: 'Tops', type: 'Non-Drop', dripfeed: false, tag: 'VIP' },
  { id: 70021, cat: 'tt_likes', name: 'TikTok Power Likes — Creator Accounts', price: 180, min: 50, max: 100000, refill: '60 Days', drop: '~2%', speed: '30K/day', quality: 'Power', power: 'Base', type: 'Non-Drop', dripfeed: true, tag: 'Power' },
  { id: 70031, cat: 'yt_likes', name: 'YouTube Power Likes — Verified Channels', price: 640, min: 20, max: 20000, refill: '30 Days', drop: '~2%', speed: '5K/day', quality: 'Power', power: 'Tops', type: 'Non-Drop', dripfeed: false, tag: 'Power' },

  // ================= NON-DROP / GUARANTEED (2026) =================
  { id: 71001, cat: 'ig_followers', name: 'Instagram Followers — Zero-Drop Guaranteed [Lifetime Refill]', price: 260, min: 50, max: 500000, refill: 'Lifetime', drop: '0%', speed: '20K/day', quality: 'Premium', type: 'Non-Drop', dripfeed: true, tag: 'No-Drop' },
  { id: 71002, cat: 'ig_likes', name: 'Instagram Likes — Zero-Drop Guaranteed', price: 60, min: 20, max: 500000, refill: 'Lifetime', drop: '0%', speed: '80K/day', quality: 'Premium', type: 'Non-Drop', dripfeed: true, tag: 'No-Drop' },
  { id: 71003, cat: 'tt_followers', name: 'TikTok Followers — Zero-Drop Guaranteed', price: 380, min: 100, max: 200000, refill: 'Lifetime', drop: '0%', speed: '15K/day', quality: 'Premium', type: 'Non-Drop', dripfeed: true, tag: 'No-Drop' },
  { id: 71004, cat: 'yt_subs', name: 'YouTube Subscribers — Zero-Drop Guaranteed [Lifetime]', price: 1800, min: 50, max: 50000, refill: 'Lifetime', drop: '0%', speed: '800/day', quality: 'Premium', type: 'Non-Drop', dripfeed: true, tag: 'No-Drop' },

  // ================= CUSTOM (YOU PROVIDE) =================
  { id: 72001, cat: 'ig_comments', name: 'Instagram Custom Comments — Real Accounts [You Provide List]', price: 300, min: 10, max: 10000, refill: 'No', drop: '~3%', speed: '2K/day', quality: 'Real', type: 'Custom', dripfeed: false, tag: 'Custom' },
  { id: 72002, cat: 'tt_shares', name: 'TikTok Custom Comments [You Provide List]', price: 260, min: 10, max: 10000, refill: 'No', drop: '~3%', speed: '3K/day', quality: 'Real', type: 'Custom', dripfeed: false, tag: 'Custom' },
  { id: 72003, cat: 'tw_retweets', name: 'X Custom Quote Posts [You Provide Text]', price: 1200, min: 5, max: 2000, refill: 'No', drop: '~3%', speed: '300/day', quality: 'Real', type: 'Custom', dripfeed: false, tag: 'Custom' },
  { id: 72004, cat: 'ig_saves', name: 'Instagram Custom Hashtag Reach [You Pick Tags]', price: 90, min: 500, max: 1000000, refill: 'No', drop: '0%', speed: '100K/day', quality: 'HQ', type: 'Custom', dripfeed: true, tag: 'Custom' },

  // ================= 2026 NEXT-GEN SERVICES =================
  { id: 73001, cat: 'ig_views', name: 'Instagram Reels — AI Explore-Page Push [Algorithm Signal]', price: 120, min: 500, max: 5000000, refill: 'No', drop: '0%', speed: '400K/day', quality: 'Premium', type: 'Non-Drop', dripfeed: true, tag: '2026' },
  { id: 73002, cat: 'ig_story', name: 'Instagram Story — Sticker Taps + Link Clicks Combo', price: 150, min: 50, max: 100000, refill: 'No', drop: '0%', speed: '30K/day', quality: 'Real', type: 'Non-Drop', dripfeed: false, tag: '2026' },
  { id: 73003, cat: 'ig_followers', name: 'Instagram Followers — AI Look-alike Audience [Niche-Matched]', price: 420, min: 100, max: 100000, refill: '365 Days', drop: '~2%', speed: '8K/day', quality: 'Targeted', type: 'Non-Drop', dripfeed: true, tag: '2026' },
  { id: 73004, cat: 'ig_saves', name: 'Instagram Collab-Post Reach Boost [Both Accounts]', price: 70, min: 500, max: 2000000, refill: 'No', drop: '0%', speed: '200K/day', quality: 'HQ', type: 'Non-Drop', dripfeed: true, tag: '2026' },
  { id: 73005, cat: 'yt_watch', name: 'YouTube Shorts — Monetization Kit (Views + Watch + Subs)', price: 3200, min: 100, max: 5000, refill: '30 Days', drop: '~2%', speed: 'Bundle', quality: 'Premium', type: 'Non-Drop', dripfeed: false, tag: 'Monetization' },
  { id: 73006, cat: 'sp_plays', name: 'Spotify — Editorial Playlist Pitch + Streams [Royalty Safe]', price: 240, min: 1000, max: 1000000, refill: 'Lifetime', drop: '0%', speed: '30K/day', quality: 'Premium', type: 'Non-Drop', dripfeed: true, tag: '2026' },
  { id: 73007, cat: 'th_followers', name: 'Threads — Cross-Post Growth Engine [IG-Linked]', price: 300, min: 100, max: 100000, refill: '30 Days', drop: '~5%', speed: '10K/day', quality: 'High', type: 'Non-Drop', dripfeed: true, tag: '2026' },
  { id: 73008, cat: 'sc_followers', name: 'Snapchat — Spotlight Viral Push [FYP Signal]', price: 140, min: 500, max: 2000000, refill: 'No', drop: '0%', speed: '200K/day', quality: 'HQ', type: 'Non-Drop', dripfeed: true, tag: '2026' },

  // ================= GEO-TARGETED (EXPLORE ENGINE) =================
  { id: 74001, cat: 'ig_followers', name: 'Instagram Followers — Geo-Targeted Real Active', price: 300, min: 50, max: 200000, refill: '90 Days', drop: '~4%', speed: '6K/day', quality: 'Targeted', type: 'Non-Drop', dripfeed: true, geo: true, tag: 'Geo' },
  { id: 74002, cat: 'ig_likes', name: 'Instagram Likes — Geo-Targeted Real', price: 55, min: 20, max: 200000, refill: '30 Days', drop: '~4%', speed: '30K/day', quality: 'Targeted', type: 'Non-Drop', dripfeed: true, geo: true, tag: 'Geo' },
  { id: 74003, cat: 'ig_views', name: 'Instagram Reels Views — Geo-Targeted', price: 30, min: 100, max: 5000000, refill: 'No', drop: '0%', speed: '300K/day', quality: 'Targeted', type: 'Non-Drop', dripfeed: true, geo: true, tag: 'Geo' },
  { id: 74004, cat: 'yt_views', name: 'YouTube Views — Geo-Targeted High Retention', price: 260, min: 500, max: 5000000, refill: '30 Days', drop: '~1%', speed: '50K/day', quality: 'Targeted', type: 'Non-Drop', dripfeed: true, geo: true, tag: 'Geo' },
  { id: 74005, cat: 'tt_followers', name: 'TikTok Followers — Geo-Targeted Real', price: 340, min: 100, max: 100000, refill: '60 Days', drop: '~3%', speed: '10K/day', quality: 'Targeted', type: 'Non-Drop', dripfeed: true, geo: true, tag: 'Geo' },
  { id: 74006, cat: 'sp_listeners', name: 'Spotify Monthly Listeners — Geo-Targeted', price: 180, min: 500, max: 500000, refill: 'No', drop: '0%', speed: '20K/day', quality: 'Targeted', type: 'Non-Drop', dripfeed: true, geo: true, tag: 'Geo' },
]

export const serviceById = (id) => SERVICES.find((s) => s.id === Number(id))
export const categoryById = (id) => CATEGORIES.find((c) => c.id === id)
export const platformById = (id) => PLATFORMS.find((p) => p.id === id)
export const categoriesForPlatform = (platformId) => CATEGORIES.filter((c) => c.platform === platformId)
export const platformOfCategory = (catId) => platformById(categoryById(catId)?.platform)

// Drop behaviour, derived from the drop-rate field when a service doesn't declare
// an explicit `type`. "0%" or "No" drop => Non-Drop (guaranteed); otherwise Drop.
export const dropTypeOf = (s) => {
  if (!s) return 'Drop'
  if (s.type) return s.type
  const d = String(s.drop || '').trim()
  return d === '0%' || d === '0' || /^no$/i.test(d) ? 'Non-Drop' : 'Drop'
}

export const serviceMatchesType = (s, type) => type === 'all' || dropTypeOf(s) === type
export const platformOfService = (s) => platformOfCategory(s?.cat)
export const servicesForPlatform = (platformId) =>
  SERVICES.filter((s) => platformOfCategory(s.cat)?.id === platformId)
export const geoServices = () => SERVICES.filter((s) => s.geo)
export const powerServices = () => SERVICES.filter((s) => s.quality === 'Power')
