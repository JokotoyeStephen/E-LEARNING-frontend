import api from './api'
export const instructorService = {
  getOverview:        ()   => api.get('/instructor/overview').then(r => r.data),
  getCourseAnalytics: (id) => api.get(`/instructor/courses/${id}/analytics`).then(r => r.data),
}
