// Per-account persistence. Each account (admin or a registered user) gets its own
// wallet, orders, transactions, notifications and inbox under its own storage key,
// so the panel behaves like a real multi-tenant SMM system.

import { uid } from './helpers'

const dataKey = (id) => 'growgram.data.' + id
const TOPUPS_KEY = 'growgram.topups.v1' // global queue the admin approves

export const defaultData = (isAdmin = false) => ({
  balance: isAdmin ? 500000 : 0,
  orders: [],
  transactions: isAdmin
    ? [{ id: uid('tx'), type: 'Bonus', amount: 500000, note: 'Owner treasury', at: Date.now() }]
    : [],
  notifications: [
    isAdmin
      ? { id: uid('nt'), icon: '👑', text: 'Welcome, panel owner — treasury funded.', at: Date.now(), read: false }
      : { id: uid('nt'), icon: '🎉', text: 'Account created. Add funds to start ordering.', at: Date.now(), read: false },
  ],
  threads: {}, // inbox: { peerId: [{from,text,at}] }
  referralCode: 'GROW-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
  referralEarnings: 0,
})

export const loadData = (id, isAdmin = false) => {
  try {
    const raw = localStorage.getItem(dataKey(id))
    if (raw) return { ...defaultData(isAdmin), ...JSON.parse(raw) }
  } catch {}
  return defaultData(isAdmin)
}

export const saveData = (id, data) => {
  try { localStorage.setItem(dataKey(id), JSON.stringify(data)) } catch {}
}

// credit an arbitrary account (used by admin approvals) — writes straight to that
// account's key so the balance is waiting for them next time they load.
export const creditAccount = (id, amount, note) => {
  const d = loadData(id)
  const amt = Number(amount)
  d.balance = Math.round((d.balance + amt) * 100) / 100
  d.transactions = [{ id: uid('tx'), type: 'Deposit', amount: amt, note: note || 'Top-up approved', at: Date.now() }, ...(d.transactions || [])]
  d.notifications = [{ id: uid('nt'), icon: '✅', text: `₹${amt.toLocaleString('en-IN')} added to your wallet (${note || 'approved'})`, at: Date.now(), read: false }, ...(d.notifications || [])].slice(0, 40)
  saveData(id, d)
  return d.balance
}

// ---------- top-up request queue ----------
export const getTopups = () => {
  try { return JSON.parse(localStorage.getItem(TOPUPS_KEY) || '[]') } catch { return [] }
}
const saveTopups = (list) => localStorage.setItem(TOPUPS_KEY, JSON.stringify(list))

export const createTopup = ({ accountId, accountName, accountEmail, amount, method, ref }) => {
  const t = {
    id: 'TP' + Date.now().toString(36).slice(-6).toUpperCase(),
    accountId, accountName, accountEmail,
    amount: Number(amount), method: method || 'UPI', ref: ref || '',
    status: 'Pending', at: Date.now(),
  }
  saveTopups([t, ...getTopups()])
  return t
}

export const setTopupStatus = (id, status) => {
  const list = getTopups()
  const t = list.find((x) => x.id === id)
  if (!t) return null
  t.status = status
  t.resolvedAt = Date.now()
  saveTopups(list)
  return t
}

export const myTopups = (accountId) => getTopups().filter((t) => t.accountId === accountId)
