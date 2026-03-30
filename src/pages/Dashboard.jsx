import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAppStore from '../stores/useAppStore'
import StatCard from '../components/StatCard'
import TaskCard from '../components/TaskCard'

const Dashboard = () => {
  const dashboard = useAppStore((state) => state.dashboard)
  const teams = useAppStore((state) => state.teams)
  const fetchDashboard = useAppStore((state) => state.fetchDashboard)
  const fetchTeams = useAppStore((state) => state.fetchTeams)

  useEffect(() => {
    fetchDashboard()
    fetchTeams()
  }, [fetchDashboard, fetchTeams])

  const statusCounts = dashboard?.statusCounts || {}

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Teams" value={dashboard?.teamsCount ?? 0} tone="primary" />
        <StatCard label="Assigned Tasks" value={Object.values(statusCounts).reduce((a, b) => a + b, 0)} tone="base" />
        <StatCard label="Due Soon" value={dashboard?.dueSoonCount ?? 0} tone="warning" />
        <StatCard label="Overdue" value={dashboard?.overdueCount ?? 0} tone="error" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming tasks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboard?.upcomingTasks?.length ? (
              dashboard.upcomingTasks.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={() => {}} />
              ))
            ) : (
              <div className="text-sm text-base-content/60">No upcoming tasks yet.</div>
            )}
          </div>
        </div>

        <div className="bg-base-100/90 backdrop-blur-sm shadow-sm rounded-box p-4">
          <h2 className="text-lg font-semibold mb-3">Teams overview</h2>
          <div className="space-y-3">
            {teams.length ? (
              teams.map((team) => (
                <div key={team.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{team.name}</div>
                    <div className="text-xs text-base-content/60">Role: {team.role}</div>
                  </div>
                  <Link to={`/teams/${team.id}`} className="btn btn-ghost btn-xs">
                    Open
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-sm text-base-content/60">Create a team to get started.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
