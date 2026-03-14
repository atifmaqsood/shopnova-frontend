import cartService from '@/services/cartService'

const state = {
  items: [],
  total: 0,
  loading: false
}

const getters = {
  items: state => state.items,
  total: state => state.total,
  itemCount: state => state.items.reduce((count, item) => count + item.quantity, 0),
  loading: state => state.loading
}

const mutations = {
  SET_CART(state, { items, total }) {
    state.items = items || []
    state.total = total || 0
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

const actions = {
  async fetchCart({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await cartService.getCart()
      commit('SET_CART', response.data)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addToCart({ dispatch }, itemData) {
    await cartService.addToCart(itemData)
    await dispatch('fetchCart')
  },

  async updateCartItem({ dispatch }, { productId, quantity }) {
    await cartService.updateCartItem(productId, { quantity })
    await dispatch('fetchCart')
  },

  async removeFromCart({ dispatch }, productId) {
    await cartService.removeFromCart(productId)
    await dispatch('fetchCart')
  },

  async clearCart({ dispatch }) {
    await cartService.clearCart()
    await dispatch('fetchCart')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}