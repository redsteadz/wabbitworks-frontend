import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import TeamBoard from './pages/TeamBoard'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/teams/:teamId" element={<TeamBoard />} />
          <Route path="/" element={<Navigate to="/app" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}

export default App
