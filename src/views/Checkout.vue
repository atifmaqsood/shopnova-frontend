<template>
  <v-container class="checkout-container py-8">
    <!-- Page Header -->
    <div class="page-header mb-8">
      <h1 class="page-title">Checkout</h1>
      <p class="page-subtitle">Complete your purchase securely</p>
    </div>

    <v-row>
      <!-- Checkout Steps -->
      <v-col cols="12" lg="8">
        <v-card class="checkout-card">
          <!-- Progress Steps -->
          <div class="steps-header">
            <div
              v-for="(stepItem, index) in steps"
              :key="index"
              class="step-item"
              :class="{ active: step >= index + 1, completed: step > index + 1 }"
            >
              <div class="step-number">
                <v-icon v-if="step > index + 1" color="white" small>mdi-check</v-icon>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="step-label">{{ stepItem }}</span>
            </div>
          </div>

          <!-- Step 1: Shipping Address -->
          <div v-if="step === 1" class="step-content">
            <div class="step-title-wrapper">
              <v-icon color="#0ea5e9" class="mr-2">mdi-map-marker</v-icon>
              <h2 class="step-title">Shipping Address</h2>
            </div>

            <div v-if="addresses.length > 0" class="addresses-list">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="address-card"
                :class="{ selected: selectedAddress === address.id }"
                @click="selectedAddress = address.id"
              >
                <v-radio
                  :value="address.id"
                  :input-value="selectedAddress"
                  color="primary"
                  class="address-radio"
                />
                <div class="address-content">
                  <div class="address-header">
                    <span class="address-street">{{ address.street }}</span>
                    <v-chip v-if="address.isDefault" x-small color="primary">Default</v-chip>
                  </div>
                  <p class="address-details">
                    {{ address.city }}, {{ address.state }} {{ address.zipCode }}
                  </p>
                  <p class="address-country">{{ address.country }}</p>
                </div>
              </div>
            </div>

            <div v-else class="no-address">
              <v-icon size="80" color="#cbd5e1">mdi-map-marker-off</v-icon>
              <p class="no-address-text">No addresses found</p>
              <v-btn color="primary" @click="$router.push('/addresses')">
                <v-icon left>mdi-plus</v-icon>
                Add Address
              </v-btn>
            </div>

            <div class="step-actions">
              <v-btn
                color="primary"
                large
                :disabled="!selectedAddress"
                @click="step = 2"
                class="next-btn"
              >
                Continue to Payment
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Step 2: Payment Method -->
          <div v-if="step === 2" class="step-content">
            <div class="step-title-wrapper">
              <v-icon color="#0ea5e9" class="mr-2">mdi-credit-card</v-icon>
              <h2 class="step-title">Payment Method</h2>
            </div>

            <div class="payment-methods">
              <div
                class="payment-card"
                :class="{ selected: paymentMethod === 'cash' }"
                @click="paymentMethod = 'cash'"
              >
                <v-radio
                  value="cash"
                  :input-value="paymentMethod"
                  color="primary"
                  class="payment-radio"
                />
                <div class="payment-content">
                  <v-icon size="40" color="#0ea5e9">mdi-cash</v-icon>
                  <div class="payment-details">
                    <h3 class="payment-name">Cash on Delivery</h3>
                    <p class="payment-desc">Pay when you receive your order</p>
                  </div>
                </div>
              </div>

              <div
                class="payment-card disabled"
              >
                <v-radio
                  value="card"
                  disabled
                  color="primary"
                  class="payment-radio"
                />
                <div class="payment-content">
                  <v-icon size="40" color="#cbd5e1">mdi-credit-card</v-icon>
                  <div class="payment-details">
                    <h3 class="payment-name">Credit/Debit Card</h3>
                    <p class="payment-desc">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <v-btn text @click="step = 1" class="back-btn">
                <v-icon left>mdi-arrow-left</v-icon>
                Back
              </v-btn>
              <v-btn
                color="primary"
                large
                @click="step = 3"
                class="next-btn"
              >
                Review Order
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Step 3: Review Order -->
          <div v-if="step === 3" class="step-content">
            <div class="step-title-wrapper">
              <v-icon color="#0ea5e9" class="mr-2">mdi-clipboard-check</v-icon>
              <h2 class="step-title">Review Your Order</h2>
            </div>

            <div class="review-section">
              <h3 class="review-subtitle">Order Items</h3>
              <div v-for="item in items" :key="item.id" class="review-item">
                <div class="review-item-name">
                  {{ item.product.name }} × {{ item.quantity }}
                </div>
                <div class="review-item-price">
                  ${{ (item.product.price * item.quantity).toFixed(2) }}
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="review-total">
                <span class="review-total-label">Total Amount</span>
                <span class="review-total-value">${{ total.toFixed(2) }}</span>
              </div>
            </div>

            <div class="step-actions">
              <v-btn text @click="step = 2" class="back-btn">
                <v-icon left>mdi-arrow-left</v-icon>
                Back
              </v-btn>
              <v-btn
                color="primary"
                large
                :loading="placing"
                @click="placeOrder"
                class="place-order-btn"
              >
                <v-icon left>mdi-check-circle</v-icon>
                Place Order
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Order Summary Sidebar -->
      <v-col cols="12" lg="4">
        <v-card class="summary-card sticky-summary">
          <div class="card-header gradient-header">
            <div class="card-title-wrapper">
              <v-icon color="white" class="mr-2">mdi-receipt-text</v-icon>
              <span class="card-title text-white">Order Summary</span>
            </div>
          </div>

          <div class="summary-content">
            <!-- Order Items Preview -->
            <div class="summary-items">
              <div v-for="item in items" :key="item.id" class="summary-item">
                <v-img
                  :src="getProductImage(item.product)"
                  height="60"
                  width="60"
                  class="summary-item-image"
                  contain
                />
                <div class="summary-item-details">
                  <p class="summary-item-name">{{ item.product.name }}</p>
                  <p class="summary-item-qty">Qty: {{ item.quantity }}</p>
                </div>
                <div class="summary-item-price">
                  ${{ (item.product.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>

            <v-divider class="my-4" />

            <!-- Price Breakdown -->
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">${{ total.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Shipping</span>
              <span class="summary-value success--text">Free</span>
            </div>

            <v-divider class="my-4" />

            <div class="summary-row total-row">
              <span class="summary-label-total">Total</span>
              <span class="summary-value-total">${{ total.toFixed(2) }}</span>
            </div>

            <div class="secure-checkout">
              <v-icon small color="#10b981">mdi-shield-check</v-icon>
              <span>Secure Checkout</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Checkout',
  data() {
    return {
      step: 1,
      steps: ['Shipping', 'Payment', 'Review'],
      selectedAddress: null,
      paymentMethod: 'cash',
      placing: false
    }
  },
  computed: {
    ...mapGetters({
      items: 'cart/items',
      total: 'cart/total',
      addresses: 'user/addresses'
    })
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('cart/fetchCart'),
      this.$store.dispatch('user/fetchAddresses')
    ])

    // Auto-select default address
    const defaultAddress = this.addresses.find(addr => addr.isDefault)
    if (defaultAddress) {
      this.selectedAddress = defaultAddress.id
    }

    // Redirect if cart is empty
    if (this.items.length === 0) {
      this.$router.push('/cart')
    }
  },
  methods: {
    async placeOrder() {
      this.placing = true
      try {
        const selectedAddr = this.addresses.find(addr => addr.id === this.selectedAddress)
        const shippingAddress = selectedAddr ? 
          `${selectedAddr.street}, ${selectedAddr.city}, ${selectedAddr.state} ${selectedAddr.zipCode}, ${selectedAddr.country}` : ''
        
        const orderData = {
          shippingAddress,
          paymentMethod: this.paymentMethod
        }
        
        await this.$store.dispatch('orders/createOrder', orderData)
        
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Order placed successfully!',
          color: 'success'
        })
        
        this.$router.push('/account')
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: error.response?.data?.message || 'Failed to place order',
          color: 'error'
        })
      } finally {
        this.placing = false
      }
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

