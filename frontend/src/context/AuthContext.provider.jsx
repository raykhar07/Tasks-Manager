import {useState, useEffect} from 'react';
import {AuthContext} from './AuthContext.jsx'
import {registerRequest, loginRequest, verifyTokenRequest, logoutRequest} from '../api/auth.js'

const getErrors = (error) => {
  const data = error.response?.data
  if (Array.isArray(data)) {
    return data
  }
  return [data?.message ?? 'No se pudo conectar con el servidor']
}


export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)

  const signUp = async (user) => {
    try {
    const res = await registerRequest(user)
    setUser(res.data.data)
    setIsAuthenticated(true)
    } catch (error) {
      setErrors(getErrors(error))
    }
  }

  const signIn = async (user) => {
    try {
      const res = await loginRequest(user)
      setUser(res.data.data)
      setIsAuthenticated(true)
    } catch (error) {
      setErrors(getErrors(error))
    }
  }

  const logout = async () => {
  try {
    await logoutRequest()
  } catch (error) {
    console.error(error)
  }
  setIsAuthenticated(false)
  setUser(null)
}

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([])
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errors])

  useEffect(() => {
  const checkLogin = async () => {
    try {
      const res = await verifyTokenRequest()
      if (res.data) {
        setUser(res.data)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }
  checkLogin()
}, [])

  return (
    <AuthContext.Provider value={{signUp, user, loading, isAuthenticated, errors, signIn, logout}}>
      {children}
    </AuthContext.Provider>
  )
}