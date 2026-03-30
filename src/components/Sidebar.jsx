import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAppStore from '../stores/useAppStore'

const Sidebar = () => {
  const teams = useAppStore((state) => state.teams)
  const activeTeamId = useAppStore((state) => state.activeTeamId)
  const setActiveTeamId = useAppStore((state) => state.setActiveTeamId)
  const createTeam = useAppStore((state) => state.createTeam)

  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const onCreate = async (event) => {
    event.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const team = await createTeam({ name: name.trim(), description: '' })
      setActiveTeamId(team.id)
      setName('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <aside className="bg-base-200/70 backdrop-blur-md rounded-box p-4 shadow-sm h-full">
      <div className="font-semibold text-sm mb-4">Teams</div>
      <div className="space-y-2 mb-6">
        {teams.length === 0 && <div className="text-xs text-base-content/60">Create your first team.</div>}
        {teams.map((team) => (
          <Link
            key={team.id}
            to={`/teams/${team.id}`}
            onClick={() => setActiveTeamId(team.id)}
            className={`btn btn-sm w-full justify-start ${
              activeTeamId === team.id ? 'btn-primary text-primary-content' : 'btn-ghost'
            }`}
          >
            {team.name}
          </Link>
        ))}
      </div>

      <form onSubmit={onCreate} className="space-y-2">
        <input
          className="input input-bordered input-sm w-full"
          placeholder="New team name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button className="btn btn-primary btn-sm w-full" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create team'}
        </button>
      </form>
    </aside>
  )
}

export default Sidebar
