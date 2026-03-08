import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAppStore from '../stores/useAppStore'

const ProtectedRoute = () => {
  const user = useAppStore((state) => state.user)
  const fetchMe = useAppStore((state) => state.fetchMe)
  const location = useLocation()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) {
        await fetchMe()
      }
      if (mounted) setChecking(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [user, fetchMe])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
