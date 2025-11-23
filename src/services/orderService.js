import apiClient from './apiClient'

export default {
  createOrder(data) {
    return apiClient.post('/orders', data)
  },

  getOrders(params = {}) {
    return apiClient.get('/orders/my-orders', { params })
  },

  getOrder(id) {
    return apiClient.get(`/orders/${id}`)
  }
}