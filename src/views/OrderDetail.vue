<template>
  <v-container v-if="order">
    <v-row>
      <v-col cols="12">
        <v-btn text @click="$router.go(-1)" class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Back
        </v-btn>
        <h1 class="display-1 mb-6">Order #{{ order.id }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Order Details -->
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Order Information</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <strong>Order Date:</strong><br>
                {{ formatDate(order.createdAt) }}
              </v-col>
              <v-col cols="6">
                <strong>Status:</strong><br>
                <v-chip :color="getStatusColor(order.status)" text-color="white">
                  {{ order.status }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Order Items -->
        <v-card>
          <v-card-title>Order Items</v-card-title>
          <v-card-text>
            <div v-for="item in order.items" :key="item.id" class="mb-4">
              <v-row align="center">
                <v-col cols="3" sm="2">
                  <v-img
                    :src="getProductImage(item.product)"
                    height="80"
                    contain
                  />
                </v-col>
                <v-col cols="6" sm="6">
                  <h4>{{ item.product.name }}</h4>
                  <p class="text-body-2">Quantity: {{ item.quantity }}</p>
                  <p class="text-body-2">Price: ${{ item.price }}</p>
                </v-col>
                <v-col cols="3" sm="4" class="text-right">
                  <div class="text-h6">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                </v-col>
              </v-row>
              <v-divider class="mt-3" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Order Summary -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Order Summary</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">Subtotal:</v-col>
              <v-col cols="6" class="text-right">${{ order.total.toFixed(2) }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="6">Shipping:</v-col>
              <v-col cols="6" class="text-right">Free</v-col>
            </v-row>
            <v-divider class="my-2" />
            <v-row>
              <v-col cols="6" class="text-h6">Total:</v-col>
              <v-col cols="6" class="text-right text-h6 primary--text">
                ${{ order.total.toFixed(2) }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Customer Info -->
        <v-card class="mt-4">
          <v-card-title>Customer Information</v-card-title>
          <v-card-text>
            <p><strong>Name:</strong> {{ order.user.name }}</p>
            <p><strong>Email:</strong> {{ order.user.email }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Loading State -->
  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader type="article" />
      </v-col>
    </v-row>
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
        PENDING: 'orange',
        PROCESSING: 'blue',
        SHIPPED: 'purple',
        DELIVERED: 'green',
        CANCELLED: 'red'
      }
      return colors[status] || 'grey'
    },
    getProductImage(product) {
      if (product.images && product.images.length > 0) {
        return product.images[0]
      }
      return `https://via.placeholder.com/100x100/1976D2/FFFFFF?text=${encodeURIComponent(product.name)}`
    }
  }
}
</script>