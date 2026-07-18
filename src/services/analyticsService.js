import api from './api'

export const analyticsService = {
  getOverview: () => api.get('/analytics').then(r => r.data),
}
