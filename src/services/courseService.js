import api from './api'
export const courseService = {
  // Student
  getAll:           (params) => api.get('/courses',              { params }).then(r => r.data),
  getById:          (id)     => api.get(`/courses/${id}`).then(r => r.data),
  enroll:           (id)     => api.post(`/courses/${id}/enroll`).then(r => r.data),
  getEnrolled:      ()       => api.get('/courses/enrolled').then(r => r.data),
  completeTopic:    (id, topicName) => api.post(`/courses/${id}/topics/${encodeURIComponent(topicName)}/complete`).then(r => r.data),
  getCertificate:   (id)     => api.get(`/courses/${id}/certificate`, { responseType: 'blob' }).then(r => r.data),
  verifyCertificate:(certificateId) => api.get(`/courses/certificates/verify/${certificateId}`).then(r => r.data),

  // Reviews
  getReviews:       (id)              => api.get(`/courses/${id}/reviews`).then(r => r.data),
  submitReview:     (id, rating, comment) => api.post(`/courses/${id}/reviews`, { rating, comment }).then(r => r.data),

  // Q&A
  getQuestions:     (id)      => api.get(`/courses/${id}/questions`).then(r => r.data),
  askQuestion:      (id, text) => api.post(`/courses/${id}/questions`, { text }).then(r => r.data),
  answerQuestion:   (id, questionId, answer) => api.post(`/courses/${id}/questions/${questionId}/answer`, { answer }).then(r => r.data),

  // Instructor
  getMyCourses:     ()       => api.get('/courses/mine').then(r => r.data),
  createCourse:     (data)   => api.post('/courses', data).then(r => r.data),
  updateCourse:     (id, data) => api.put(`/courses/${id}`, data).then(r => r.data),
  deleteCourse:     (id)     => api.delete(`/courses/${id}`).then(r => r.data),
}
