<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 mb-6">Shopping Cart</h1>
      </v-col>
    </v-row>

    <v-row v-if="items.length > 0">
      <!-- Cart Items -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            Cart Items ({{ itemCount }})
          </v-card-title>
          <v-divider />
          
          <div v-for="item in items" :key="item.id">
            <v-card-text>
              <v-row align="center">
                <v-col cols="3" sm="2">
                  <v-img
                    :src="getProductImage(item.product)"
                    height="80"
                    contain
                  />
                </v-col>
                <v-col cols="6" sm="4">
                  <h4>{{ item.product.name }}</h4>
                  <p class="text-body-2 grey--text">
                    {{ item.product.category.name }}
                  </p>
                  <p class="text-h6 primary--text">
                    ${{ item.product.price }}
                  </p>
                </v-col>
                <v-col cols="3" sm="3">
                  <v-text-field
                    :value="item.quantity"
                    type="number"
                    min="1"
                    :max="item.product.stock"
                    outlined
                    dense
                    @change="updateQuantity(item.id, $event)"
                  />
                </v-col>
                <v-col cols="12" sm="2">
                  <div class="text-h6 text-right">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </div>
                </v-col>
                <v-col cols="12" sm="1">
                  <v-btn
                    icon
                    color="error"
                    @click="removeItem(item.id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider />
          </div>

          <v-card-actions>
            <v-btn
              text
              color="error"
              @click="clearCart"
            >
              Clear Cart
            </v-btn>
            <v-spacer />
            <v-btn
              text
              @click="$router.push('/products')"
            >
              Continue Shopping
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Order Summary -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Order Summary</v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="6">Subtotal:</v-col>
              <v-col cols="6" class="text-right">${{ total.toFixed(2) }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="6">Shipping:</v-col>
              <v-col cols="6" class="text-right">Free</v-col>
            </v-row>
            <v-row>
              <v-col cols="6">Tax:</v-col>
              <v-col cols="6" class="text-right">${{ (total * 0.1).toFixed(2) }}</v-col>
            </v-row>
            <v-divider class="my-3" />
            <v-row>
              <v-col cols="6" class="text-h6">Total:</v-col>
              <v-col cols="6" class="text-right text-h6 primary--text">
                ${{ (total * 1.1).toFixed(2) }}
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              large
              block
              @click="$router.push('/checkout')"
            >
              Proceed to Checkout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty Cart -->
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-icon size="120" color="grey lighten-2">mdi-cart-outline</v-icon>
        <h2 class="grey--text mb-4">Your cart is empty</h2>
        <v-btn
          color="primary"
          large
          @click="$router.push('/products')"
        >
          Start Shopping
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Cart',
  computed: {
    ...mapGetters({
      items: 'cart/items',
      total: 'cart/total',
      itemCount: 'cart/itemCount'
    })
  },
  created() {
    this.$store.dispatch('cart/fetchCart')
  },
  methods: {
    async updateQuantity(itemId, quantity) {
      const qty = parseInt(quantity)
      if (qty > 0) {
        await this.$store.dispatch('cart/updateCartItem', {
          itemId,
          quantity: qty
        })
      }
    },
    async removeItem(itemId) {
      await this.$store.dispatch('cart/removeFromCart', itemId)
      this.$store.dispatch('ui/showSnackbar', {
        message: 'Item removed from cart',
        color: 'info'
      })
    },
    async clearCart() {
      await this.$store.dispatch('cart/clearCart')
      this.$store.dispatch('ui/showSnackbar', {
        message: 'Cart cleared',
        color: 'info'
      })
    },
    getProductImage(product) {
      if (product.images && product.images.length > 0) {
        return product.images[0]
      }
      return `https://via.placeholder.com/200x200/1976D2/FFFFFF?text=${encodeURIComponent(product.name)}`
    }
  }
}
</script>