.checkout-container {
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

/* Checkout Card */
.checkout-card {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  animation: slideUp 0.6s ease-out 0.2s both;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Progress Steps */
.steps-header {
  display: flex;
  justify-content: space-between;
  padding: 32px 24px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(6, 182, 212, 0.05));
  border-bottom: 1px solid rgba(14, 165, 233, 0.1);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  position: relative;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 60%;
  width: 80%;
  height: 2px;
  background: #e2e8f0;
  transition: all 0.3s ease;
}

.step-item.completed::after {
  background: linear-gradient(90deg, #0ea5e9, #06b6d4);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.3s ease;
  z-index: 1;
}

.step-item.active .step-number {
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.step-item.completed .step-number {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.step-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #94a3b8;
  transition: color 0.3s ease;
}

.step-item.active .step-label {
  color: #0ea5e9;
}

/* Step Content */
.step-content {
  padding: 32px 24px;
}

.step-title-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* Address Cards */
.addresses-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.address-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.address-card:hover {
  border-color: rgba(14, 165, 233, 0.3);
  background: rgba(14, 165, 233, 0.02);
}

.address-card.selected {
  border-color: #0ea5e9;
  background: rgba(14, 165, 233, 0.05);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

.address-content {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.address-street {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.address-details,
.address-country {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 4px;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.payment-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-card:not(.disabled):hover {
  border-color: rgba(14, 165, 233, 0.3);
  background: rgba(14, 165, 233, 0.02);
}

.payment-card.selected {
  border-color: #0ea5e9;
  background: rgba(14, 165, 233, 0.05);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

.payment-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.payment-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.payment-desc {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

/* Review Section */
.review-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.review-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.review-item-name {
  font-size: 1rem;
  color: #475569;
  font-weight: 500;
}

.review-item-price {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.review-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
}

.review-total-label {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.review-total-value {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Step Actions */
.step-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.back-btn,
.next-btn,
.place-order-btn {
  text-transform: none;
  font-weight: 700;
  border-radius: 12px;
}

.next-btn,
.place-order-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3) !important;
  transition: all 0.3s ease;
}

.next-btn:hover,
.place-order-btn:hover {
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4) !important;
  transform: translateY(-2px);
}

/* No Address */
.no-address {
  text-align: center;
  padding: 60px 20px;
}

.no-address-text {
  font-size: 1.1rem;
  color: #64748b;
  margin: 16px 0 24px;
}

/* Summary Card */
.summary-card {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.sticky-summary {
  position: sticky;
  top: 90px;
}

.card-header {
  padding: 20px 24px;
}

.gradient-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

.card-title-wrapper {
  display: flex;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.summary-content {
  padding: 24px;
}

/* Summary Items */
.summary-items {
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.summary-item-image {
  border-radius: 8px;
  border: 2px solid rgba(14, 165, 233, 0.1);
}

.summary-item-details {
  flex: 1;
}

.summary-item-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.summary-item-qty {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.summary-item-price {
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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

@media (max-width: 960px) {
  .page-title {
    font-size: 2rem;
  }

  .steps-header {
    padding: 24px 16px;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .sticky-summary {
    position: relative;
    top: 0;
  }
}
</style>
