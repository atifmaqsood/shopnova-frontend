import { mockApiService } from './mockApiService'

export default {
  async getCart() {
    const cart = await mockApiService.getCart()
    let changed = false
    
    // Auto-heal broken cart items (missing price/name)
    for (const item of cart.items) {
      if (!item.price || !item.name || !item.image || item.stock === undefined) {
        const product = await mockApiService.getProduct(item.productId)
        if (product) {
          item.name = item.name || product.name
          item.price = item.price || product.price
          item.image = item.image || (product.images && product.images[0])
          item.stock = product.stock !== undefined ? product.stock : 10
          changed = true
        }
      }
    }

    if (changed) {
      cart.total = cart.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
      await mockApiService.updateCart(cart)
    }
    
    return { data: cart }
  },

  async addToCart(data) {
    const cart = await mockApiService.getCart()
    const product = await mockApiService.getProduct(data.productId)
    
    if (!product) throw new Error('Product not found')

    const existingItem = cart.items.find(item => item.productId === data.productId)
    if (existingItem) {
      existingItem.quantity += data.quantity
    } else {
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/100',
        category: product.category || 'Premium Item',
        stock: product.stock !== undefined ? product.stock : 10,
        quantity: data.quantity
      })
    }
    // Recalculate total with fallback to 0
    cart.total = cart.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
    await mockApiService.updateCart(cart)
    return { data: cart }
  },

  async updateCartItem(productId, data) {
    const cart = await mockApiService.getCart()
    const item = cart.items.find(item => item.productId === productId)
    if (item) {
      item.quantity = data.quantity
    }
    // Recalculate total with fallback
    cart.total = cart.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
    await mockApiService.updateCart(cart)
    return { data: cart }
  },

  async removeFromCart(productId) {
    const cart = await mockApiService.getCart()
    cart.items = cart.items.filter(item => item.productId !== productId)
    // Recalculate total with fallback
    cart.total = cart.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
    await mockApiService.updateCart(cart)
    return { data: cart }
  },

  async clearCart() {
    const cart = { items: [], total: 0 }
    await mockApiService.updateCart(cart)
    return { data: cart }
  }
}