import api from './api'
export const authService = {
  login:       (email, password)             => api.post('/auth/login',       { email, password }).then(r => r.data),
  register:    (name, email, password, role) => api.post('/auth/register',    { name, email, password, role }).then(r => r.data),
  verifyEmail: (email, code)                 => api.post('/auth/verify-email',{ email, code }).then(r => r.data),
  resendOtp:   (email)                       => api.post('/auth/resend-otp',  { email }).then(r => r.data),
  getMe:       ()                             => api.get('/auth/me').then(r => r.data),
}
