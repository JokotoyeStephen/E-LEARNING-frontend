import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/ui/Loader'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <Loader fullScreen />
  if (!user)   return <Navigate to="/login" replace />
  return <Outlet />
}
