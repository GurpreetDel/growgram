import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { serviceById } from '../data/services'
import { uid } from '../lib/helpers'
import { providerFor, providerRequest } from '../lib/providerApi'
import { isLiveEnabled, liveRequest, normalizeStatus } from '../lib/liveProvider'
import { useAuth } from './AuthContext.jsx'
import {
  loadData, saveData, defaultData,
  createTopup, getTopups, setTopupStatus, creditAccount,
} from '../lib/accountData'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

export function StoreProvider({ children }) {
  const { account, isAdmin } = useAuth()
  const accountId = account?.id || null
  const [state, setState] = useState(() => (accountId ? loadData(accountId, isAdmin) : defaultData()))
  const tick = useRef(null)

  // load the right account's data whenever the session changes
  useEffect(() => {
    setState(accountId ? loadData(accountId, isAdmin) : defaultData())
  }, [accountId, isAdmin])

  // persist current account's data
  useEffect(() => {
    if (accountId) saveData(accountId, state)
  }, [state, accountId])

  // live order-processing engine
  useEffect(() => {
    tick.current = setInterval(() => {
      setState((s) => {
        let changed = false
        const completedNow = []
        const orders = (s.orders || []).map((o) => {
          if (o.live) return o // real orders are driven by the live status poller, not the sim
          if (o.status === 'Completed' || o.status === 'Partial' || o.status === 'Canceled') return o
          const remaining = o.qty - o.delivered
          if (remaining <= 0) { changed = true; completedNow.push(o); return { ...o, status: 'Completed', delivered: o.qty } }
          const step = Math.max(1, Math.ceil(o.qty * (0.03 + Math.random() * 0.05)))
          const delivered = Math.min(o.qty, o.delivered + step)
          changed = true
          const done = delivered >= o.qty
          if (done) completedNow.push(o)
          return { ...o, delivered, status: done ? 'Completed' : 'In progress' }
        })
        if (!changed) return s
        const notifications = completedNow.length
          ? [
              ...completedNow.map((o) => ({
                id: uid('nt'), icon: '✅',
                text: `Order ${o.id} completed — ${o.qty.toLocaleString('en-IN')} delivered to ${o.link}`,
                at: Date.now(), read: false,
              })),
              ...(s.notifications || []),
            ].slice(0, 40)
          : s.notifications
        return { ...s, orders, notifications }
      })
    }, 1500)
    return () => clearInterval(tick.current)
  }, [])

  // live status poller: for REAL orders, pull start_count/remains/status from the provider
  useEffect(() => {
    const poll = setInterval(async () => {
      const live = (state.orders || []).filter(
        (o) => o.live && o.providerOrderId && !['Completed', 'Canceled', 'Partial'].includes(o.status)
      )
      if (!live.length || !isLiveEnabled()) return
      for (const o of live) {
        try {
          // Elite SMM (and some others) read the order id from `service` on status
          // calls, while standard panels use `order` — send both for compatibility.
          const r = await liveRequest('status', { order: o.providerOrderId, service: o.providerOrderId })
          const remains = Number(r.remains ?? 0)
          const delivered = Math.max(o.delivered, o.qty - remains)
          const status = normalizeStatus(r.status)
          setState((s) => ({
            ...s,
            orders: s.orders.map((x) => (x.id === o.id ? { ...x, delivered: Math.min(x.qty, delivered), status, startCount: Number(r.start_count ?? x.startCount) } : x)),
          }))
        } catch { /* transient provider/network error — retry next tick */ }
      }
    }, 8000)
    return () => clearInterval(poll)
  }, [state.orders])

  const notify = useCallback((icon, text) => {
    setState((s) => ({ ...s, notifications: [{ id: uid('nt'), icon, text, at: Date.now(), read: false }, ...(s.notifications || [])].slice(0, 40) }))
  }, [])

  const markNotificationsRead = useCallback(() => {
    setState((s) => ({ ...s, notifications: (s.notifications || []).map((n) => ({ ...n, read: true })) }))
  }, [])

  // ---- ADMIN: unlimited instant top-up to own treasury ----
  const adminAddFunds = useCallback((amount) => {
    const amt = Number(amount)
    if (!amt || amt <= 0) return { ok: false, error: 'Enter a valid amount' }
    setState((s) => ({
      ...s,
      balance: Math.round((s.balance + amt) * 100) / 100,
      transactions: [{ id: uid('tx'), type: 'Deposit', amount: amt, note: 'Owner top-up', at: Date.now() }, ...s.transactions],
      notifications: [{ id: uid('nt'), icon: '👑', text: `₹${amt.toLocaleString('en-IN')} added to treasury`, at: Date.now(), read: false }, ...(s.notifications || [])].slice(0, 40),
    }))
    return { ok: true }
  }, [])

  // ---- USER: real payment -> pending top-up request the admin approves ----
  const requestTopup = useCallback(({ amount, method, ref }) => {
    const amt = Number(amount)
    if (!amt || amt <= 0) return { ok: false, error: 'Enter a valid amount' }
    if (!account) return { ok: false, error: 'Please log in' }
    const t = createTopup({ accountId: account.id, accountName: account.name, accountEmail: account.email, amount: amt, method, ref })
    notify('⏳', `Top-up of ₹${amt.toLocaleString('en-IN')} submitted — awaiting confirmation`)
    return { ok: true, topup: t }
  }, [account, notify])

  const placeOrder = useCallback(({ serviceId, link, qty, charge, dripRuns = 1, country, liveServiceId }) => {
    const svc = serviceById(serviceId)
    if (!svc) return { ok: false, error: 'Unknown service' }
    const provider = providerFor(svc)
    // real dispatch only when a provider is connected AND a live provider service id is given
    const goLive = isLiveEnabled() && !!String(liveServiceId || '').trim()
    let result = { ok: false }
    const orderId = 'GG' + Date.now().toString(36).slice(-6).toUpperCase()
    setState((s) => {
      if (charge > s.balance) {
        result = { ok: false, error: 'Insufficient balance — add funds first.' }
        return s
      }
      const order = {
        id: orderId, serviceId, serviceName: svc.name, link, qty: Number(qty),
        startCount: 0, delivered: 0,
        charge, status: 'Pending', dripRuns, createdAt: Date.now(),
        provider: goLive ? 'Live provider' : provider.name, providerOrderId: null,
        country: country || null, live: goLive, simulated: !goLive,
        liveServiceId: goLive ? String(liveServiceId).trim() : null,
      }
      result = { ok: true, id: order.id, live: goLive }
      return {
        ...s,
        balance: Math.round((s.balance - charge) * 100) / 100,
        orders: [order, ...s.orders],
        transactions: [{ id: uid('tx'), type: 'Order', amount: -charge, note: order.id, at: Date.now() }, ...s.transactions],
      }
    })
    if (!result.ok) return result

    if (goLive) {
      // REAL order — send to the provider via the serverless proxy
      liveRequest('add', { service: String(liveServiceId).trim(), link, quantity: Number(qty), ...(dripRuns > 1 ? { runs: dripRuns, interval: 30 } : {}) })
        .then((res) => {
          const pid = res.order ?? res.id
          if (!pid) throw new Error(res.error || 'Provider did not return an order id')
          setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === orderId ? { ...o, providerOrderId: pid, status: 'In progress' } : o)) }))
          notify('🚀', `Order ${orderId} dispatched to provider (#${pid}) — delivering for real`)
        })
        .catch((err) => {
          // refund and mark failed so the user isn't charged for a non-delivery
          setState((s) => ({
            ...s,
            balance: Math.round((s.balance + charge) * 100) / 100,
            orders: s.orders.map((o) => (o.id === orderId ? { ...o, status: 'Canceled', failed: true } : o)),
            transactions: [{ id: uid('tx'), type: 'Refund', amount: charge, note: orderId + ' (provider error)', at: Date.now() }, ...s.transactions],
          }))
          notify('⚠️', `Live order failed: ${err.message} — refunded`)
        })
    } else {
      // DEMO — labelled simulation; log a provider round-trip for the console
      providerRequest(provider.id, { action: 'add', service: svc.id, link, quantity: Number(qty), ...(dripRuns > 1 ? { runs: dripRuns, interval: 30 } : {}) })
        .then((res) => setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === orderId ? { ...o, providerOrderId: res.order } : o)) })))
    }
    return result
  }, [notify])

  const requestRefill = useCallback((orderId) => {
    setState((s) => {
      const o = s.orders.find((x) => x.id === orderId)
      if (o) { const svc = serviceById(o.serviceId); providerRequest(providerFor(svc).id, { action: 'refill', order: o.providerOrderId }) }
      return { ...s, orders: s.orders.map((x) => (x.id === orderId && x.status === 'Completed' ? { ...x, status: 'In progress', delivered: Math.floor(x.qty * 0.9) } : x)) }
    })
  }, [])

  const cancelOrder = useCallback((orderId) => {
    setState((s) => {
      const o = s.orders.find((x) => x.id === orderId)
      if (!o || (o.status !== 'Pending' && o.status !== 'In progress')) return s
      const svc = serviceById(o.serviceId)
      providerRequest(providerFor(svc).id, { action: 'cancel', order: o.providerOrderId })
      const refund = Math.round((o.charge * (1 - o.delivered / o.qty)) * 100) / 100
      return {
        ...s,
        balance: Math.round((s.balance + refund) * 100) / 100,
        orders: s.orders.map((x) => (x.id === orderId ? { ...x, status: o.delivered > 0 ? 'Partial' : 'Canceled' } : x)),
        transactions: refund > 0 ? [{ id: uid('tx'), type: 'Refund', amount: refund, note: orderId, at: Date.now() }, ...s.transactions] : s.transactions,
      }
    })
  }, [])

  // ---------- inbox ----------
  const sendMessage = useCallback((peerId, text) => {
    if (!text.trim()) return
    setState((s) => {
      const thread = s.threads?.[peerId] || []
      return { ...s, threads: { ...(s.threads || {}), [peerId]: [...thread, { from: 'me', text: text.trim(), at: Date.now() }] } }
    })
  }, [])

  const receiveMessage = useCallback((peerId, text) => {
    setState((s) => {
      const thread = s.threads?.[peerId] || []
      return { ...s, threads: { ...(s.threads || {}), [peerId]: [...thread, { from: peerId, text, at: Date.now() }] } }
    })
  }, [])

  // ---------- admin: order management ----------
  const adminCompleteOrder = useCallback((orderId) => {
    setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === orderId ? { ...o, status: 'Completed', delivered: o.qty } : o)) }))
  }, [])

  const adminRefundOrder = useCallback((orderId) => {
    setState((s) => {
      const o = s.orders.find((x) => x.id === orderId)
      if (!o) return s
      return {
        ...s,
        balance: Math.round((s.balance + o.charge) * 100) / 100,
        orders: s.orders.map((x) => (x.id === orderId ? { ...x, status: 'Canceled' } : x)),
        transactions: [{ id: uid('tx'), type: 'Refund', amount: o.charge, note: orderId + ' (admin)', at: Date.now() }, ...s.transactions],
      }
    })
  }, [])

  // ---------- admin: top-up approvals (credits the requester's own wallet) ----------
  const approveTopup = useCallback((topupId) => {
    const t = setTopupStatus(topupId, 'Approved')
    if (t) creditAccount(t.accountId, t.amount, `${t.method} approved`)
    return t
  }, [])
  const rejectTopup = useCallback((topupId) => setTopupStatus(topupId, 'Rejected'), [])
  const creditUser = useCallback((userId, amount, note) => creditAccount(userId, Number(amount), note || 'Manual credit (admin)'), [])

  const resetMyData = useCallback(() => {
    if (!accountId) return
    setState(defaultData(isAdmin))
  }, [accountId, isAdmin])

  const value = {
    ...state,
    account, isAdmin,
    notify, markNotificationsRead,
    adminAddFunds, requestTopup, placeOrder, requestRefill, cancelOrder,
    sendMessage, receiveMessage,
    adminCompleteOrder, adminRefundOrder,
    approveTopup, rejectTopup, creditUser, getTopups,
    resetMyData,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
