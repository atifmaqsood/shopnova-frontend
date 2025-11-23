<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 mb-6">Checkout</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Checkout Steps -->
      <v-col cols="12" md="8">
        <v-stepper v-model="step" vertical>
          <!-- Step 1: Address -->
          <v-stepper-step :complete="step > 1" step="1">
            Shipping Address
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card class="mb-4">
              <v-card-text>
                <div v-if="addresses.length > 0">
                  <h3 class="mb-4">Select Address</h3>
                  <v-radio-group v-model="selectedAddress">
                    <v-radio
                      v-for="address in addresses"
                      :key="address.id"
                      :value="address.id"
                    >
                      <template v-slot:label>
                        <div>
                          <div class="font-weight-bold">
                            {{ address.street }}
                          </div>
                          <div class="text-body-2">
                            {{ address.city }}, {{ address.state }} {{ address.zipCode }}
                          </div>
                          <div class="text-body-2">
                            {{ address.country }}
                          </div>
                          <v-chip v-if="address.isDefault" small color="primary">
                            Default
                          </v-chip>
                        </div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </div>
                <div v-else>
                  <p>No addresses found. Please add an address first.</p>
                  <v-btn color="primary" @click="$router.push('/addresses')">
                    Add Address
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
            <v-btn
              color="primary"
              :disabled="!selectedAddress"
              @click="step = 2"
            >
              Continue
            </v-btn>
          </v-stepper-content>

          <!-- Step 2: Payment -->
          <v-stepper-step :complete="step > 2" step="2">
            Payment Method
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card class="mb-4">
              <v-card-text>
                <v-radio-group v-model="paymentMethod">
                  <v-radio value="cash" label="Cash on Delivery" />
                  <v-radio value="card" label="Credit/Debit Card (Coming Soon)" disabled />
                </v-radio-group>
              </v-card-text>
            </v-card>
            <v-btn text @click="step = 1" class="mr-2">Back</v-btn>
            <v-btn color="primary" @click="step = 3">Continue</v-btn>
          </v-stepper-content>

          <!-- Step 3: Review -->
          <v-stepper-step step="3">
            Review Order
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-card class="mb-4">
              <v-card-title>Order Summary</v-card-title>
              <v-card-text>
                <div v-for="item in items" :key="item.id" class="mb-2">
                  <v-row>
                    <v-col cols="8">
                      {{ item.product.name }} x {{ item.quantity }}
                    </v-col>
                    <v-col cols="4" class="text-right">
                      ${{ (item.product.price * item.quantity).toFixed(2) }}
                    </v-col>
                  </v-row>
                </div>
                <v-divider class="my-2" />
                <v-row>
                  <v-col cols="8"><strong>Total:</strong></v-col>
                  <v-col cols="4" class="text-right">
                    <strong>${{ total.toFixed(2) }}</strong>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-btn text @click="step = 2" class="mr-2">Back</v-btn>
            <v-btn
              color="primary"
              :loading="placing"
              @click="placeOrder"
            >
              Place Order
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-col>

      <!-- Order Summary Sidebar -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Order Summary</v-card-title>
          <v-divider />
          <v-card-text>
            <div v-for="item in items" :key="item.id" class="mb-3">
              <v-row>
                <v-col cols="3">
                  <v-img
                    :src="getProductImage(item.product)"
                    height="50"
                    contain
                  />
                </v-col>
                <v-col cols="9">
                  <div class="text-body-2">{{ item.product.name }}</div>
                  <div class="text-caption">Qty: {{ item.quantity }}</div>
                  <div class="text-body-2 primary--text">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </div>
                </v-col>
              </v-row>
            </div>
            <v-divider class="my-3" />
            <v-row>
              <v-col cols="6">Subtotal:</v-col>
              <v-col cols="6" class="text-right">${{ total.toFixed(2) }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="6">Shipping:</v-col>
              <v-col cols="6" class="text-right">Free</v-col>
            </v-row>
            <v-divider class="my-2" />
            <v-row>
              <v-col cols="6" class="text-h6">Total:</v-col>
              <v-col cols="6" class="text-right text-h6 primary--text">
                ${{ total.toFixed(2) }}
              </v-col>
            </v-row>
          </v-card-text>
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
        
        const response = await this.$store.dispatch('orders/createOrder', orderData)
        
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Order placed successfully!',
          color: 'success'
        })
        
        // Navigate to account page since order detail route needs to be implemented
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
        return product.images[0]
      }
      return `https://via.placeholder.com/100x100/1976D2/FFFFFF?text=${encodeURIComponent(product.name)}`
    }
  }
}
</script>