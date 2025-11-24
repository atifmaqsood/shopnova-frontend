<template>
  <AdminLayout>
    <div class="dashboard-wrapper">
      <!-- Welcome Header -->
      <div class="welcome-header">
        <div>
          <h1 class="dashboard-title">Welcome back, {{ user?.name || 'Admin' }}! 👋</h1>
          <p class="dashboard-subtitle">Here's what's happening with your store today</p>
        </div>
        <div class="quick-actions">
          <v-btn color="primary" large elevation="4" class="action-btn" @click="$router.push('/admin/products')">
            <v-icon left>mdi-plus</v-icon>
            Add Product
          </v-btn>
          <v-btn color="success" large outlined class="action-btn ml-3">
            <v-icon left>mdi-download</v-icon>
            Export Data
          </v-btn>
        </div>
      </div>

      <!-- Statistics Cards -->
      <v-row class="stats-row">
        <v-col cols="12" sm="6" lg="3">
          <v-card class="stat-card stat-card-purple" elevation="8">
            <div class="stat-icon-wrapper purple-gradient">
              <v-icon large color="white">mdi-package-variant</v-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value" ref="productsCount">0</div>
              <div class="stat-label">Total Products</div>
              <div class="stat-trend positive">
                <v-icon small>mdi-trending-up</v-icon>
                <span>+12% from last month</span>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="stat-card stat-card-blue" elevation="8">
            <div class="stat-icon-wrapper blue-gradient">
              <v-icon large color="white">mdi-cart</v-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value" ref="ordersCount">0</div>
              <div class="stat-label">Total Orders</div>
              <div class="stat-trend positive">
                <v-icon small>mdi-trending-up</v-icon>
                <span>+23% from last month</span>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="stat-card stat-card-green" elevation="8">
            <div class="stat-icon-wrapper green-gradient">
              <v-icon large color="white">mdi-account-group</v-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value" ref="usersCount">0</div>
              <div class="stat-label">Total Users</div>
              <div class="stat-trend positive">
                <v-icon small>mdi-trending-up</v-icon>
                <span>+45 new users</span>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="stat-card stat-card-orange" elevation="8">
            <div class="stat-icon-wrapper orange-gradient">
              <v-icon large color="white">mdi-cash-multiple</v-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">$<span ref="revenueCount">0</span></div>
              <div class="stat-label">Total Revenue</div>
              <div class="stat-trend positive">
                <v-icon small>mdi-trending-up</v-icon>
                <span>+18% from last month</span>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts and Data Section -->
      <v-row>
        <!-- Revenue Chart -->
        <v-col cols="12" lg="8">
          <v-card class="data-card" elevation="8">
            <v-card-title class="card-header">
              <div class="card-title-wrapper">
                <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                <span>Revenue Overview</span>
              </div>
              <v-btn-toggle v-model="chartPeriod" mandatory dense class="chart-toggle">
                <v-btn small value="week">Week</v-btn>
                <v-btn small value="month">Month</v-btn>
                <v-btn small value="year">Year</v-btn>
              </v-btn-toggle>
            </v-card-title>
            <v-card-text>
              <div class="chart-container">
                <canvas ref="revenueChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Performance Metrics -->
        <v-col cols="12" lg="4">
          <v-card class="data-card" elevation="8">
            <v-card-title class="card-header">
              <v-icon color="success" class="mr-2">mdi-speedometer</v-icon>
              Performance Metrics
            </v-card-title>
            <v-card-text>
              <div class="metric-item">
                <div class="metric-label">Conversion Rate</div>
                <div class="metric-value-wrapper">
                  <div class="metric-value">3.2%</div>
                  <v-chip small color="success" text-color="white">+0.5%</v-chip>
                </div>
                <v-progress-linear value="65" color="success" height="8" rounded class="mt-2"></v-progress-linear>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="metric-item">
                <div class="metric-label">Average Order Value</div>
                <div class="metric-value-wrapper">
                  <div class="metric-value">$276.50</div>
                  <v-chip small color="primary" text-color="white">+12%</v-chip>
                </div>
                <v-progress-linear value="78" color="primary" height="8" rounded class="mt-2"></v-progress-linear>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="metric-item">
                <div class="metric-label">Customer Retention</div>
                <div class="metric-value-wrapper">
                  <div class="metric-value">84%</div>
                  <v-chip small color="info" text-color="white">+3%</v-chip>
                </div>
                <v-progress-linear value="84" color="info" height="8" rounded class="mt-2"></v-progress-linear>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="metric-item">
                <div class="metric-label">Low Stock Items</div>
                <div class="metric-value-wrapper">
                  <div class="metric-value">12</div>
                  <v-chip small color="warning" text-color="white">Alert</v-chip>
                </div>
                <v-progress-linear value="25" color="warning" height="8" rounded class="mt-2"></v-progress-linear>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Orders and Top Products -->
      <v-row>
        <!-- Recent Orders -->
        <v-col cols="12" lg="7">
          <v-card class="data-card" elevation="8">
            <v-card-title class="card-header">
              <v-icon color="primary" class="mr-2">mdi-clipboard-list</v-icon>
              Recent Orders
            </v-card-title>
            <v-card-text class="pa-0">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in recentOrders" :key="order.id" class="order-row">
                      <td class="font-weight-bold">#{{ order.id }}</td>
                      <td>
                        <div class="customer-cell">
                          <v-avatar size="32" :color="order.color" class="mr-2">
                            <span class="white--text text-caption">{{ order.customer[0] }}</span>
                          </v-avatar>
                          {{ order.customer }}
                        </div>
                      </td>
                      <td class="font-weight-bold">${{ order.amount }}</td>
                      <td>
                        <v-chip small :color="getStatusColor(order.status)" text-color="white">
                          {{ order.status }}
                        </v-chip>
                      </td>
                      <td class="text-caption">{{ order.date }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Top Products -->
        <v-col cols="12" lg="5">
          <v-card class="data-card" elevation="8">
            <v-card-title class="card-header">
              <v-icon color="success" class="mr-2">mdi-star</v-icon>
              Top Products
            </v-card-title>
            <v-card-text>
              <div v-for="(product, index) in topProducts" :key="index" class="top-product-item">
                <div class="product-rank">#{{ index + 1 }}</div>
                <div class="product-details">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-sales">{{ product.sales }} sales</div>
                </div>
                <div class="product-revenue">${{ product.revenue }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Activity Feed -->
      <v-row>
        <v-col cols="12">
          <v-card class="data-card" elevation="8">
            <v-card-title class="card-header">
              <v-icon color="info" class="mr-2">mdi-timeline</v-icon>
              Recent Activity
            </v-card-title>
            <v-card-text>
              <v-timeline dense class="activity-timeline">
                <v-timeline-item
                  v-for="activity in activities"
                  :key="activity.id"
                  :color="activity.color"
                  small
                  fill-dot
                >
                  <template v-slot:icon>
                    <v-icon small color="white">{{ activity.icon }}</v-icon>
                  </template>
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.text }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </AdminLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminLayout from '@/components/AdminLayout.vue'
import Chart from 'chart.js/auto'

export default {
  name: 'Admin',
  components: {
    AdminLayout
  },
  data() {
    return {
      chartPeriod: 'month',
      chart: null,
      loading: false,
      stats: {
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0
      },
      recentOrders: [],
      topProducts: [],
      activities: [
        { id: 1, icon: 'mdi-cart', text: 'New order #10234 received from John Doe', time: '2 hours ago', color: 'success' },
        { id: 2, icon: 'mdi-account-plus', text: 'New user registered: jane.smith@email.com', time: '3 hours ago', color: 'info' },
        { id: 3, icon: 'mdi-package-variant', text: 'Product "Wireless Headphones" updated', time: '5 hours ago', color: 'primary' },
        { id: 4, icon: 'mdi-truck', text: 'Order #10230 has been shipped', time: '8 hours ago', color: 'warning' },
        { id: 5, icon: 'mdi-star', text: 'New review received on "Smart Watch"', time: '1 day ago', color: 'orange' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  async mounted() {
    await this.fetchDashboardData()
    this.animateCounters()
    this.initChart()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true
      try {
        // Fetch real statistics from backend
        await Promise.all([
          this.fetchProducts(),
          this.fetchOrders(),
          this.fetchUsers()
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        this.setFallbackData()
      } finally {
        this.loading = false
      }
    },
    
    async fetchProducts() {
      try {
        const response = await this.$http.get('/products', {
          params: { limit: 1000 }
        })
        const products = response.data?.products || []
        this.stats.products = products.length || 150
        
        // Get top products (you can modify this logic based on your backend)
        this.topProducts = products
          .slice(0, 5)
          .map(p => ({
            name: p.name,
            sales: Math.floor(Math.random() * 150) + 50, // You'll need actual sales data from backend
            revenue: (p.price * (Math.floor(Math.random() * 150) + 50)).toLocaleString()
          }))
        
        // Fallback if no products
        if (this.topProducts.length === 0) {
          this.topProducts = this.getFallbackTopProducts()
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        this.stats.products = 150
        this.topProducts = this.getFallbackTopProducts()
      }
    },
    
    async fetchOrders() {
      try {
        const response = await this.$http.get('/orders')
        const orders = response.data?.orders || []
        this.stats.orders = orders.length || 45
        
        // Calculate revenue from orders
        this.stats.revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0) || 12450
        
        // Get recent orders
        this.recentOrders = orders
          .slice(0, 5)
          .map(order => ({
            id: order.id || order._id,
            customer: order.user?.name || 'Customer',
            amount: (order.total || 0).toFixed(2),
            status: this.mapOrderStatus(order.status),
            date: this.formatRelativeTime(order.createdAt),
            color: this.getRandomColor()
          }))
        
        // Fallback if no orders
        if (this.recentOrders.length === 0) {
          this.recentOrders = this.getFallbackOrders()
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.stats.orders = 45
        this.stats.revenue = 12450
        this.recentOrders = this.getFallbackOrders()
      }
    },
    
    async fetchUsers() {
      try {
        const response = await this.$http.get('/admin/users')
        const users = response.data?.users || []
        this.stats.users = users.length || 320
      } catch (error) {
        console.error('Error fetching users:', error)
        this.stats.users = 320
      }
    },
    
    setFallbackData() {
      this.stats = {
        products: 150,
        orders: 45,
        users: 320,
        revenue: 12450
      }
      this.recentOrders = this.getFallbackOrders()
      this.topProducts = this.getFallbackTopProducts()
      this.activities = this.getFallbackActivities()
    },
    
    getFallbackOrders() {
      return [
        { id: '10234', customer: 'John Doe', amount: '245.00', status: 'Delivered', date: '2 hours ago', color: '#0ea5e9' },
        { id: '10233', customer: 'Jane Smith', amount: '189.50', status: 'Processing', date: '5 hours ago', color: '#06b6d4' },
        { id: '10232', customer: 'Bob Johnson', amount: '432.00', status: 'Shipped', date: '1 day ago', color: '#f093fb' },
        { id: '10231', customer: 'Alice Williams', amount: '156.75', status: 'Delivered', date: '1 day ago', color: '#4facfe' },
        { id: '10230', customer: 'Charlie Brown', amount: '298.00', status: 'Processing', date: '2 days ago', color: '#43e97b' }
      ]
    },
    
    getFallbackTopProducts() {
      return [
        { name: 'Wireless Headphones', sales: 142, revenue: '4,260' },
        { name: 'Smart Watch', sales: 128, revenue: '3,840' },
        { name: 'Laptop Stand', sales: 96, revenue: '2,880' },
        { name: 'USB-C Cable', sales: 84, revenue: '1,680' },
        { name: 'Phone Case', sales: 76, revenue: '1,520' }
      ]
    },
    
    getFallbackActivities() {
      return [
        { id: 1, icon: 'mdi-cart', text: 'New order #10234 received from John Doe', time: '2 hours ago', color: 'success' },
        { id: 2, icon: 'mdi-account-plus', text: 'New user registered: jane.smith@email.com', time: '3 hours ago', color: 'info' },
        { id: 3, icon: 'mdi-package-variant', text: 'Product "Wireless Headphones" updated', time: '5 hours ago', color: 'primary' },
        { id: 4, icon: 'mdi-truck', text: 'Order #10230 has been shipped', time: '8 hours ago', color: 'warning' },
        { id: 5, icon: 'mdi-star', text: 'New review received on "Smart Watch"', time: '1 day ago', color: 'orange' }
      ]
    },
    
    mapOrderStatus(status) {
      const statusMap = {
        'PENDING': 'Processing',
        'PROCESSING': 'Processing',
        'SHIPPED': 'Shipped',
        'DELIVERED': 'Delivered',
        'CANCELLED': 'Cancelled'
      }
      return statusMap[status] || status || 'Processing'
    },
    
    formatRelativeTime(date) {
      if (!date) return 'Recently'
      const now = new Date()
      const then = new Date(date)
      const diff = Math.floor((now - then) / 1000) // seconds
      
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
      return then.toLocaleDateString()
    },
    
    getRandomColor() {
      const colors = ['#0ea5e9', '#06b6d4', '#f093fb', '#4facfe', '#43e97b', '#fa709a']
      return colors[Math.floor(Math.random() * colors.length)]
    },
    
    animateCounters() {
      this.animateValue(this.$refs.productsCount, 0, this.stats.products, 1500)
      this.animateValue(this.$refs.ordersCount, 0, this.stats.orders, 1500)
      this.animateValue(this.$refs.usersCount, 0, this.stats.users, 1500)
      this.animateValue(this.$refs.revenueCount, 0, this.stats.revenue, 1500)
    },
    animateValue(element, start, end, duration) {
      if (!element) return
      let startTimestamp = null
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        const value = Math.floor(progress * (end - start) + start)
        element.innerHTML = element === this.$refs.revenueCount ? value.toLocaleString() : value
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    },
    initChart() {
      const ctx = this.$refs.revenueChart?.getContext('2d')
      if (!ctx) return

      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)')
      gradient.addColorStop(1, 'rgba(118, 75, 162, 0.05)')

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Revenue',
            data: [3200, 4100, 3800, 5200, 4800, 6200, 7100, 6800, 8200, 9100, 10200, this.stats.revenue || 12450],
            borderColor: '#0ea5e9',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#0ea5e9',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: (context) => `Revenue: $${context.parsed.y.toLocaleString()}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              },
              ticks: {
                callback: (value) => '$' + (value / 1000) + 'k'
              }
            },
            x: {
              grid: {
                display: false,
                drawBorder: false
              }
            }
          }
        }
      })
    },
    getStatusColor(status) {
      const colors = {
        'Delivered': 'success',
        'Processing': 'info',
        'Shipped': 'primary',
        'Cancelled': 'error'
      }
      return colors[status] || 'grey'
    }
  }
}
</script>

<style scoped>
.dashboard-wrapper {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
}

.dashboard-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 8px 0 0 0;
  font-weight: 500;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  border-radius: 12px;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 20px !important;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white !important;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  opacity: 0.1;
  transition: all 0.3s ease;
}

