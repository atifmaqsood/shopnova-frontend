import productService from '@/services/productService'

const state = {
  allProducts: [], // Store all products for frontend filtering
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
    maxPrice: null,
    sortBy: 'newest'
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
  SET_ALL_PRODUCTS(state, products) {
    state.allProducts = products
  },
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
  async fetchAllProducts({ commit, dispatch }) {
    commit('SET_LOADING', true)
    try {
      const response = await productService.getProducts({ limit: 1000 }) // Fetch all products
      const allProducts = response.data?.products || []
      commit('SET_ALL_PRODUCTS', allProducts)
      dispatch('applyFiltersAndSort')
    } catch (error) {
      console.warn('Failed to fetch products:', error.message)
      commit('SET_ALL_PRODUCTS', [])
    } finally {
      commit('SET_LOADING', false)
    }
  },

  applyFiltersAndSort({ commit, state }) {
    let filtered = [...state.allProducts]

    // Apply search filter
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      )
    }

    // Apply category filter
    if (state.filters.categoryId) {
      filtered = filtered.filter(product => product.categoryId === state.filters.categoryId)
    }

    // Apply price filters
    if (state.filters.minPrice !== null && state.filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= state.filters.minPrice)
    }
    if (state.filters.maxPrice !== null && state.filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= state.filters.maxPrice)
    }

    // Apply sorting
    const sortBy = state.filters.sortBy || 'newest'
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }

    // Apply pagination
    const page = state.pagination.page
    const limit = state.pagination.limit
    const total = filtered.length
    const pages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedProducts = filtered.slice(start, end)

    commit('SET_PRODUCTS', {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })
  },

  async fetchProducts({ dispatch }) {
    // Just apply filters to existing products, or fetch if not loaded
    dispatch('applyFiltersAndSort')
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

  setFilters({ commit, dispatch, state }, filters) {
    commit('SET_FILTERS', filters)
    // Reset to page 1 when filters change
    commit('SET_PRODUCTS', {
      products: state.products,
      pagination: { ...state.pagination, page: 1 }
    })
    dispatch('applyFiltersAndSort')
  },

  setPage({ commit, dispatch, state }, page) {
    commit('SET_PRODUCTS', {
      products: state.products,
      pagination: { ...state.pagination, page }
    })
    dispatch('applyFiltersAndSort')
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