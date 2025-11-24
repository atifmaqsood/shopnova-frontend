<template>
  <v-container class="cart-container py-8">
    <!-- Page Header -->
    <div class="page-header mb-8">
      <h1 class="page-title">Shopping Cart</h1>
      <p class="page-subtitle">Review your items before checkout</p>
    </div>

    <v-row v-if="items.length > 0">
      <!-- Cart Items -->
      <v-col cols="12" lg="8">
        <v-card class="cart-items-card">
          <div class="card-header">
            <div class="card-title-wrapper">
              <v-icon color="#0ea5e9" class="mr-2">mdi-cart</v-icon>
              <span class="card-title">Cart Items ({{ itemCount }})</span>
            </div>
          </div>

          <div class="cart-items-list">
            <div v-for="(item, index) in items" :key="item.id" class="cart-item">
              <v-row align="center" no-gutters>
                <!-- Product Image -->
                <v-col cols="12" sm="2" class="text-center">
                  <div class="product-image-wrapper">
                    <v-img
                      :src="getProductImage(item.product)"
                      height="100"
                      width="100"
                      class="product-image"
                      contain
                    />
                  </div>
                </v-col>

                <!-- Product Details -->
                <v-col cols="12" sm="4" class="px-4">
                  <h3 class="product-name">{{ item.product.name }}</h3>
                  <p class="product-category">
                    <v-icon small color="#64748b">mdi-tag</v-icon>
                    {{ item.product.category.name }}
                  </p>
                  <div class="product-price">
                    ${{ item.product.price.toFixed(2) }}
                  </div>
                </v-col>

                <!-- Quantity Controls -->
                <v-col cols="12" sm="3" class="px-4">
                  <div class="quantity-control">
                    <label class="quantity-label">Quantity</label>
                    <div class="quantity-input-wrapper">
                      <v-btn
                        icon
                        small
                        class="quantity-btn"
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                      >
                        <v-icon small>mdi-minus</v-icon>
                      </v-btn>
                      <input
                        type="number"
                        :value="item.quantity"
                        min="1"
                        :max="item.product.stock"
                        class="quantity-input"
                        @change="updateQuantity(item.id, $event.target.value)"
                      />
                      <v-btn
                        icon
                        small
                        class="quantity-btn"
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        :disabled="item.quantity >= item.product.stock"
                      >
                        <v-icon small>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-col>

                <!-- Item Total -->
                <v-col cols="12" sm="2" class="text-center">
                  <div class="item-total">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </div>
                </v-col>

                <!-- Remove Button -->
                <v-col cols="12" sm="1" class="text-center">
                  <v-btn
                    icon
                    color="error"
                    @click="removeItem(item.id)"
                    class="remove-btn"
                  >
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-divider v-if="index < items.length - 1" class="my-4" />
            </div>
          </div>

          <div class="cart-actions">
            <v-btn
              text
              color="error"
              @click="clearCart"
              class="clear-btn"
            >
              <v-icon left>mdi-delete-sweep</v-icon>
              Clear Cart
            </v-btn>
            <v-spacer />
            <v-btn
              outlined
              color="primary"
              @click="$router.push('/products')"
              class="continue-btn"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              Continue Shopping
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Order Summary -->
      <v-col cols="12" lg="4">
        <v-card class="summary-card sticky-summary">
          <div class="card-header gradient-header">
            <div class="card-title-wrapper">
              <v-icon color="white" class="mr-2">mdi-receipt-text</v-icon>
              <span class="card-title text-white">Order Summary</span>
            </div>
          </div>

          <div class="summary-content">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">${{ total.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Shipping</span>
              <span class="summary-value success--text">Free</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Tax (10%)</span>
              <span class="summary-value">${{ (total * 0.1).toFixed(2) }}</span>
            </div>

            <v-divider class="my-4" />

            <div class="summary-row total-row">
              <span class="summary-label-total">Total</span>
              <span class="summary-value-total">${{ (total * 1.1).toFixed(2) }}</span>
            </div>

            <v-btn
              color="primary"
              large
              block
              class="checkout-btn"
              @click="$router.push('/checkout')"
            >
              <v-icon left>mdi-lock-check</v-icon>
              Proceed to Checkout
            </v-btn>

            <div class="secure-checkout">
              <v-icon small color="#10b981">mdi-shield-check</v-icon>
              <span>Secure Checkout</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty Cart -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="empty-cart-card">
          <div class="empty-cart-content">
            <div class="empty-cart-icon">
              <v-icon size="120" color="#cbd5e1">mdi-cart-outline</v-icon>
            </div>
            <h2 class="empty-cart-title">Your cart is empty</h2>
            <p class="empty-cart-text">Looks like you haven't added anything to your cart yet</p>
            <v-btn
              color="primary"
              large
              class="start-shopping-btn"
              @click="$router.push('/products')"
            >
              <v-icon left>mdi-shopping</v-icon>
              Start Shopping
            </v-btn>
          </div>
        </v-card>
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
      return `https://via.placeholder.com/200x200/0ea5e9/FFFFFF?text=${encodeURIComponent(product.name)}`
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.cart-container {
  max-width: 1400px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Page Header */
.page-header {
  text-align: center;
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
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

/* Card Styles */
.cart-items-card,
.summary-card,
.empty-cart-card {
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

/* Cart Items */
.cart-items-list {
  padding: 24px;
}

.cart-item {
  padding: 16px 0;
  transition: all 0.3s ease;
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

.cart-item:hover .product-image {
  border-color: rgba(14, 165, 233, 0.3);
  transform: scale(1.05);
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.product-category {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Quantity Control */
.quantity-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quantity-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}

.quantity-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 4px;
}

.quantity-btn {
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

.quantity-input {
  width: 60px;
  text-align: center;
  border: 2px solid rgba(14, 165, 233, 0.2);
  border-radius: 8px;
  padding: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.quantity-input:focus {
  outline: none;
  border-color: rgba(14, 165, 233, 0.6);
}

.item-total {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.remove-btn {
  transition: all 0.3s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
}

/* Cart Actions */
.cart-actions {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: #f8fafc;
  border-top: 1px solid rgba(14, 165, 233, 0.1);
}

.clear-btn,
.continue-btn {
  text-transform: none;
  font-weight: 600;
  border-radius: 10px;
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

.checkout-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
  color: white !important;
  text-transform: none;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3) !important;
  margin-top: 24px;
  height: 56px !important;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.4) !important;
  transform: translateY(-2px);
}

.secure-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

/* Empty Cart */
.empty-cart-card {
  padding: 80px 40px;
}

.empty-cart-content {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.empty-cart-icon {
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-cart-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.empty-cart-text {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 32px;
}

.start-shopping-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
  color: white !important;
  text-transform: none;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3) !important;
  padding: 0 40px !important;
}

.start-shopping-btn:hover {
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.4) !important;
  transform: translateY(-2px);
}

@media (max-width: 960px) {
  .page-title {
    font-size: 2rem;
  }

  .sticky-summary {
    position: relative;
    top: 0;
  }

  .cart-item {
    text-align: center;
  }

  .product-name {
    margin-top: 12px;
  }
}
</style>
