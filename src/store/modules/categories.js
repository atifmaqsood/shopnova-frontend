import productService from '@/services/productService'

const state = {
  categories: [],
  loading: false
}

const getters = {
  categories: state => state.categories,
  loading: state => state.loading
}

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

const actions = {
  async fetchCategories({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await productService.getCategories()
      // Backend wraps response in {success, message, data, timestamp} format
      // For categories, the data might be the array directly or wrapped
      const categories = response.data || response
      commit('SET_CATEGORIES', Array.isArray(categories) ? categories : [])
    } catch (error) {
      console.warn('Failed to fetch categories:', error.message)
      commit('SET_CATEGORIES', [])
    } finally {
      commit('SET_LOADING', false)
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