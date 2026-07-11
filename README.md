# GrowGram — Next-Gen Instagram SMM Panel

A modern, beautiful **Social Media Marketing (SMM) panel** for Instagram growth, built as a
single-page React app. It reimagines the classic SMM reseller panel (services → order → wallet
→ tracking) with a 2027-grade glassmorphism UI, a **live order-fulfilment engine**, and an
**AI Content Studio** growth co-pilot.

> ⚠️ **Demo / educational project.** All order fulfilment is *simulated* client-side. It is not
> affiliated with Instagram / Meta and does not deliver real engagement. Built for portfolio,
> UI/UX, and learning purposes.

## ✨ Features

- **Services catalogue** — 17 Instagram services (followers, likes, reel views, comments,
  story/live) with per-1,000 pricing, min/max, refill windows, drop rates and speed.
- **New Order flow** — category → service → link parsing → quantity → **live price calc** →
  optional **drip-feed** scheduling.
- **Live order engine** — orders fill in real time with animated progress bars and status
  (Pending → In progress → Completed / Partial / Canceled).
- **Wallet** — top up via UPI / Card / Crypto / PayPal (simulated), 10% bonus tiers, full
  transaction history, auto-refund on cancellation.
- **AI Content Studio** — one-click caption + viral hashtag generation, best-time-to-post
  heatmap, and a growth playbook. (Swap `src/lib/aiStudio.js` for a real Claude API call to
  go fully live.)
- **Analytics** — 7-day spend chart, service-mix breakdown, completion rate, avg order value.
- **Refer & Earn** — referral code + link with lifetime commission model.
- **Growth Co-Pilot** — instant profile audit with actionable tips.
- Fully **responsive** with a mobile tab-bar, dark Instagram-gradient theme.

## 🛠 Tech stack

- React 18 + Vite
- React Router v6
- 100% client-side (state persisted to `localStorage`) — deploys anywhere static.

## 🚀 Run locally

```bash
npm install
npm run dev
```

## 📦 Build

```bash
npm run build     # outputs to /dist
npm run preview
```

## ☁️ Deploy

Ships with `vercel.json` (SPA rewrite). Deploy to Vercel/Netlify with build command
`npm run build` and output dir `dist`.

---

Made with 💜 — inspired by the classic SMM panel pattern, rebuilt for 2027.