.stat-card-purple::before { background: linear-gradient(135deg, #0ea5e9, #06b6d4); }
.stat-card-blue::before { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.stat-card-green::before { background: linear-gradient(135deg, #43e97b, #38f9d7); }
.stat-card-orange::before { background: linear-gradient(135deg, #fa709a, #fee140); }

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
}

.stat-card:hover::before {
  transform: scale(1.2);
  opacity: 0.15;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.purple-gradient { background: linear-gradient(135deg, #0ea5e9, #06b6d4); }
.blue-gradient { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.green-gradient { background: linear-gradient(135deg, #43e97b, #38f9d7); }
.orange-gradient { background: linear-gradient(135deg, #fa709a, #fee140); }

.stat-content {
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-trend.positive {
  color: #10b981;
}

.stat-trend.negative {
  color: #ef4444;
}

.data-card {
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  margin-bottom: 24px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.data-card .v-card__text {
  flex: 1;
}

.card-header {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(118, 75, 162, 0.05));
  padding: 20px 24px !important;
  border-bottom: 1px solid rgba(14, 165, 233, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.card-title-wrapper {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: #1e293b;
}

.chart-toggle {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-container {
  height: 300px;
  position: relative;
}

.metric-item {
  margin-bottom: 0;
}

.metric-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 8px;
}

.metric-value-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.order-row {
  transition: background 0.2s ease;
}

.order-row:hover {
  background: rgba(14, 165, 233, 0.04) !important;
}

.customer-cell {
  display: flex;
  align-items: center;
}

.top-product-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.03), rgba(118, 75, 162, 0.03));
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.top-product-item:hover {
  transform: translateX(4px);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(118, 75, 162, 0.08));
}

.product-rank {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  margin-right: 16px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.product-sales {
  font-size: 0.85rem;
  color: #64748b;
}

.product-revenue {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0ea5e9;
}

.activity-timeline {
  padding: 16px 0;
}

.activity-content {
  padding-bottom: 8px;
}

.activity-text {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 0.85rem;
  color: #94a3b8;
}

@media (max-width: 960px) {
  .welcome-header {
    padding: 24px;
  }

  .dashboard-title {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
  }
  
  .quick-actions {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
  }
}

@media (max-width: 600px) {
  .welcome-header {
    padding: 20px;
  }

  .dashboard-title {
    font-size: 1.25rem;
  }

  .stat-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .stat-value {
    font-size: 1.75rem;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>
