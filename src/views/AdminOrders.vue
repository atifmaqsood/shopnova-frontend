<template>
  <AdminLayout>
    <div class="admin-orders-view">
      <!-- Premium Page Header -->
      <div class="page-header mb-10">
        <v-row align="end" no-gutters>
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <v-btn icon color="primary" @click="$router.go(-1)" class="mr-2">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <span class="text-overline font-weight-black primary--text letter-spacing-2">SALES PIPELINE</span>
            </div>
            <h1 class="text-h3 font-weight-black mb-2">Live Transactions</h1>
            <p class="grey--text text-subtitle-1 mb-0">Monitor order fulfillment, payment statuses, and logistical workflows.</p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right mt-6 mt-md-0">
            <div class="d-flex align-center justify-md-end gap-3">
              <v-btn outlined color="primary" rounded class="px-6 font-weight-bold" @click="fetchOrders">
                <v-icon left>mdi-refresh</v-icon> Refresh Data
              </v-btn>
              <v-btn color="success" dark large rounded elevation="8" class="px-8 font-weight-black">
                <v-icon left size="24">mdi-file-export-outline</v-icon> Export CSV
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Quick Stats Metrics -->
      <v-row class="mb-8">
        <v-col v-for="(stat, i) in orderStats" :key="i" cols="12" sm="6" lg="3">
          <v-card class="rounded-xl border-light pa-6 soft-shadow h-100">
            <div class="d-flex align-center mb-4">
              <v-avatar :color="stat.color + '15'" size="48" rounded="lg">
                <v-icon :color="stat.color">{{ stat.icon }}</v-icon>
              </v-avatar>
              <v-spacer />
              <div class="text-caption grey--text font-weight-bold">{{ stat.label }}</div>
            </div>
            <div class="text-h4 font-weight-black mb-1">{{ stat.value }}</div>
            <div class="d-flex align-center">
              <v-icon x-small color="success" class="mr-1">mdi-trending-up</v-icon>
              <span class="text-caption success--text font-weight-bold">+{{ stat.trend }}%</span>
              <span class="text-caption grey--text ml-2">from last month</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters Toolbar -->
      <v-card class="rounded-xl border-light mb-8 pa-4 soft-shadow bg-white">
        <v-row align="center" dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              placeholder="Search by Order ID or Customer..."
              prepend-inner-icon="mdi-magnify"
              outlined
              dense
              hide-details
              class="rounded-lg"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              placeholder="Order Status"
              outlined
              dense
              hide-details
              clearable
              class="rounded-lg"
              @change="fetchOrders"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-menu
              ref="menu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateRange"
                  label="Date Range"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  hide-details
                  class="rounded-lg"
                />
              </template>
              <v-date-picker
                v-model="dateRange"
                range
                no-title
                scrollable
                @change="fetchOrders"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="dateMenu = false">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn-toggle v-model="viewMode" mandatory dense borderless class="view-toggle pa-1 rounded-xl w-100">
              <v-btn block small value="all" class="rounded-xl flex-grow-1">All Sales</v-btn>
              <v-btn block small value="urgent" class="rounded-xl flex-grow-1">Urgent Only</v-btn>
              <v-btn block small value="completed" class="rounded-xl flex-grow-1">Fulfilled</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card>

      <!-- Orders Data Table -->
      <v-card class="rounded-xl border-light soft-shadow overflow-hidden">
        <v-data-table
          :headers="headers"
          :items="orders"
          :loading="loading"
          :search="search"
          :items-per-page="10"
          class="bg-white premium-table"
        >
          <!-- Order ID Column -->
          <template slot="item.id" slot-scope="{ item }">
            <div class="d-flex align-center">
              <v-icon size="16" color="grey lighten-1" class="mr-2">mdi-hash</v-icon>
              <span class="font-weight-black text-body-1">#{{ item.id.toString().substring(0, 8).toUpperCase() }}</span>
            </div>
          </template>

          <!-- Customer Column -->
          <template slot="item.user" slot-scope="{ item }">
            <div class="d-flex align-center py-3">
              <v-avatar size="36" class="gradient-primary mr-3">
                <span class="white--text text-caption font-weight-bold">{{ (item.user?.name || 'U')[0] }}</span>
              </v-avatar>
              <div>
                <div class="font-weight-black text-body-2">{{ item.user?.name || 'Guest User' }}</div>
                <div class="text-caption grey--text">{{ item.user?.email || 'no-email@store.com' }}</div>
              </div>
            </div>
          </template>

          <!-- Status Column -->
          <template slot="item.status" slot-scope="{ item }">
            <v-chip
              :color="getStatusColor(item.status) + '15'"
              :text-color="getStatusColor(item.status)"
              small
              label
              class="font-weight-black px-3 py-4"
            >
              <v-icon left x-small :color="getStatusColor(item.status)">mdi-circle</v-icon>
              {{ item.status }}
            </v-chip>
          </template>

          <!-- Total Column -->
          <template slot="item.total" slot-scope="{ item }">
            <div class="font-weight-black primary--text">${{ (item.total || 0).toFixed(2) }}</div>
          </template>

          <!-- Date Column -->
          <template slot="item.createdAt" slot-scope="{ item }">
            <div class="text-body-2 grey--text font-weight-medium">
              {{ formatDate(item.createdAt) }}
            </div>
          </template>

          <!-- Actions Column -->
          <template slot="item.actions" slot-scope="{ item }">
            <div class="d-flex align-center">
              <v-btn icon color="primary" class="bg-primary-light mr-2" @click="viewOrder(item)">
                <v-icon small>mdi-eye-outline</v-icon>
              </v-btn>
              <v-menu offset-y left transition="slide-y-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" class="bg-grey-light">
                    <v-icon small>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list dense class="rounded-lg pa-2">
                  <v-list-item v-for="status in statusOptions" :key="status.value" @click="updateOrderStatus(item, status.value)" class="rounded-md">
                    <v-list-item-icon class="mr-2">
                      <v-icon small :color="getStatusColor(status.value)">mdi-circle-medium</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-bold text-caption">MARK AS {{ status.text.toUpperCase() }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Enhanced Order Detail Dialog -->
    <v-dialog v-model="showOrderDialog" max-width="900px" scrollable>
      <v-card v-if="selectedOrder" class="rounded-xl overflow-hidden">
        <v-toolbar flat dark class="gradient-primary pa-4 h-auto" height="120">
          <v-icon large class="mr-6 bg-white-20 pa-4 rounded-xl">mdi-receipt-text-outline</v-icon>
          <div>
            <div class="text-overline white--text opacity-80 mb-1">TRANSACTION RECEIPT</div>
            <v-toolbar-title class="text-h4 font-weight-black">Order #{{ selectedOrder.id.toString().toUpperCase() }}</v-toolbar-title>
          </div>
          <v-spacer />
          <v-chip color="white" light class="font-weight-black px-4">{{ selectedOrder.status }}</v-chip>
          <v-btn icon @click="showOrderDialog = false" class="ml-4"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text class="pa-8">
          <v-row>
            <!-- Logistics Info -->
            <v-col cols="12" md="5">
              <div class="info-group mb-8">
                <div class="text-caption font-weight-black grey--text text-uppercase letter-spacing-2 mb-4">Customer Details</div>
                <v-card flat class="rounded-xl border-light pa-6">
                  <div class="d-flex align-center mb-6">
                    <v-avatar size="56" class="gradient-primary mr-4 shadow-sm">
                      <span class="white--text text-h5 font-weight-bold">{{ (selectedOrder.user?.name || 'U')[0] }}</span>
                    </v-avatar>
                    <div>
                      <div class="text-h6 font-weight-black">{{ selectedOrder.user?.name || 'Guest Checkout' }}</div>
                      <div class="text-body-2 grey--text">{{ selectedOrder.user?.email || 'No email provided' }}</div>
                    </div>
                  </div>
                  <v-divider class="mb-6 opacity-40" />
                  <div class="d-flex align-center mb-4">
                    <v-icon small color="grey" class="mr-3">mdi-phone-outline</v-icon>
                    <span class="text-body-2 font-weight-bold">+1 (555) 902-1234</span>
                  </div>
                  <div class="d-flex align-start">
                    <v-icon small color="grey" class="mr-3 mt-1">mdi-map-marker-outline</v-icon>
                    <span class="text-body-2 font-weight-bold">{{ selectedOrder.shippingAddress || '742 Evergreen Terrace, Springfield' }}</span>
                  </div>
                </v-card>
              </div>

              <div class="info-group">
                <div class="text-caption font-weight-black grey--text text-uppercase letter-spacing-2 mb-4">Order Metadata</div>
                <v-row dense>
                  <v-col cols="6">
                    <div class="metric-mini pa-4 rounded-xl border-light text-center">
                      <div class="text-caption font-weight-bold grey--text mb-1">Payment</div>
                      <div class="text-subtitle-2 font-weight-black success--text">PAID</div>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="metric-mini pa-4 rounded-xl border-light text-center">
                      <div class="text-caption font-weight-bold grey--text mb-1">Service</div>
                      <div class="text-subtitle-2 font-weight-black primary--text">EXPRESS</div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>

            <!-- Line Items -->
            <v-col cols="12" md="7" class="pl-md-8">
              <div class="text-caption font-weight-black grey--text text-uppercase letter-spacing-2 mb-4">Line Items ({{ selectedOrder.items?.length || 0 }})</div>
              <v-divider class="mb-4" />
              
              <div v-for="item in selectedOrder.items" :key="item.id" class="line-item d-flex align-center py-4 border-bottom-light">
                <v-avatar size="60" rounded="lg" class="mr-4 border-light grey lighten-5">
                  <v-img :src="item.image || 'https://via.placeholder.com/60'" cover />
                </v-avatar>
                <div class="flex-grow-1 overflow-hidden">
                  <div class="text-subtitle-1 font-weight-black text-truncate">{{ item.name }}</div>
                  <div class="text-caption grey--text">Qty: {{ item.quantity }} × ${{ (item.price || 0).toFixed(2) }}</div>
                </div>
                <div class="text-right ml-4">
                  <div class="text-subtitle-1 font-weight-black primary--text">${{ (item.quantity * item.price).toFixed(2) }}</div>
                </div>
              </div>

              <!-- Summary Section -->
              <div class="summary-section mt-8 pa-6 grey lighten-5 rounded-xl">
                <div class="d-flex justify-space-between mb-3">
                  <span class="text-body-2 grey--text font-weight-bold">Subtotal</span>
                  <span class="text-body-2 font-weight-black">${{ (selectedOrder.total - 15).toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-space-between mb-3">
                  <span class="text-body-2 grey--text font-weight-bold">Shipping (Flat)</span>
                  <span class="text-body-2 font-weight-black">$15.00</span>
                </div>
                <v-divider class="my-4" />
                <div class="d-flex justify-space-between align-center">
                  <span class="text-h6 font-weight-black">Grand Total</span>
                  <span class="text-h4 font-weight-black primary--text">${{ (selectedOrder.total || 0).toFixed(2) }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-8 bg-white border-top">
          <v-btn x-large outlined rounded color="primary" class="px-8 font-weight-black">
            <v-icon left>mdi-printer</v-icon> Print Invoice
          </v-btn>
          <v-spacer />
          <v-btn x-large color="primary" rounded elevation="12" class="px-10 font-weight-black" @click="showOrderDialog = false">
            Close Panel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/AdminLayout.vue'

export default {
  name: 'AdminOrders',
  components: {
    AdminLayout
  },
  data() {
    return {
      sidebarDrawer: true,
      loading: false,
      orders: [],
      selectedOrder: null,
      showOrderDialog: false,
      search: '',
      statusFilter: null,
      viewMode: 'all',
      dateRange: [],
      dateMenu: false,
      statusOptions: [
        { text: 'Pending', value: 'PENDING' },
        { text: 'Processing', value: 'PROCESSING' },
        { text: 'Shipped', value: 'SHIPPED' },
        { text: 'Delivered', value: 'DELIVERED' },
        { text: 'Cancelled', value: 'CANCELLED' }
      ],
      orderStats: [
        { label: 'Today Revenue', value: '$3,842', icon: 'mdi-currency-usd', color: 'primary', trend: 12 },
        { label: 'Pending Orders', value: '14', icon: 'mdi-clock-outline', color: 'warning', trend: 4 },
        { label: 'Average Value', value: '$210', icon: 'mdi-chart-areaspline', color: 'info', trend: 8 },
        { label: 'Fulfillment Rate', value: '98%', icon: 'mdi-truck-check-outline', color: 'success', trend: 2 }
      ],
      headers: [
        { text: 'Order Ref', value: 'id', align: 'start' },
        { text: 'Client Profile', value: 'user' },
        { text: 'Transaction Status', value: 'status' },
        { text: 'Net Total', value: 'total' },
        { text: 'Timestamp', value: 'createdAt' },
        { text: 'Workflow', value: 'actions', align: 'end', sortable: false }
      ]
    }
  },
  async created() {
    await this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      this.loading = true
      try {
        const params = {}
        if (this.statusFilter) params.status = this.statusFilter
        
        const response = await this.$http.get('/orders', { params })
        this.orders = response.data?.orders || []
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Error connecting to order ledger.',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async updateOrderStatus(order, status) {
      try {
        await this.$http.patch(`/orders/${order.id}/status`, { status })
        this.$store.dispatch('ui/showSnackbar', {
          message: `Order status synchronized: ${status}`,
          color: 'success'
        })
        await this.fetchOrders()
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', { message: 'Workflow update failed.', color: 'error' })
      }
    },
    viewOrder(order) {
      this.selectedOrder = order
      this.showOrderDialog = true
    },
    getStatusColor(status) {
      const colors = {
        PENDING: '#f59e0b',
        PROCESSING: '#3b82f6',
        SHIPPED: '#8b5cf6',
        DELIVERED: '#10b981',
        CANCELLED: '#ef4444'
      }
      return colors[status] || '#64748b'
    },
    formatDate(date) {
      return new Date(date).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.admin-orders-view {
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.border-light { border: 1px solid rgba(0,0,0,0.06) !important; }
.border-bottom-light { border-bottom: 1px solid rgba(0,0,0,0.05) !important; }
.soft-shadow { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -1px rgba(0,0,0,0.02) !important; }

.view-toggle {
  background-color: #f1f5f9 !important;
}

.view-toggle .v-btn {
  background: transparent !important;
  color: #64748b !important;
  font-weight: 700;
  text-transform: none;
}

.view-toggle .v-btn--active {
  background: white !important;
  color: #0ea5e9 !important;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05) !important;
}

.premium-table >>> th {
  background-color: #f8fafc !important;
  color: #64748b !important;
  text-transform: uppercase !important;
  font-size: 0.7rem !important;
  font-weight: 800 !important;
  letter-spacing: 1px;
  height: 60px !important;
}

.premium-table >>> td {
  height: 72px !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

.gradient-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
}

.bg-primary-light { background-color: rgba(14, 165, 233, 0.08) !important; }
.bg-grey-light { background-color: rgba(100, 116, 139, 0.08) !important; }
.bg-white-20 { background-color: rgba(255, 255, 255, 0.2) !important; }

.letter-spacing-2 { letter-spacing: 2px; }
.opacity-80 { opacity: 0.8; }
.opacity-40 { opacity: 0.4; }

.shadow-sm { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
