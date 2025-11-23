import apiClient from './apiClient'

export default {
  getCart() {
    return apiClient.get('/cart')
  },

  addToCart(data) {
    return apiClient.post('/cart/add', data)
  },

  updateCartItem(itemId, data) {
    return apiClient.patch(`/cart/items/${itemId}`, data)
  },

  removeFromCart(itemId) {
    return apiClient.delete(`/cart/items/${itemId}`)
  },

  clearCart() {
    return apiClient.delete('/cart/clear')
  }
}