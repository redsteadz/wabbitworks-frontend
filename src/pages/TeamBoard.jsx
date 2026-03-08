import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAppStore from '../stores/useAppStore'
import TaskCard from '../components/TaskCard'
import tokens from '../theme/tokens'

const statuses = ['todo', 'in_progress', 'review', 'completed']

const TeamBoard = () => {
  const { teamId } = useParams()
  const tasksByTeam = useAppStore((state) => state.tasksByTeam)
  const teams = useAppStore((state) => state.teams)
  const fetchTeamTasks = useAppStore((state) => state.fetchTeamTasks)
  const createTask = useAppStore((state) => state.createTask)
  const updateTask = useAppStore((state) => state.updateTask)

  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', due_date: '' })
  const [saving, setSaving] = useState(false)

  const activeTeam = teams.find((team) => team.id === teamId)
  const tasks = tasksByTeam[teamId] || []

  useEffect(() => {
    if (teamId) {
      fetchTeamTasks(teamId)
    }
  }, [teamId, fetchTeamTasks])

  const filteredTasks = useMemo(() => {
    if (!query.trim()) return tasks
    const q = query.toLowerCase()
    return tasks.filter((task) => task.title.toLowerCase().includes(q) || (task.description || '').toLowerCase().includes(q))
  }, [tasks, query])

  const onCreate = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    try {
      await createTask(teamId, {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        due_date: form.due_date || null,
      })
      setForm({ title: '', description: '', priority: 'medium', due_date: '' })
    } finally {
      setSaving(false)
    }
  }

  const onStatusChange = async (task, status) => {
    if (status === task.status) return
    await updateTask(task.id, { status })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{activeTeam?.name || 'Team board'}</h1>
          <p className="text-sm text-base-content/60">Track work across the team with focused workflows.</p>
        </div>
        <div className="flex gap-3">
          <input
            className="input input-bordered input-sm w-full lg:w-64"
            placeholder="Search tasks"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="bg-base-100/90 backdrop-blur-sm shadow-sm rounded-box p-4">
        <form onSubmit={onCreate} className="grid grid-cols-1 lg:grid-cols-6 gap-3">
          <input
            className="input input-bordered lg:col-span-2"
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
          <input
            className="input input-bordered lg:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <select
            className="select select-bordered"
            value={form.priority}
            onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
          >
            {Object.entries(tokens.priority).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
          <input
            className="input input-bordered"
            type="date"
            value={form.due_date}
            onChange={(event) => setForm((prev) => ({ ...prev, due_date: event.target.value }))}
          />
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Adding...' : 'Add task'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {statuses.map((status) => {
          const columnTasks = filteredTasks.filter((task) => task.status === status)
          const meta = tokens.status[status]
          return (
            <div key={status} className="bg-base-200/70 rounded-box p-3 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{meta.label}</div>
                <span className={`badge badge-${meta.color} badge-sm`}>{columnTasks.length}</span>
              </div>
              <div className="space-y-3">
                {columnTasks.length ? (
                  columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
                  ))
                ) : (
                  <div className="text-xs text-base-content/60">No tasks yet.</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TeamBoard
