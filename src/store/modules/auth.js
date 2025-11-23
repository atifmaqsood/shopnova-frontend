import authService from '@/services/authService'
import Cookies from 'js-cookie'

const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false
}

const getters = {
  user: state => state.user,
  token: state => state.token,
  isAuthenticated: state => state.isAuthenticated,
  isAdmin: state => state.user?.role === 'ADMIN'
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    localStorage.removeItem('token')
    Cookies.remove('refreshToken')
  }
}

const actions = {
  async register({ commit }, userData) {
    const response = await authService.register(userData)
    return response
  },

  async login({ commit, dispatch }, credentials) {
    const response = await authService.login(credentials)
    const { access_token, user } = response.data
    
    commit('SET_TOKEN', access_token)
    commit('SET_USER', user)
    
    // Initialize user data
    await dispatch('cart/fetchCart', null, { root: true })
    await dispatch('notifications/fetchUnreadCount', null, { root: true })
    
    return response
  },

  async verifyEmail({ commit }, data) {
    return await authService.verifyEmail(data)
  },

  async resendOtp({ commit }, email) {
    return await authService.resendOtp(email)
  },

  async forgotPassword({ commit }, email) {
    return await authService.forgotPassword(email)
  },

  async resetPassword({ commit }, data) {
    return await authService.resetPassword(data)
  },

  async fetchProfile({ commit }) {
    try {
      const response = await authService.getProfile()
      commit('SET_USER', response.data)
      return response
    } catch (error) {
      commit('CLEAR_AUTH')
      throw error
    }
  },

  logout({ commit }) {
    commit('CLEAR_AUTH')
  },

  initializeAuth({ commit, dispatch }) {
    const token = localStorage.getItem('token')
    if (token) {
      commit('SET_TOKEN', token)
      dispatch('fetchProfile').catch((error) => {
        console.warn('Failed to fetch profile:', error.message)
        commit('CLEAR_AUTH')
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}