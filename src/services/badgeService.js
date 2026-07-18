import api from './api'
export const badgeService = {
  getAll: () => api.get('/badges').then(r => r.data),
}
