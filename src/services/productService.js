import apiClient from './apiClient'

export default {
  getProducts(params = {}) {
    return apiClient.get('/products', { params })
  },

  getProduct(id) {
    return apiClient.get(`/products/${id}`)
  },

  getCategories() {
    return apiClient.get('/categories')
  },

  getCategory(id) {
    return apiClient.get(`/categories/${id}`)
  }
}