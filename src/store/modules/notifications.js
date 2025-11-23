import notificationService from '@/services/notificationService'

const state = {
  notifications: [],
  unreadCount: 0,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  loading: false
}

const getters = {
  notifications: state => state.notifications,
  unreadCount: state => state.unreadCount,
  pagination: state => state.pagination,
  loading: state => state.loading
}

const mutations = {
  SET_NOTIFICATIONS(state, { notifications, pagination, unreadCount }) {
    state.notifications = notifications
    state.pagination = pagination
    if (unreadCount !== undefined) {
      state.unreadCount = unreadCount
    }
  },
  SET_UNREAD_COUNT(state, count) {
    state.unreadCount = count
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  MARK_AS_READ(state, id) {
    const notification = state.notifications.find(n => n.id === id)
    if (notification && !notification.isRead) {
      notification.isRead = true
      state.unreadCount = Math.max(0, state.unreadCount - 1)
    }
  }
}

const actions = {
  async fetchNotifications({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const params = {
        page: state.pagination.page,
        limit: state.pagination.limit
      }
      const response = await notificationService.getNotifications(params)
      commit('SET_NOTIFICATIONS', response.data)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchUnreadCount({ commit }) {
    try {
      const response = await notificationService.getUnreadCount()
      commit('SET_UNREAD_COUNT', response.data.unreadCount)
    } catch (error) {
      // Ignore error for unread count
    }
  },

  async markAsRead({ commit }, id) {
    await notificationService.markAsRead(id)
    commit('MARK_AS_READ', id)
  },

  async markAllAsRead({ commit, dispatch }) {
    await notificationService.markAllAsRead()
    commit('SET_UNREAD_COUNT', 0)
    dispatch('fetchNotifications')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}