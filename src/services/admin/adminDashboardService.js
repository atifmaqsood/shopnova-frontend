import apiClient from '../apiClient'

export default {
  getDashboard() {
    return apiClient.get('/admin/dashboard')
  },

  getAllUsers(params = {}) {
    return apiClient.get('/admin/users', { params })
  },

  updateUserRole(userId, role) {
    return apiClient.patch(`/admin/users/${userId}/role`, { role })
  }
}