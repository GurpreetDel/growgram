// Client-side account system for GrowGram.
// Registered users live in localStorage; the panel owner ("admin") is a fixed,
// built-in account. Passwords are stored as a lightweight salted hash — this is a
// browser-only demo, so treat it as obfuscation, not real cryptographic security.

const USERS_KEY = 'growgram.users.v1'
const SESSION_KEY = 'growgram.session.v1'

// Built-in panel owner. Username "admin" logs in with this password.
export const ADMIN = {
  id: 'admin',
  username: 'admin',
  name: 'Admin (Panel Owner)',
  email: 'admin@growgram.app',
  role: 'admin',
  password: 'Admin@2026JaisairamJaiganesh',
}

// small deterministic hash — enough to avoid storing raw passwords in the demo
export function hash(str) {
  let h = 0x811c9dc5
  const salt = 'growgram::2026'
  const s = salt + String(str) + salt
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16)
}

export const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}

const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users))

export function registerUser({ name, email, phone, password }) {
  const users = getUsers()
  const clean = (email || '').trim().toLowerCase()
  if (!name || !name.trim()) return { ok: false, error: 'Enter your name' }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) return { ok: false, error: 'Enter a valid email' }
  if (!password || password.length < 6) return { ok: false, error: 'Password must be at least 6 characters' }
  if (clean === ADMIN.email || (email || '').trim().toLowerCase() === 'admin')
    return { ok: false, error: 'That account is reserved' }
  if (users.some((u) => u.email === clean)) return { ok: false, error: 'An account with this email already exists' }
  const user = {
    id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name.trim(), email: clean, phone: (phone || '').trim(),
    passHash: hash(password), role: 'user', createdAt: Date.now(),
  }
  saveUsers([...users, user])
  return { ok: true, account: publicAccount(user) }
}

export function authenticate(identifier, password) {
  const id = (identifier || '').trim()
  // admin path (username OR admin email)
  if (id.toLowerCase() === ADMIN.username || id.toLowerCase() === ADMIN.email) {
    if (password === ADMIN.password) return { ok: true, account: { id: ADMIN.id, name: ADMIN.name, email: ADMIN.email, role: 'admin' } }
    return { ok: false, error: 'Wrong admin password' }
  }
  const users = getUsers()
  const u = users.find((x) => x.email === id.toLowerCase())
  if (!u) return { ok: false, error: 'No account found — please register first' }
  if (u.passHash !== hash(password)) return { ok: false, error: 'Incorrect password' }
  return { ok: true, account: publicAccount(u) }
}

const publicAccount = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: 'user' })

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}
export const setSession = (account) => localStorage.setItem(SESSION_KEY, JSON.stringify(account))
export const clearSession = () => localStorage.removeItem(SESSION_KEY)

// admin roster view (never exposes password hashes beyond what's stored)
export const listAccounts = () => getUsers().map(publicAccount)
