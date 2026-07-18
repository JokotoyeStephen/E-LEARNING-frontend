import { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user)
    localStorage.setItem('user',  JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    return data
  }

  const register = async (name, email, password, role = 'student') => {
    // Backend creates the account but withholds the token until the email's
    // OTP is verified — no auto-login here.
    return authService.register(name, email, password, role)
  }

  // Called by VerifyEmail after a successful OTP check (backend returns a token then)
  const loginWithToken = (user, token) => {
    setUser(user)
    localStorage.setItem('user',  JSON.stringify(user))
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
