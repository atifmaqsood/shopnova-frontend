import apiClient from './apiClient'

export default {
  getNotifications(params = {}) {
    return apiClient.get('/notifications', { params })
  },

  getUnreadCount() {
    return apiClient.get('/notifications/unread-count')
  },

  markAsRead(id) {
    return apiClient.patch(`/notifications/${id}/read`)
  },

  markAllAsRead() {
    return apiClient.patch('/notifications/mark-all-read')
  }
}