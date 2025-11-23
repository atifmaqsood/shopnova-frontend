import orderService from '@/services/orderService'

const state = {
  orders: [],
  order: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  loading: false
}

const getters = {
  orders: state => state.orders,
  order: state => state.order,
  pagination: state => state.pagination,
  loading: state => state.loading
}

const mutations = {
  SET_ORDERS(state, { orders, pagination }) {
    state.orders = orders
    state.pagination = pagination
  },
  SET_ORDER(state, order) {
    state.order = order
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

const actions = {
  async fetchOrders({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const params = {
        page: state.pagination.page,
        limit: state.pagination.limit
      }
      const response = await orderService.getOrders(params)
      commit('SET_ORDERS', response.data)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchOrder({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const response = await orderService.getOrder(id)
      commit('SET_ORDER', response.data)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createOrder({ dispatch }, orderData) {
    const response = await orderService.createOrder(orderData)
    await dispatch('cart/clearCart', null, { root: true })
    return response
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}