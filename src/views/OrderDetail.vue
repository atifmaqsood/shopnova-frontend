<template>
  <v-container class="order-detail-container py-8">
    <!-- Loading State -->
    <v-row v-if="loading" class="py-12">
      <v-col cols="12">
        <v-skeleton-loader type="article, table-heading, table-row-divider@3, actions" class="rounded-xl" />
      </v-col>
    </v-row>

    <!-- Content State -->
    <div v-else-if="order">
      <!-- Back Button & Header -->
      <div class="page-header mb-8">
        <v-btn text class="back-btn mb-4" @click="$router.push('/orders')">
          <v-icon left>mdi-arrow-left</v-icon>
          Back to Orders
        </v-btn>
        <div class="header-content">
          <div>
            <h1 class="page-title">Order #{{ order.id }}</h1>
            <p class="page-subtitle">Placed on {{ formatDate(order.createdAt) }}</p>
          </div>
          <v-chip
            :color="getStatusColor(order.status)"
            text-color="white"
            large
            class="status-chip"
          >
            <v-icon left small>{{ getStatusIcon(order.status) }}</v-icon>
            {{ order.status }}
          </v-chip>
        </div>
      </div>

      <v-row>
        <!-- Order Details -->
        <v-col cols="12" lg="8">
          <!-- Order Information -->
          <v-card class="info-card mb-6">
            <div class="card-header">
              <div class="card-title-wrapper">
                <v-icon color="#0ea5e9" class="mr-2">mdi-information</v-icon>
                <span class="card-title">Order Information</span>
              </div>
            </div>
            <div class="card-content">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="info-item">
                    <span class="info-label">Order Date</span>
                    <span class="info-value">{{ formatDate(order.createdAt) }}</span>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="info-item">
                    <span class="info-label">Order Status</span>
                    <v-chip
                      :color="getStatusColor(order.status)"
                      text-color="white"
                      x-small
                      label
                      class="font-weight-bold"
                    >
                      {{ order.status }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="info-item">
                    <span class="info-label">Payment Method</span>
                    <span class="info-value text-capitalize">{{ order.paymentMethod || 'Credit Card' }}</span>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="info-item">
                    <span class="info-label">Payment Status</span>
                    <v-chip
                      :color="order.paymentStatus === 'Paid' ? 'success' : 'orange'"
                      text-color="white"
                      x-small
                      label
                      class="font-weight-bold"
                    >
                      {{ order.paymentStatus || 'Paid' }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- Order Items -->
          <v-card class="items-card">
            <div class="card-header">
              <div class="card-title-wrapper">
                <v-icon color="#0ea5e9" class="mr-2">mdi-cart</v-icon>
                <span class="card-title">Order Items</span>
              </div>
            </div>
            <div class="card-content pa-0">
              <div v-for="(item, index) in order.items" :key="index" class="order-item-row pa-4">
                <v-row align="center">
                  <!-- Product Image -->
                  <v-col cols="12" sm="2" class="text-center">
                    <div class="product-image-wrapper">
                      <v-img
                        :src="item.image"
                        height="80"
                        width="80"
                        class="product-image"
                        contain
                      />
                    </div>
                  </v-col>

                  <!-- Product Details -->
                  <v-col cols="12" sm="5" class="px-4">
                    <h3 class="product-name">{{ item.name }}</h3>
                    <p class="product-meta">
                      <span class="product-price">${{ (item.price || 0).toFixed(2) }}</span>
                      <span class="product-qty">× {{ item.quantity || 0 }}</span>
                    </p>
                  </v-col>

                  <!-- Item Total -->
                  <v-col cols="12" sm="5" class="text-sm-right px-4">
                    <div class="item-total">
                      ${{ ((item.price || 0) * (item.quantity || 0)).toFixed(2) }}
                    </div>
                  </v-col>
                </v-row>
                <v-divider v-if="index < order.items.length - 1" class="my-4" />
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Order Summary Sidebar -->
        <v-col cols="12" lg="4">
          <!-- Total Summary -->
          <v-card class="summary-card mb-6">
            <div class="card-header">
              <div class="card-title-wrapper">
                <v-icon color="#0ea5e9" class="mr-2">mdi-receipt</v-icon>
                <span class="card-title">Payment Summary</span>
              </div>
            </div>
            <div class="card-content">
              <div class="summary-row">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value">${{ (order.total || 0).toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Shipping</span>
                <span class="summary-value success--text">Free</span>
              </div>
              <v-divider class="my-4" />
              <div class="summary-row total-row">
                <span class="summary-label-total">Total Amount</span>
                <span class="summary-value-total">${{ (order.total || 0).toFixed(2) }}</span>
              </div>
            </div>
          </v-card>

          <!-- Shipping Address -->
          <v-card class="shipping-card mb-6">
            <div class="card-header">
              <div class="card-title-wrapper">
                <v-icon color="#0ea5e9" class="mr-2">mdi-map-marker</v-icon>
                <span class="card-title">Shipping Address</span>
              </div>
            </div>
            <div class="card-content">
              <p class="address-text">{{ order.shippingAddress }}</p>
            </div>
          </v-card>

          <!-- Customer Info -->
          <v-card class="customer-card" v-if="order.user">
            <div class="card-header">
              <div class="card-title-wrapper">
                <v-icon color="#0ea5e9" class="mr-2">mdi-account</v-icon>
                <span class="card-title">Customer Details</span>
              </div>
            </div>
            <div class="card-content">
              <div class="customer-item mb-4">
                <v-icon small color="#64748b" class="mr-2">mdi-account-circle</v-icon>
                <div>
                  <p class="customer-label">Name</p>
                  <p class="customer-value">{{ order.user.name }}</p>
                </div>
              </div>
              <div class="customer-item">
                <v-icon small color="#64748b" class="mr-2">mdi-email</v-icon>
                <div>
                  <p class="customer-label">Email</p>
                  <p class="customer-value">{{ order.user.email }}</p>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-16">
      <v-icon size="80" color="grey lighten-2" class="mb-4">mdi-package-variant-remove</v-icon>
      <h2 class="text-h4 font-weight-bold mb-4">Order Not Found</h2>
      <p class="grey--text mb-10">We couldn't find the order you're looking for.</p>
      <v-btn color="primary" rounded @click="$router.push('/orders')">Go to My Orders</v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'OrderDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    ...mapGetters({
      order: 'orders/order',
      loading: 'orders/loading'
    })
  },
  async created() {
    await this.$store.dispatch('orders/fetchOrder', this.id)
  },
  methods: {
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getStatusColor(status) {
      const colors = {
        PENDING: '#f59e0b',
        PROCESSING: '#3b82f6',
        SHIPPED: '#8b5cf6',
        DELIVERED: '#10b981',
        CANCELLED: '#ef4444'
      }
      return colors[status?.toUpperCase()] || '#6b7280'
    },
    getStatusIcon(status) {
      const icons = {
        PENDING: 'mdi-clock-outline',
        PROCESSING: 'mdi-package-variant',
        SHIPPED: 'mdi-truck-delivery',
        DELIVERED: 'mdi-check-circle',
        CANCELLED: 'mdi-close-circle'
      }
      return icons[status?.toUpperCase()] || 'mdi-information'
    }
  }
}
</script>

<style scoped>
.order-detail-container {
  background-color: #f8fafc;
  min-height: 100vh;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-title {
  font-weight: 700;
  color: #334155;
}

.info-label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-value {
  font-weight: 600;
  color: #0f172a;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.product-price {
  font-weight: 700;
  color: #0ea5e9;
  margin-right: 12px;
}

.product-qty {
  color: #64748b;
  font-size: 0.9rem;
}

.item-total {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-label {
  color: #64748b;
}

.summary-value {
  font-weight: 600;
  color: #0f172a;
}

.total-row {
  margin-top: 16px;
}

.summary-label-total {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
}

.summary-value-total {
  font-size: 1.5rem;
  font-weight: 900;
  color: #0ea5e9;
}

.customer-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0;
}

.customer-value {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0;
}

.customer-item {
  display: flex;
  align-items: center;
}

.address-text {
  color: #334155;
  line-height: 1.6;
}

.info-card, .items-card, .summary-card, .shipping-card, .customer-card {
  border-radius: 20px !important;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05) !important;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.card-content {
  padding: 24px;
}
</style>
