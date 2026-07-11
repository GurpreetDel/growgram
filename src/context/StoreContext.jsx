import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { serviceById } from '../data/services'
import { uid } from '../lib/helpers'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

const KEY = 'growgram.state.v1'

const seedOrders = () => {
  const now = Date.now()
  return [
    {
      id: 'GG' + (now - 8_600_000).toString(36).slice(-6).toUpperCase(),
      serviceId: 1002, serviceName: 'Instagram Followers — HQ [30d Refill]',
      link: '@growgram.demo', qty: 5000, startCount: 1240, delivered: 5000,
      charge: 325, status: 'Completed', dripRuns: 1, createdAt: now - 8_600_000,
    },
    {
      id: 'GG' + (now - 3_200_000).toString(36).slice(-6).toUpperCase(),
      serviceId: 3002, serviceName: 'Instagram Reels Views [Boosted]',
      link: 'https://instagram.com/reel/CxDemo123', qty: 50000, startCount: 800, delivered: 33120,
      charge: 450, status: 'In progress', dripRuns: 1, createdAt: now - 3_200_000,
    },
  ]
}

const defaultState = () => ({
  user: null, // { name, email }
  balance: 500, // starting demo credit
  orders: seedOrders(),
  transactions: [
    { id: uid('tx'), type: 'Bonus', amount: 500, note: 'Welcome credit', at: Date.now() - 9_000_000 },
  ],
  referralCode: 'GROW-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
  referralEarnings: 0,
})

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...defaultState(), ...JSON.parse(raw) }
  } catch {}
  return defaultState()
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const tick = useRef(null)

  // persist
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  // live order-processing engine: advances any "In progress" / "Pending" order
  useEffect(() => {
    tick.current = setInterval(() => {
      setState((s) => {
        let changed = false
        const orders = s.orders.map((o) => {
          if (o.status === 'Completed' || o.status === 'Partial' || o.status === 'Canceled') return o
          const svc = serviceById(o.serviceId)
          // speed: deliver ~3–8% of remaining each tick so small orders finish fast, big ones stream
          const remaining = o.qty - o.delivered
          if (remaining <= 0) {
            changed = true
            return { ...o, status: 'Completed', delivered: o.qty }
          }
          const step = Math.max(1, Math.ceil(o.qty * (0.03 + Math.random() * 0.05)))
          const delivered = Math.min(o.qty, o.delivered + step)
          changed = true
          const status = delivered >= o.qty ? 'Completed' : 'In progress'
          return { ...o, delivered, status: svc?.drop === '0%' ? status : status }
        })
        return changed ? { ...s, orders } : s
      })
    }, 1500)
    return () => clearInterval(tick.current)
  }, [])

  const login = useCallback((name, email) => {
    setState((s) => ({ ...s, user: { name: name || 'Creator', email: email || 'you@growgram.app' } }))
  }, [])

  const logout = useCallback(() => setState((s) => ({ ...s, user: null })), [])

  const addFunds = useCallback((amount, method = 'UPI') => {
    const amt = Number(amount)
    if (!amt || amt <= 0) return { ok: false, error: 'Enter a valid amount' }
    setState((s) => ({
      ...s,
      balance: Math.round((s.balance + amt) * 100) / 100,
      transactions: [
        { id: uid('tx'), type: 'Deposit', amount: amt, note: method, at: Date.now() },
        ...s.transactions,
      ],
    }))
    return { ok: true }
  }, [])

  const placeOrder = useCallback(({ serviceId, link, qty, charge, dripRuns = 1 }) => {
    const svc = serviceById(serviceId)
    if (!svc) return { ok: false, error: 'Unknown service' }
    let result = { ok: false }
    setState((s) => {
      if (charge > s.balance) {
        result = { ok: false, error: 'Insufficient balance — add funds first.' }
        return s
      }
      const order = {
        id: 'GG' + Date.now().toString(36).slice(-6).toUpperCase(),
        serviceId, serviceName: svc.name, link, qty: Number(qty),
        startCount: Math.floor(Math.random() * 4000), delivered: 0,
        charge, status: 'Pending', dripRuns, createdAt: Date.now(),
      }
      result = { ok: true, id: order.id }
      return {
        ...s,
        balance: Math.round((s.balance - charge) * 100) / 100,
        orders: [order, ...s.orders],
        transactions: [
          { id: uid('tx'), type: 'Order', amount: -charge, note: order.id, at: Date.now() },
          ...s.transactions,
        ],
      }
    })
    return result
  }, [])

  const requestRefill = useCallback((orderId) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === orderId && o.status === 'Completed'
          ? { ...o, status: 'In progress', delivered: Math.floor(o.qty * 0.9) }
          : o
      ),
    }))
  }, [])

  const cancelOrder = useCallback((orderId) => {
    setState((s) => {
      const o = s.orders.find((x) => x.id === orderId)
      if (!o || (o.status !== 'Pending' && o.status !== 'In progress')) return s
      const refund = Math.round((o.charge * (1 - o.delivered / o.qty)) * 100) / 100
      return {
        ...s,
        balance: Math.round((s.balance + refund) * 100) / 100,
        orders: s.orders.map((x) =>
          x.id === orderId ? { ...x, status: o.delivered > 0 ? 'Partial' : 'Canceled' } : x
        ),
        transactions: refund > 0
          ? [{ id: uid('tx'), type: 'Refund', amount: refund, note: orderId, at: Date.now() }, ...s.transactions]
          : s.transactions,
      }
    })
  }, [])

  const resetDemo = useCallback(() => {
    localStorage.removeItem(KEY)
    setState(defaultState())
  }, [])

  const value = {
    ...state,
    login, logout, addFunds, placeOrder, requestRefill, cancelOrder, resetDemo,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
