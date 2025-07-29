import api from './api'
import type { DailyOverview, ModeStats } from '../interfaces'

export const statsService = {
  async getDailyOverview(date?: string): Promise<DailyOverview> {
    const res = await api.get<DailyOverview>('/stats/overview', { params: { date } })
    return res.data
  },
  
  async getModeStats(modeId: number, date?: string): Promise<ModeStats> {
    const res = await api.get<ModeStats>(`/stats/mode/${modeId}`, { params: { date } })
    return res.data
  },
}
