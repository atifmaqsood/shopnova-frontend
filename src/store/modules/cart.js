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

  async addToCart({ dispatch }, { productId, quantity }) {
    await cartService.addToCart({ productId, quantity })
    await dispatch('fetchCart')
  },

  async updateCartItem({ dispatch }, { itemId, quantity }) {
    await cartService.updateCartItem(itemId, { quantity })
    await dispatch('fetchCart')
  },

  async removeFromCart({ dispatch }, itemId) {
    await cartService.removeFromCart(itemId)
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