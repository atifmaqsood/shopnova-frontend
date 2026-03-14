import { mockApiService } from './mockApiService'

export default {
  async createOrder(data) {
    const order = await mockApiService.createOrder(data)
    return { data: order }
  },

  async getOrders(params = {}) {
    const orders = await mockApiService.getOrders()
    return { data: { orders } }
  },

  async getOrder(id) {
    const order = await mockApiService.getOrder(id)
    return { data: order }
  }
}