import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import router from '../router'

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getters['auth/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    store.dispatch('ui/setLoading', true)
    return config
  },
  (error) => {
    store.dispatch('ui/setLoading', false)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    store.dispatch('ui/setLoading', false)
    return response.data
  },
  (error) => {
    store.dispatch('ui/setLoading', false)
    
    if (error.response?.status === 401) {
      store.dispatch('auth/logout')
      router.push('/login')
      return Promise.reject(error)
    }
    
    let message = 'An error occurred'
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      message = 'Unable to connect to server. Please check your connection.'
    } else {
      message = error.response?.data?.message || 'An error occurred'
    }
    
    // Only show error snackbar for user-initiated actions, not background requests
    if (!error.config?.silent) {
      store.dispatch('ui/showSnackbar', { message, color: 'error' })
    }
    
    return Promise.reject(error)
  }
)

Vue.prototype.$http = apiClient
export default apiClient