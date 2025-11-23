import apiClient from '@/services/apiClient'

const state = {
  addresses: [],
  loading: false
}

const getters = {
  addresses: state => state.addresses,
  defaultAddress: state => state.addresses.find(addr => addr.isDefault),
  loading: state => state.loading
}

const mutations = {
  SET_ADDRESSES(state, addresses) {
    state.addresses = addresses
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}

const actions = {
  async fetchAddresses({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await apiClient.get('/addresses')
      commit('SET_ADDRESSES', response.data)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createAddress({ dispatch }, addressData) {
    await apiClient.post('/addresses', addressData)
    await dispatch('fetchAddresses')
  },

  async updateAddress({ dispatch }, { id, data }) {
    await apiClient.patch(`/addresses/${id}`, data)
    await dispatch('fetchAddresses')
  },

  async deleteAddress({ dispatch }, id) {
    await apiClient.delete(`/addresses/${id}`)
    await dispatch('fetchAddresses')
  },

  async setDefaultAddress({ dispatch }, id) {
    await apiClient.patch(`/addresses/${id}/set-default`)
    await dispatch('fetchAddresses')
  },

  async updateProfile(_, profileData) {
    return await apiClient.put('/users/profile', profileData)
  },

  async changePassword(_, passwordData) {
    return await apiClient.put('/users/change-password', passwordData)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}