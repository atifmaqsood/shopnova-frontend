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
    <v-dialog v-model="showOrderDialog" max-width="800px">
      <v-card v-if="selectedOrder">
        <v-card-title>
          Order #{{ selectedOrder.id }}
          <v-spacer />
          <v-chip
            :color="getStatusColor(selectedOrder.status)"
            text-color="white"
          >
            {{ selectedOrder.status }}
          </v-chip>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <h4>Customer Information</h4>
              <p><strong>Name:</strong> {{ selectedOrder.user?.name }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.user?.email }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <h4>Order Information</h4>
              <p><strong>Date:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
              <p><strong>Total:</strong> ${{ selectedOrder.total.toFixed(2) }}</p>
            </v-col>
          </v-row>
          
          <h4 class="mt-4">Order Items</h4>
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
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td>{{ item.product?.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.price.toFixed(2) }}</td>
                  <td>${{ (item.quantity * item.price).toFixed(2) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showOrderDialog = false">Close</v-btn>
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
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.orders-table {
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>