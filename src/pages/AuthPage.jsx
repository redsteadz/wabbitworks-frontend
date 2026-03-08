import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAppStore from '../stores/useAppStore'

const AuthPage = ({ mode = 'login' }) => {
  const navigate = useNavigate()
  const login = useAppStore((state) => state.login)
  const register = useAppStore((state) => state.register)
  const loading = useAppStore((state) => state.loading)
  const error = useAppStore((state) => state.error)

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })

  const isRegister = mode === 'register'

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (isRegister) {
      await register(form)
    } else {
      await login({ email: form.email, password: form.password })
    }
    navigate('/app')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-100/90 backdrop-blur-sm shadow-lg rounded-box p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">WabbitWorks</h1>
          <p className="text-sm text-base-content/70">
            {isRegister ? 'Create your workspace in minutes.' : 'Welcome back, keep the team on track.'}
          </p>
        </div>

        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input input-bordered w-full"
                placeholder="First name"
                name="first_name"
                value={form.first_name}
                onChange={onChange}
                required
              />
              <input
                className="input input-bordered w-full"
                placeholder="Last name"
                name="last_name"
                value={form.last_name}
                onChange={onChange}
                required
              />
            </div>
          )}
          <input
            className="input input-bordered w-full"
            placeholder="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            className="input input-bordered w-full"
            placeholder="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
          />
          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Working...' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          {isRegister ? (
            <Link to="/login" className="link link-hover">
              Already have an account? Sign in
            </Link>
          ) : (
            <Link to="/register" className="link link-hover">
              New here? Create an account
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
