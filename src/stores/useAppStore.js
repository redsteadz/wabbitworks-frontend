import { create } from 'zustand'
import api from '../api/client'

const normalizeTasks = (tasks = []) => tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

const useAppStore = create((set, get) => ({
  user: null,
  teams: [],
  activeTeamId: null,
  tasksByTeam: {},
  dashboard: null,
  loading: false,
  error: null,

  setError: (error) => set({ error }),
  setActiveTeamId: (teamId) => set({ activeTeamId: teamId }),

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data.user })
      return data.user
    } catch (error) {
      set({ user: null })
      return null
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/auth/login', payload)
      set({ user: data.user, loading: false })
      return data.user
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/auth/register', payload)
      set({ user: data.user, loading: false })
      return data.user
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      set({ user: null, teams: [], tasksByTeam: {}, dashboard: null })
    }
  },

  fetchTeams: async () => {
    const { data } = await api.get('/teams')
    set((state) => ({
      teams: data.teams,
      activeTeamId: state.activeTeamId || data.teams?.[0]?.id || null,
    }))
    return data.teams
  },

  createTeam: async (payload) => {
    const { data } = await api.post('/teams', payload)
    set((state) => ({
      teams: [data.team, ...state.teams],
      activeTeamId: data.team.id,
    }))
    return data.team
  },

  fetchDashboard: async () => {
    const { data } = await api.get('/dashboard')
    set({ dashboard: data })
    return data
  },

  fetchTeamTasks: async (teamId, params = {}) => {
    const { data } = await api.get(`/tasks/teams/${teamId}`, { params })
    set((state) => ({
      tasksByTeam: {
        ...state.tasksByTeam,
        [teamId]: normalizeTasks(data.tasks),
      },
    }))
    return data.tasks
  },

  createTask: async (teamId, payload) => {
    const { data } = await api.post(`/tasks/teams/${teamId}`, payload)
    set((state) => ({
      tasksByTeam: {
        ...state.tasksByTeam,
        [teamId]: normalizeTasks([data.task, ...(state.tasksByTeam[teamId] || [])]),
      },
    }))
    return data.task
  },

  updateTask: async (taskId, payload) => {
    const { data } = await api.patch(`/tasks/${taskId}`, payload)
    const updated = data.task
    set((state) => {
      const teamId = updated.team_id
      const current = state.tasksByTeam[teamId] || []
      const next = current.map((task) => (task.id === updated.id ? updated : task))
      return {
        tasksByTeam: {
          ...state.tasksByTeam,
          [teamId]: normalizeTasks(next),
        },
      }
    })
    return updated
  },

  completeTask: async (taskId) => {
    const { data } = await api.post(`/tasks/${taskId}/complete`)
    const updated = data.task
    set((state) => {
      const teamId = updated.team_id
      const current = state.tasksByTeam[teamId] || []
      const next = current.map((task) => (task.id === updated.id ? updated : task))
      return {
        tasksByTeam: {
          ...state.tasksByTeam,
          [teamId]: normalizeTasks(next),
        },
      }
    })
    return updated
  },
}))

export default useAppStore
