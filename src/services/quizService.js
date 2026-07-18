import api from './api'
export const quizService = {
  generate:    (courseId, checkpoint = 'final')             => api.get(`/quiz/generate/${courseId}`, { params: { checkpoint } }).then(r => r.data),
  submit:      (courseId, answers, difficulty, checkpoint = 'final') => api.post(`/quiz/submit/${courseId}`, { answers, difficulty, checkpoint }).then(r => r.data),
  getHistory:  (courseId)                      => api.get(`/quiz/history/${courseId}`).then(r => r.data),
  getProgress: (courseId)                      => api.get(`/quiz/progress/${courseId}`).then(r => r.data),
}
