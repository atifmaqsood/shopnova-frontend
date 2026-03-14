<template>
  <AdminLayout>
    <div class="admin-dashboard">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-10 flex-wrap gap-4">
        <div>
          <h1 class="text-h3 font-weight-black mb-1">Store Overview</h1>
          <p class="grey--text">Welcome back! Here's what has changed in your store today.</p>
        </div>
        <div class="d-flex gap-3">
          <v-btn color="primary" rounded elevation="4" @click="$router.push('/admin/products')">
            <v-icon left>mdi-package-variant-plus</v-icon> Add Product
          </v-btn>
          <v-btn outlined rounded color="grey darken-1">
            <v-icon left>mdi-download</v-icon> Export Report
          </v-btn>
        </div>
      </div>

      <!-- Stats Cards -->
      <v-row class="mb-10">
        <v-col v-for="s in statCards" :key="s.label" cols="12" sm="6" lg="3">
          <v-card class="glass-card pa-6 border-left-indicator" :style="{ '--color': s.color }">
            <div class="d-flex justify-space-between align-start mb-4">
              <v-avatar :color="s.color + '15'" size="48" rounded="lg">
                <v-icon :color="s.color">{{ s.icon }}</v-icon>
              </v-avatar>
              <v-chip v-if="s.trend" :color="s.trend > 0 ? 'success' : 'error'" x-small label class="trend-chip">
                {{ s.trend > 0 ? '+' : '' }}{{ s.trend }}%
              </v-chip>
            </div>
            <div class="text-h4 font-weight-black mb-1">{{ s.prefix }}{{ s.value }}</div>
            <div class="text-caption grey--text font-weight-bold text-uppercase letter-spacing-1">{{ s.label }}</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Row -->
      <v-row class="mb-10">
        <v-col cols="12" lg="8">
          <v-card class="glass-card pa-6">
            <div class="d-flex align-center justify-space-between mb-8">
              <h3 class="text-h6 font-weight-bold">Revenue Dynamics</h3>
              <v-btn-toggle v-model="chartPeriod" mandatory dense rounded background-color="grey lighten-4" borderless>
                <v-btn small value="week">Week</v-btn>
                <v-btn small value="month">Month</v-btn>
                <v-btn small value="year">Year</v-btn>
              </v-btn-toggle>
            </div>
            <div class="chart-wrapper">
              <canvas ref="revenueChart"></canvas>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4">
          <v-card class="glass-card pa-6">
            <h3 class="text-h6 font-weight-bold mb-8">Sales by Analytics</h3>
            <div class="metric-list">
              <div v-for="m in metrics" :key="m.label" class="metric-item mb-6">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-subtitle-2 grey--text">{{ m.label }}</span>
                  <span class="font-weight-bold">{{ m.value }}</span>
                </div>
                <v-progress-linear :value="m.progress" :color="m.color" height="6" rounded />
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Orders & Top Products -->
      <v-row>
        <v-col cols="12" lg="7">
          <v-card class="glass-card">
            <v-card-title class="pa-6 border-bottom">
              <v-icon class="mr-2">mdi-history</v-icon> Recent Orders
              <v-spacer />
              <v-btn text small color="primary" @click="$router.push('/admin/orders')">View All</v-btn>
            </v-card-title>
            <v-data-table
              :headers="orderHeaders"
              :items="recentOrders"
              hide-default-footer
              class="bg-transparent"
            >
              <template slot="item.id" slot-scope="{ item }">
                <span class="font-weight-bold">#{{ item.id.substring(4, 10) }}</span>
              </template>
              <template slot="item.status" slot-scope="{ item }">
                <v-chip :color="getStatusColor(item.status)" x-small label>
                  {{ item.status }}
                </v-chip>
              </template>
              <template slot="item.total" slot-scope="{ item }">
                <span class="font-weight-bold">${{ item.total }}</span>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" lg="5">
          <v-card class="glass-card">
            <v-card-title class="pa-6 border-bottom">
              <v-icon class="mr-2">mdi-star-outline</v-icon> Best Selling
            </v-card-title>
            <div class="pa-6">
              <div v-for="(p, i) in topProducts" :key="p.name" class="best-seller-item d-flex align-center mb-6">
                <v-avatar color="primary lighten-5" size="40" class="mr-4 font-weight-black">
                  {{ i + 1 }}
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="font-weight-bold text-truncate" style="max-width: 180px">{{ p.name }}</div>
                  <div class="text-caption grey--text">{{ p.sales }} units sold</div>
                </div>
                <div class="text-right">
                  <div class="font-weight-bold">${{ p.revenue }}</div>
                  <v-icon x-small color="success">mdi-trending-up</v-icon>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/AdminLayout.vue'
import Chart from 'chart.js/auto'

export default {
  name: 'AdminDashboard',
  components: { AdminLayout },
  data() {
    return {
      stats: { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0, lowStock: 0 },
      recentOrders: [],
      topProducts: [],
      chartPeriod: 'month',
      chart: null,
      orderHeaders: [
        { text: 'Order ID', value: 'id' },
        { text: 'Customer', value: 'userId' },
        { text: 'Total', value: 'total' },
        { text: 'Status', value: 'status' }
      ],
      metrics: [
        { label: 'Conversion Rate', value: '3.2%', progress: 65, color: 'primary' },
        { label: 'Customer Retention', value: '84%', progress: 84, color: 'success' },
        { label: 'Avg Order Value', value: '$240', progress: 45, color: 'warning' }
      ]
    }
  },
  computed: {
    statCards() {
      return [
        { label: 'Total Revenue', value: this.stats.totalRevenue.toLocaleString(), prefix: '$', icon: 'mdi-currency-usd', color: '#6366f1', trend: 12 },
        { label: 'Average Orders', value: this.stats.totalOrders, icon: 'mdi-cart-outline', color: '#10b981', trend: 8 },
        { label: 'Active Customers', value: this.stats.totalCustomers, icon: 'mdi-account-group-outline', color: '#f59e0b', trend: 15 },
        { label: 'Low Stock Alert', value: this.stats.lowStock, icon: 'mdi-alert-circle-outline', color: '#ef4444' }
      ]
    }
  },
  async mounted() {
    await this.fetchData()
    this.initChart()
  },
  methods: {
    async fetchData() {
      try {
        const { mockApiService } = await import('@/services/mockApiService')
        const data = await mockApiService.getDashboardStats()
        this.stats = data.stats
        this.recentOrders = data.recentOrders
        this.topProducts = data.topProducts || []
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e)
      }
    },
    getStatusColor(status) {
      const colors = { 'Processing': 'warning', 'Delivered': 'success', 'Cancelled': 'error' }
      return colors[status] || 'grey'
    },
    initChart() {
      const ctx = this.$refs.revenueChart.getContext('2d')
      const gradient = ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)')
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)')

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Revenue',
            data: [3200, 4100, 3800, 5200, 4800, 6200, 7100],
            borderColor: '#6366f1',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { display: false }, ticks: { display: false } },
            x: { grid: { display: false } }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  animation: fadeIn 0.8s ease;
}

.border-left-indicator {
  border-left: 4px solid var(--color);
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.trend-chip {
  font-weight: 800;
}

.chart-wrapper {
  height: 300px;
}

.border-bottom {
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
}

.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
