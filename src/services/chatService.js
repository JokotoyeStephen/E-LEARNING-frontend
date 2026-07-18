import api from './api'

export const chatService = {
  sendMessage: (message, history) => api.post('/chat', { message, history }).then(r => r.data),
}
