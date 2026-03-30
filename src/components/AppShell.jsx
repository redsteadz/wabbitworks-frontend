import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'
import Sidebar from './Sidebar'

const AppShell = () => {
  return (
    <div className="min-h-screen container py-6">
      <TopNav />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <Sidebar />
        </div>
        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
