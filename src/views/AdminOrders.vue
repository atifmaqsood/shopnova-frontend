<template>
  <AdminLayout>
    <div class="orders-content">
      <div class="page-header mb-6">
        <h1 class="page-title">Order Management</h1>
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Filter by Status"
          outlined
          dense
          clearable
          style="max-width: 200px;"
          @change="fetchOrders"
        />
      </div>

      <v-card class="orders-table">
        <v-data-table
          :headers="headers"
          :items="orders"
          :loading="loading"
          class="elevation-0"
        >
          <template slot="item.status" slot-scope="{ item }">
            <v-chip
              small
              :color="getStatusColor(item.status)"
              text-color="white"
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template slot="item.total" slot-scope="{ item }">
            ${{ item.total.toFixed(2) }}
          </template>
          <template slot="item.createdAt" slot-scope="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <v-btn icon small @click="viewOrder(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="updateOrderStatus(item, 'PROCESSING')">
                  <v-list-item-title>Mark as Processing</v-list-item-title>
                </v-list-item>
                <v-list-item @click="updateOrderStatus(item, 'SHIPPED')">
                  <v-list-item-title>Mark as Shipped</v-list-item-title>
                </v-list-item>
                <v-list-item @click="updateOrderStatus(item, 'DELIVERED')">
                  <v-list-item-title>Mark as Delivered</v-list-item-title>
                </v-list-item>
                <v-list-item @click="updateOrderStatus(item, 'CANCELLED')">
                  <v-list-item-title>Cancel Order</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Order Details Dialog -->
    <v-dialog v-model="showOrderDialog" max-width="900px">
      <v-card v-if="selectedOrder" class="premium-dialog">
        <div class="dialog-header">
          <div class="header-content">
            <v-icon large color="white" class="header-icon">mdi-clipboard-list</v-icon>
            <div class="header-info">
              <h2 class="dialog-title">Order #{{ selectedOrder.id }}</h2>
              <p class="dialog-subtitle">{{ formatDate(selectedOrder.createdAt) }}</p>
            </div>
            <v-spacer />
            <v-chip
              :color="getStatusColor(selectedOrder.status)"
              text-color="white"
              class="status-chip"
            >
              {{ selectedOrder.status }}
            </v-chip>
          </div>
        </div>

        <v-card-text class="dialog-content">
          <!-- Customer & Order Info -->
          <v-row>
            <v-col cols="12" md="6">
              <div class="info-section">
                <h3 class="section-title">
                  <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                  Customer Information
                </h3>
                <div class="info-item">
                  <span class="info-label">Name:</span>
                  <span class="info-value">{{ selectedOrder.user?.name || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">{{ selectedOrder.user?.email || 'N/A' }}</span>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-section">
                <h3 class="section-title">
                  <v-icon color="success" class="mr-2">mdi-information</v-icon>
                  Order Information
                </h3>
                <div class="info-item">
                  <span class="info-label">Order Date:</span>
                  <span class="info-value">{{ formatDate(selectedOrder.createdAt) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Total Amount:</span>
                  <span class="info-value total-amount">${{ selectedOrder.total.toFixed(2) }}</span>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-6"></v-divider>

          <!-- Order Items -->
          <h3 class="section-title mb-4">
            <v-icon color="primary" class="mr-2">mdi-cart</v-icon>
            Order Items
          </h3>
          <div class="items-table">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.items" :key="item.id" class="item-row">
                    <td class="font-weight-medium">{{ item.product?.name || 'Product' }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>${{ item.price.toFixed(2) }}</td>
                    <td class="font-weight-bold">${{ (item.quantity * item.price).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn large class="close-btn" @click="showOrderDialog = false">
            <v-icon left>mdi-close</v-icon>
            Close
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
      loading: false,
      orders: [],
      selectedOrder: null,
      showOrderDialog: false,
      statusFilter: null,
      statusOptions: [
        { text: 'Pending', value: 'PENDING' },
        { text: 'Processing', value: 'PROCESSING' },
        { text: 'Shipped', value: 'SHIPPED' },
        { text: 'Delivered', value: 'DELIVERED' },
        { text: 'Cancelled', value: 'CANCELLED' }
      ],
      headers: [
        { text: 'Order ID', value: 'id' },
        { text: 'Customer', value: 'user.name' },
        { text: 'Status', value: 'status' },
        { text: 'Total', value: 'total' },
        { text: 'Date', value: 'createdAt' },
        { text: 'Actions', value: 'actions', sortable: false }
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
        if (this.statusFilter) {
          params.status = this.statusFilter
        }
        
        const response = await this.$http.get('/orders', { params })
        this.orders = response.data?.orders || []
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to fetch orders',
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
          message: 'Order status updated successfully!',
          color: 'success'
        })
        await this.fetchOrders()
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to update order status',
          color: 'error'
        })
      }
    },
    viewOrder(order) {
      this.selectedOrder = order
      this.showOrderDialog = true
    },
    getStatusColor(status) {
      const colors = {
        PENDING: 'orange',
        PROCESSING: 'blue',
        SHIPPED: 'purple',
        DELIVERED: 'green',
        CANCELLED: 'red'
      }
      return colors[status] || 'grey'
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.orders-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.orders-table {
  border-radius: 16px;
  overflow: hidden;
}

/* Premium Dialog Styles */
.premium-dialog {
  border-radius: 24px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  padding: 32px;
  color: white;
  position: relative;
  overflow: hidden;
}

.dialog-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 16px;
  border-radius: 16px;
}

.header-info {
  flex: 1;
}

.dialog-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  color: white;
  line-height: 1.2;
}

.dialog-subtitle {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.status-chip {
  font-weight: 700;
  padding: 20px 16px;
}

.dialog-content {
  padding: 32px !important;
}

.info-section {
  padding: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(14, 165, 233, 0.08);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #64748b;
  font-size: 0.9rem;
}

.info-value {
  font-weight: 600;
  color: #1e293b;
}

.total-amount {
  font-size: 1.25rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.items-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(14, 165, 233, 0.1);
}

.item-row {
  transition: background 0.2s ease;
}

.item-row:hover {
  background: rgba(14, 165, 233, 0.04);
}

.dialog-actions {
  padding: 20px 32px !important;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.02), rgba(118, 75, 162, 0.02));
  border-top: 1px solid rgba(14, 165, 233, 0.1);
}

.close-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
  color: white !important;
  text-transform: none;
  font-weight: 700;
  border-radius: 12px;
  padding: 0 32px;
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .dialog-header {
    padding: 24px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .dialog-content {
    padding: 24px !important;
  }
}
</style>
