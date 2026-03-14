<template>
  <AdminLayout>
    <div class="admin-dashboard">
      <!-- Premium SaaS Header -->
      <div class="dashboard-header mb-10">
        <v-row align="center">
          <v-col cols="12" md="6">
            <h1 class="page-title-saas mb-2">Commerce Insights</h1>
            <div class="d-flex align-center">
              <v-chip color="success" x-small label class="mr-3 font-weight-black">LIVE</v-chip>
              <p class="grey--text text-subtitle-2 mb-0">Performance overview for <span class="primary--text font-weight-bold">ShopNova Premium Store</span></p>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <div class="d-flex align-center justify-md-end gap-3">
              <v-btn-toggle v-model="chartPeriod" mandatory dense class="period-toggle mr-4 rounded-xl px-1">
                <v-btn small depressed value="week" class="rounded-xl">Week</v-btn>
                <v-btn small depressed value="month" class="rounded-xl">Month</v-btn>
                <v-btn small depressed value="year" class="rounded-xl">Year</v-btn>
              </v-btn-toggle>
              <v-btn color="primary" rounded elevation="8" class="px-6" @click="$router.push('/admin/products')">
                <v-icon left size="20">mdi-plus</v-icon> New Product
              </v-btn>
            </div>
          </v-col>
        </v-row>
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

      <!-- Best Sellers & Activity -->
      <v-row>
        <!-- Recent Orders Table -->
        <v-col cols="12" lg="8">
          <v-card class="glass-card-premium overflow-hidden">
            <div class="pa-6 d-flex align-center border-bottom bg-subtle">
              <h3 class="text-h6 font-weight-bold mb-0">
                <v-icon class="mr-2" color="primary">mdi-receipt-clock-outline</v-icon> Latest Transactions
              </h3>
              <v-spacer />
              <v-btn text small color="primary" @click="$router.push('/admin/orders')" class="rounded-lg">
                View All <v-icon right size="14">mdi-arrow-right</v-icon>
              </v-btn>
            </div>
            <v-data-table
              :headers="orderHeaders"
              :items="recentOrders"
              hide-default-footer
              class="bg-transparent custom-table"
            >
              <template slot="item.id" slot-scope="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="16" color="grey lighten-1" class="mr-2">mdi-hash</v-icon>
                  <span class="font-weight-black text-body-2">{{ item.id.substring(4, 10) }}</span>
                </div>
              </template>
              <template slot="item.userId" slot-scope="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="24" color="primary lighten-4" class="mr-2">
                    <span class="primary--text text-caption font-weight-bold">{{ (item.user?.name || 'U')[0] }}</span>
                  </v-avatar>
                  <span class="text-body-2">{{ item.user?.name || 'Customer' }}</span>
                </div>
              </template>
              <template slot="item.status" slot-scope="{ item }">
                <v-chip :color="getStatusColor(item.status) + '15'" :text-color="getStatusColor(item.status)" x-small label class="font-weight-black px-2">
                  <v-icon left x-small :color="getStatusColor(item.status)">mdi-circle</v-icon>
                  {{ item.status }}
                </v-chip>
              </template>
              <template slot="item.total" slot-scope="{ item }">
                <span class="font-weight-black primary--text">${{ (item.total || 0).toFixed(2) }}</span>
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <!-- Top Products List -->
        <v-col cols="12" lg="4">
          <v-card class="glass-card-premium h-100">
            <div class="pa-6 border-bottom bg-subtle">
              <h3 class="text-h6 font-weight-bold mb-0">
                <v-icon class="mr-2" color="amber darken-2">mdi-trophy-outline</v-icon> Top Performers
              </h3>
            </div>
            <div class="pa-6">
              <div v-for="p in topProducts" :key="p.name" class="top-product-row d-flex align-center mb-6">
                <v-img :src="p.image || 'https://via.placeholder.com/48'" width="48" height="48" class="rounded-lg mr-4 border" cover />
                <div class="flex-grow-1 overflow-hidden">
                  <div class="font-weight-bold text-truncate text-body-1">{{ p.name }}</div>
                  <div class="text-caption grey--text">{{ p.sales }} units moved</div>
                </div>
                <div class="text-right ml-4">
                  <div class="font-weight-black primary--text">${{ p.revenue?.toLocaleString() }}</div>
                  <v-chip x-small color="success" class="px-1 mt-1" style="height: 16px">
                    <v-icon x-small color="white">mdi-trending-up</v-icon>
                  </v-chip>
                </div>
              </div>
              <v-btn block outlined color="primary" class="rounded-xl mt-4" small @click="$router.push('/admin/products')">
                Manage Inventory
              </v-btn>
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
  color: #1e293b;
}

.page-title-saas {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-card-premium {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(20px);
  border-radius: 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card-premium:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08) !important;
}

.bg-subtle {
  background-color: rgba(14, 165, 233, 0.02) !important;
}

.period-toggle {
  background-color: #f1f5f9 !important;
  border: none !important;
}

.period-toggle .v-btn--active {
  background-color: white !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
  color: #0ea5e9 !important;
}

.custom-table >>> th {
  background-color: rgba(14, 165, 233, 0.02) !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.5px !important;
  color: #64748b !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

.custom-table >>> td {
  border-bottom: 1px solid #f1f5f9 !important;
  height: 64px !important;
}

.border-left-indicator {
  position: relative;
  overflow: hidden;
}

.border-left-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background: var(--color);
  opacity: 0.8;
}

.top-product-row {
  transition: transform 0.2s ease;
}

.top-product-row:hover {
  transform: translateX(5px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
