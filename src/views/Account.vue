<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 mb-6">My Account</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Profile Card -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Profile Information</v-card-title>
          <v-card-text v-if="user">
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Phone:</strong> {{ user.phone || 'Not provided' }}</p>
            <p><strong>Role:</strong> {{ user.role }}</p>
            <p><strong>Member since:</strong> {{ formatDate(user.createdAt) }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text>
              Edit Profile
            </v-btn>
            <v-btn color="secondary" text>
              Change Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Quick Actions -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Quick Actions</v-card-title>
          <v-card-text>
            <v-btn
              block
              color="primary"
              class="mb-2"
              @click="$router.push('/cart')"
            >
              <v-icon left>mdi-cart</v-icon>
              View Cart
            </v-btn>
            <v-btn
              block
              color="info"
              class="mb-2"
              @click="viewOrders"
            >
              <v-icon left>mdi-package-variant</v-icon>
              My Orders
            </v-btn>
            <v-btn
              block
              color="success"
              class="mb-2"
              @click="$router.push('/addresses')"
            >
              <v-icon left>mdi-map-marker</v-icon>
              My Addresses
            </v-btn>
            <v-btn
              block
              color="info"
              class="mb-2"
              @click="viewNotifications"
            >
              <v-icon left>mdi-bell</v-icon>
              Notifications
              <v-badge
                v-if="unreadCount > 0"
                :content="unreadCount"
                color="red"
                inline
              />
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Orders -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Recent Orders</v-card-title>
          <v-card-text>
            <div v-if="recentOrders.length > 0">
              <v-card v-for="order in recentOrders" :key="order.id" class="mb-4" outlined>
                <v-card-subtitle class="pb-0">
                  <v-row align="center">
                    <v-col>
                      <strong>Order #{{ order.id }}</strong> - {{ formatDate(order.createdAt) }}
                    </v-col>
                    <v-col class="text-right">
                      <v-chip :color="getStatusColor(order.status)" text-color="white" small>
                        {{ order.status }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-card-subtitle>
                <v-card-text>
                  <div v-for="item in order.items" :key="item.id" class="mb-2">
                    <v-row align="center">
                      <v-col cols="8">
                        <div class="font-weight-medium">{{ item.product.name }}</div>
                        <div class="text-caption grey--text">Qty: {{ item.quantity }} × ${{ item.price.toFixed(2) }}</div>
                      </v-col>
                      <v-col cols="4" class="text-right">
                        <strong>${{ (item.quantity * item.price).toFixed(2) }}</strong>
                      </v-col>
                    </v-row>
                  </div>
                  <v-divider class="my-2" />
                  <v-row>
                    <v-col class="text-right">
                      <strong>Total: ${{ order.total.toFixed(2) }}</strong>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <p v-else class="text-center grey--text">
              No orders found
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Account',
  data() {
    return {
      recentOrders: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      unreadCount: 'notifications/unreadCount'
    })
  },
  async created() {
    this.$store.dispatch('notifications/fetchUnreadCount')
    await this.fetchRecentOrders()
  },
  methods: {
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    async fetchRecentOrders() {
      try {
        const response = await this.$http.get('/orders/my-orders', {
          params: { limit: 5 }
        })
        // Extract orders from nested API response structure
        this.recentOrders = response.data?.orders || []
      } catch (error) {
        console.warn('Failed to fetch recent orders:', error.message)
      }
    },
    viewOrders() {
      // Navigate to orders page when implemented
      this.$store.dispatch('ui/showSnackbar', {
        message: 'Orders page coming soon!',
        color: 'info'
      })
    },
    viewNotifications() {
      // Navigate to notifications page when implemented
      this.$store.dispatch('ui/showSnackbar', {
        message: 'Notifications page coming soon!',
        color: 'info'
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
      return colors[status] || 'grey'
    }
  }
}
</script>