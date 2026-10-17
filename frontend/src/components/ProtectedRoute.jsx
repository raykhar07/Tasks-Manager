import { useAuth } from '../hooks/useAuth.jsx'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const {loading, isAuthenticated} = useAuth()

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-[calc(100vh-160px)] items-center justify-center"
      >
        <p className="text-sm text-ink-soft">Comprobando tu sesión…</p>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <Outlet />
  )
}
