<template>
  <div class="orders-page">
    <!-- Header Section -->
    <section class="orders-header">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <h1 class="text-h2 font-weight-black white--text mb-2">My Orders</h1>
            <p class="text-subtitle-1 white--text o-70">Track, manage and review your purchases</p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <v-chip color="rgba(255,255,255,0.2)" class="white--text backdrop-blur">
              <v-icon left size="20" color="white">mdi-package-variant</v-icon>
              {{ orders.length }} Orders Total
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-container class="py-12">
      <!-- Loading State -->
      <v-row v-if="loading">
        <v-col v-for="i in 3" :key="i" cols="12" class="mb-6">
          <v-skeleton-loader type="article" class="rounded-xl" />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center py-16">
        <div class="empty-icon-wrapper mb-6">
          <v-icon size="100" color="primary lighten-4">mdi-package-variant-closed</v-icon>
        </div>
        <h2 class="text-h4 font-weight-bold mb-4">No orders found</h2>
        <p class="text-subtitle-1 grey--text mb-10">It looks like you haven't placed any orders yet.</p>
        <v-btn x-large color="primary" rounded elevation="8" @click="$router.push('/products')" class="px-10">
          Explore Products
        </v-btn>
      </div>

      <!-- Orders List -->
      <div v-else>
        <v-row>
          <v-col v-for="order in orders" :key="order.id" cols="12" class="mb-6">
            <v-card class="order-card-modern" hover @click="viewDetail(order.id)">
              <div class="pa-6">
                <v-row align="center">
                  <!-- Order Summary Info -->
                  <v-col cols="12" sm="4">
                    <div class="d-flex align-center mb-2">
                      <span class="text-h6 font-weight-bold mr-3">#{{ order.id }}</span>
                      <v-chip :color="getStatusColor(order.status)" x-small label class="font-weight-bold">
                        {{ order.status }}
                      </v-chip>
                    </div>
                    <div class="text-body-2 grey--text">
                      <v-icon x-small class="mr-1">mdi-calendar</v-icon>
                      {{ formatDate(order.createdAt) }}
                    </div>
                  </v-col>

                  <!-- Items Preview (Images) -->
                  <v-col cols="12" sm="4">
                    <div class="d-flex align-center gap-2">
                      <div v-for="(item, i) in order.items.slice(0, 3)" :key="i" class="item-preview">
                        <v-img :src="item.image" width="48" height="48" class="rounded-lg border" cover />
                      </div>
                      <div v-if="order.items.length > 3" class="more-items">
                        +{{ order.items.length - 3 }}
                      </div>
                    </div>
                  </v-col>

                  <!-- Price & Action -->
                  <v-col cols="12" sm="4" class="text-sm-right d-flex flex-column align-sm-end">
                    <div class="text-h5 primary--text font-weight-black mb-2">
                      ${{ (order.total || 0).toFixed(2) }}
                    </div>
                    <v-btn color="primary" outlined rounded small class="view-btn">
                      View Details
                      <v-icon right x-small>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Orders',
  computed: {
    ...mapGetters({
      orders: 'orders/orders',
      loading: 'orders/loading'
    })
  },
  created() {
    this.$store.dispatch('orders/fetchOrders')
  },
  methods: {
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    getStatusColor(status) {
      const colors = {
        PENDING: 'orange',
        PROCESSING: 'blue',
        SHIPPED: 'purple',
        DELIVERED: 'green',
        CANCELLED: 'red'
      }
      return colors[status?.toUpperCase()] || 'grey'
    },
    viewDetail(id) {
      this.$router.push(`/orders/${id}`)
    }
  }
}
</script>

<style scoped>
.orders-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

.orders-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.orders-header::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.o-70 { opacity: 0.7; }

.backdrop-blur {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.order-card-modern {
  border-radius: 20px !important;
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.order-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important;
  border-color: #0ea5e9;
}

.item-preview {
  position: relative;
  transition: transform 0.2s;
}

.order-card-modern:hover .item-preview {
  transform: scale(1.05);
}

.more-items {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.empty-icon-wrapper {
  width: 160px;
  height: 160px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.gap-2 { gap: 8px; }

.view-btn {
  font-weight: 700;
  letter-spacing: 0.5px;
}
</style>
