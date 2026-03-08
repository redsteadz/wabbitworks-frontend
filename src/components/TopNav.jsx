import { Link } from 'react-router-dom'
import useAppStore from '../stores/useAppStore'

const TopNav = () => {
  const user = useAppStore((state) => state.user)
  const logout = useAppStore((state) => state.logout)

  return (
    <header className="navbar bg-base-200/70 backdrop-blur-md rounded-box shadow-sm mb-6">
      <div className="flex-1">
        <Link to="/app" className="btn btn-ghost text-xl">
          WabbitWorks
        </Link>
      </div>
      <div className="flex-none gap-3">
        {user && (
          <div className="text-sm text-base-content/80 hidden sm:block">
            {user.first_name} {user.last_name}
          </div>
        )}
        <button className="btn btn-outline btn-sm" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  )
}

export default TopNav
