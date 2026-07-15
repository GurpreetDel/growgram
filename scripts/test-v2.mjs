// Quick harness: exercises the GrowGram Native provider handler like Vercel would.
import handler from '../api/v2.js'

const call = (body, method = 'POST') => new Promise((resolve) => {
  const req = { method, body, query: {} }
  const res = {
    headers: {}, code: 200,
    setHeader(k, v) { this.headers[k] = v },
    status(c) { this.code = c; return this },
    json(o) { resolve({ code: this.code, body: o }) },
    end() { resolve({ code: this.code, body: null }) },
  }
  handler(req, res)
})

const key = 'gg_testkey12345678'

let r = await call({}, 'GET')
console.log('GET ping        →', JSON.stringify(r.body))

r = await call({ action: 'balance', key: 'short' })
console.log('bad key         →', JSON.stringify(r.body))

r = await call({ action: 'balance', key })
console.log('balance         →', JSON.stringify(r.body))

r = await call({ action: 'services', key })
console.log('services        →', r.body.length, 'services; first:', JSON.stringify(r.body[0]))

r = await call({ action: 'add', key, service: '9999999', link: 'x', quantity: 100 })
console.log('add bad service →', JSON.stringify(r.body))

r = await call({ action: 'add', key, service: '1002', link: 'https://instagram.com/someone', quantity: 10 })
console.log('add low qty     →', JSON.stringify(r.body))

r = await call({ action: 'add', key, service: '1002', link: 'https://instagram.com/someone', quantity: 1000 })
console.log('add ok          →', JSON.stringify(r.body))
const order = r.body.order

r = await call({ action: 'status', key, order })
console.log('status t=0      →', JSON.stringify(r.body))

// form-encoded string body (how the proxy actually sends it)
r = await call(`key=${key}&action=status&order=${order}`)
console.log('status (form)   →', JSON.stringify(r.body))

// simulate an order created 3 minutes ago and one created 2 hours ago
const EPOCH = 1767225600
const fake = (agoSec, sid, qty) =>
  '1' + String(Math.floor(Date.now() / 1000) - EPOCH - agoSec).padStart(8, '0') + String(sid).padStart(5, '0') + String(qty).padStart(8, '0')

r = await call({ action: 'status', key, order: fake(180, 1002, 1000) })
console.log('status t=3min   →', JSON.stringify(r.body))
r = await call({ action: 'status', key, order: fake(7200, 1002, 1000) })
console.log('status t=2h     →', JSON.stringify(r.body))
r = await call({ action: 'status', key, orders: `${fake(180, 2001, 500)},${fake(7200, 3001, 20000)}` })
console.log('multi-status    →', JSON.stringify(r.body))
r = await call({ action: 'refill', key, order: fake(7200, 1002, 1000) })
console.log('refill          →', JSON.stringify(r.body))
r = await call({ action: 'cancel', key, order: 'garbage' })
console.log('cancel bad id   →', JSON.stringify(r.body))
