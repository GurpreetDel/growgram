import { createContext, useContext, useState, useCallback } from 'react'
import { authenticate, registerUser, getSession, setSession, clearSession } from '../lib/auth'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(() => getSession())

  const login = useCallback((identifier, password) => {
    const res = authenticate(identifier, password)
    if (res.ok) { setSession(res.account); setAccount(res.account) }
    return res
  }, [])

  const register = useCallback((form) => {
    const res = registerUser(form)
    if (res.ok) { setSession(res.account); setAccount(res.account) }
    return res
  }, [])

  const logout = useCallback(() => { clearSession(); setAccount(null) }, [])

  const value = {
    account,
    isAuthed: !!account,
    isAdmin: account?.role === 'admin',
    login, register, logout,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
