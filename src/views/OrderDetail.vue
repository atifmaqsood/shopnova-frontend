<template>
  <v-container v-if="order" class="order-detail-container py-8">
    <!-- Back Button & Header -->
    <div class="page-header mb-8">
      <v-btn text class="back-btn mb-4" @click="$router.go(-1)">
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
                    small
                  >
                    {{ order.status }}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-item">
                  <span class="info-label">Payment Method</span>
                  <span class="info-value">{{ order.paymentMethod || 'Cash on Delivery' }}</span>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-item">
                  <span class="info-label">Shipping Address</span>
                  <span class="info-value">{{ order.shippingAddress || 'N/A' }}</span>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>

        <!-- Order Items -->
        <v-card class="items-card">
          <div class="card-header">
            <div class="card-title-wrapper">
              <v-icon color="#0ea5e9" class="mr-2">mdi-package-variant</v-icon>
              <span class="card-title">Order Items</span>
            </div>
          </div>
          <div class="card-content">
            <div v-for="(item, index) in order.items" :key="item.id" class="order-item">
              <v-row align="center" no-gutters>
                <!-- Product Image -->
                <v-col cols="12" sm="2" class="text-center">
                  <div class="product-image-wrapper">
                    <v-img
                      :src="getProductImage(item.product)"
                      height="80"
                      width="80"
                      class="product-image"
                      contain
                    />
                  </div>
                </v-col>

                <!-- Product Details -->
                <v-col cols="12" sm="5" class="px-4">
                  <h3 class="product-name">{{ item.product.name }}</h3>
                  <p class="product-meta">
                    <span class="product-price">${{ item.price.toFixed(2) }}</span>
                    <span class="product-qty">× {{ item.quantity }}</span>
                  </p>
                </v-col>

                <!-- Item Total -->
                <v-col cols="12" sm="5" class="text-sm-right px-4">
                  <div class="item-total">
                    ${{ (item.price * item.quantity).toFixed(2) }}
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
        <!-- Order Summary -->
        <v-card class="summary-card sticky-summary mb-6">
          <div class="card-header gradient-header">
            <div class="card-title-wrapper">
              <v-icon color="white" class="mr-2">mdi-receipt-text</v-icon>
              <span class="card-title text-white">Order Summary</span>
            </div>
          </div>
          <div class="summary-content">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">${{ order.total.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Shipping</span>
              <span class="summary-value success--text">Free</span>
            </div>

            <v-divider class="my-4" />

            <div class="summary-row total-row">
              <span class="summary-label-total">Total</span>
              <span class="summary-value-total">${{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </v-card>

        <!-- Customer Information -->
        <v-card class="customer-card">
          <div class="card-header">
            <div class="card-title-wrapper">
              <v-icon color="#0ea5e9" class="mr-2">mdi-account</v-icon>
              <span class="card-title">Customer Information</span>
            </div>
          </div>
          <div class="customer-content">
            <div class="customer-item">
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
  </v-container>

  <!-- Loading State -->
  <v-container v-else class="loading-container">
    <div class="loading-content">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="6"
      />
      <p class="loading-text">Loading order details...</p>
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
      order: 'orders/order'
    })
  },
  async created() {
    await this.$store.dispatch('orders/fetchOrder', this.id)
  },
  methods: {
    formatDate(date) {
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
      return colors[status] || '#6b7280'
    },
    getStatusIcon(status) {
      const icons = {
        PENDING: 'mdi-clock-outline',
        PROCESSING: 'mdi-package-variant',
        SHIPPED: 'mdi-truck-delivery',
        DELIVERED: 'mdi-check-circle',
        CANCELLED: 'mdi-close-circle'
      }
      return icons[status] || 'mdi-information'
    },
    getProductImage(product) {
      if (product.images && product.images.length > 0) {
        const imageUrl = product.images[0]
        // If it's already a full URL, return it
        if (imageUrl.startsWith('http')) {
          return imageUrl
        }
        // If it starts with /uploads/, prepend the API URL
        if (imageUrl.startsWith('/uploads/')) {
          return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${imageUrl}`
        }
        // Otherwise, construct the full path
        return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}/uploads/${imageUrl}`
      }
      return `https://via.placeholder.com/100x100/0ea5e9/FFFFFF?text=${encodeURIComponent(product.name)}`
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.order-detail-container {
  max-width: 1400px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Page Header */
.page-header {
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-btn {
  text-transform: none;
  font-weight: 600;
  color: #64748b;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 500;
}

.status-chip {
  font-weight: 700;
  padding: 8px 20px !important;
  height: auto !important;
}

/* Card Styles */
.info-card,
.items-card,
.summary-card,
.customer-card {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  animation: slideUp 0.6s ease-out 0.2s both;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(6, 182, 212, 0.05));
  padding: 20px 24px;
  border-bottom: 1px solid rgba(14, 165, 233, 0.1);
}

.gradient-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  border-bottom: none;
}

.card-title-wrapper {
  display: flex;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.card-content {
  padding: 24px;
}

/* Info Items */
.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
}

.info-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

/* Order Items */
.order-item {
  padding: 16px 0;
}

.product-image-wrapper {
  position: relative;
  display: inline-block;
}

.product-image {
  border-radius: 12px;
  border: 2px solid rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
}

.order-item:hover .product-image {
  border-color: rgba(14, 165, 233, 0.3);
  transform: scale(1.05);
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.product-price {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
}

.product-qty {
  font-size: 0.9rem;
  color: #94a3b8;
}

.item-total {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Summary Card */
.sticky-summary {
  position: sticky;
  top: 90px;
}

.summary-content {
  padding: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-label {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.summary-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.total-row {
  margin-top: 16px;
  padding-top: 16px;
}

.summary-label-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.summary-value-total {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Customer Card */
.customer-content {
  padding: 24px;
}

.customer-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
}

.customer-item:not(:last-child) {
  border-bottom: 1px solid #f1f5f9;
}

.customer-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
}

.customer-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Loading State */
.loading-container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
}

.loading-text {
  margin-top: 24px;
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 500;
}

@media (max-width: 960px) {
  .page-title {
    font-size: 2rem;
  }

  .header-content {
    flex-direction: column;
  }

  .sticky-summary {
    position: relative;
    top: 0;
  }

  .order-item {
    text-align: center;
  }

  .product-name {
    margin-top: 12px;
  }
}
</style>
