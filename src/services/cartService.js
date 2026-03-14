import { mockApiService } from './mockApiService'

export default {
  async getCart() {
    const cart = await mockApiService.getCart()
    return { data: cart }
  },

  async addToCart(data) {
    const cart = await mockApiService.getCart()
    const existingItem = cart.items.find(item => item.productId === data.productId)
    if (existingItem) {
      existingItem.quantity += data.quantity
    } else {
      cart.items.push(data)
    }
    await mockApiService.updateCart(cart)
    return { data: cart }
  },

  async updateCartItem(productId, data) {
    const cart = await mockApiService.getCart()
    const item = cart.items.find(item => item.productId === productId)
    if (item) {
      item.quantity = data.quantity
    }
    await mockApiService.updateCart(cart)
    return { data: cart }
  },

  async removeFromCart(productId) {
    const cart = await mockApiService.getCart()
    cart.items = cart.items.filter(item => item.productId !== productId)
    await mockApiService.updateCart(cart)
    return { data: cart }
  },

  async clearCart() {
    const cart = { items: [], total: 0 }
    await mockApiService.updateCart(cart)
    return { data: cart }
  }
}