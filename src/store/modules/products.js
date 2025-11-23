import productService from '@/services/productService'

const state = {
  products: [],
  product: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  },
  filters: {
    search: '',
    categoryId: null,
    minPrice: null,
    maxPrice: null
  },
  loading: false
}

const getters = {
  products: state => state.products,
  product: state => state.product,
  pagination: state => state.pagination,
  filters: state => state.filters,
  loading: state => state.loading
}

const mutations = {
  SET_PRODUCTS(state, { products, pagination }) {
    state.products = products
    state.pagination = pagination
  },
  SET_PRODUCT(state, product) {
    state.product = product
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  CLEAR_PRODUCT(state) {
    state.product = null
  }
}

const actions = {
  async fetchProducts({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const params = {
        page: state.pagination?.page || 1,
        limit: state.pagination?.limit || 12
      }
      
      // Only add filters if they have values
      if (state.filters.search) {
        params.search = state.filters.search
      }
      if (state.filters.categoryId) {
        params.categoryId = state.filters.categoryId
      }
      if (state.filters.minPrice !== null && state.filters.minPrice !== undefined) {
        params.minPrice = state.filters.minPrice
      }
      if (state.filters.maxPrice !== null && state.filters.maxPrice !== undefined) {
        params.maxPrice = state.filters.maxPrice
      }
      
      const response = await productService.getProducts(params)
      console.log('Products response:', response)
      // Backend wraps response in {success, message, data, timestamp} format
      commit('SET_PRODUCTS', {
        products: response.data?.products || [],
        pagination: response.data?.pagination || state.pagination
      })
    } catch (error) {
      console.warn('Failed to fetch products:', error.message)
      commit('SET_PRODUCTS', { products: [], pagination: state.pagination })
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchProduct({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await productService.getProduct(id)
      // Backend wraps response in {success, message, data, timestamp} format
      commit('SET_PRODUCT', response.data || response)
    } catch (error) {
      console.warn('Failed to fetch product:', error.message)
      commit('SET_PRODUCT', null)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  setFilters({ commit, dispatch }, filters) {
    commit('SET_FILTERS', filters)
    dispatch('fetchProducts')
  },

  setPage({ commit, dispatch, state }, page) {
    const newPagination = { ...state.pagination, page }
    commit('SET_PRODUCTS', { products: state.products, pagination: newPagination })
    dispatch('fetchProducts')
  },

  clearProduct({ commit }) {
    commit('CLEAR_PRODUCT')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}