import apiClient from './apiClient'

export default {
  register(userData) {
    return apiClient.post('/auth/register', userData)
  },

  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  verifyEmail(data) {
    return apiClient.post('/auth/verify-email', data)
  },

  resendOtp(email) {
    return apiClient.post('/auth/resend-otp', { email })
  },

  forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email })
  },

  resetPassword(data) {
    return apiClient.post('/auth/reset-password', data)
  },

  getProfile() {
    return apiClient.get('/auth/profile')
  }
}