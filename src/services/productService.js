import { mockApiService } from './mockApiService'

export default {
  async getProducts(params = {}) {
    const products = await mockApiService.getProducts(params)
    return { data: { products } }
  },

  async getProduct(id) {
    const product = await mockApiService.getProduct(id)
    return { data: product }
  },

  async getCategories() {
    const categories = await mockApiService.getCategories()
    return { data: categories }
  },

  async getCategory(id) {
    const categories = await mockApiService.getCategories()
    const category = categories.find(c => c.id === parseInt(id))
    return { data: category }
  }
}