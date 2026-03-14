import { mockApiService } from '../mockApiService'

export default {
  async getDashboard() {
    const products = await mockApiService.getProducts()
    const orders = await mockApiService.getOrders()
    const customers = await mockApiService.getCustomers()
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    
    return { 
      data: { 
        stats: {
          totalRevenue,
          totalOrders: orders.length,
          totalCustomers: customers.length,
          totalProducts: products.length
        },
        recentOrders: orders.slice(0, 5),
        topProducts: products.slice(0, 3), // Simulating top products
        salesData: [
          { month: 'Jan', sales: 4500, orders: 120 },
          { month: 'Feb', sales: 5200, orders: 145 },
          { month: 'Mar', sales: totalRevenue, orders: orders.length }
        ]
      } 
    }
  },

  async getAllUsers(params = {}) {
    const customers = await mockApiService.getCustomers()
    return { data: { users: customers } }
  },

  async updateUserRole(userId, role) {
    return { data: { success: true } }
  }
}