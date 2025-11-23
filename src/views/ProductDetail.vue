<template>
  <v-container v-if="product">
    <v-row>
      <!-- Product Images -->
      <v-col cols="12" md="6">
        <v-card>
          <v-img
            :src="mainImage"
            height="400"
            contain
          />
          <v-card-text v-if="product.images && product.images.length > 1">
            <v-row>
              <v-col
                v-for="(image, index) in product.images"
                :key="index"
                cols="3"
              >
                <v-img
                  :src="image"
                  height="80"
                  class="cursor-pointer"
                  @click="mainImage = image"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Product Info -->
      <v-col cols="12" md="6">
        <div class="mb-4">
          <h1 class="display-1 mb-2">{{ product.name }}</h1>
          <v-chip
            small
            color="primary"
            text-color="white"
            class="mb-2"
            v-if="product.category"
          >
            {{ product.category.name }}
          </v-chip>
          <div class="display-1 primary--text mb-4">
            ${{ product.price }}
          </div>
        </div>

        <!-- Stock Status -->
        <v-alert
          :type="stockAlertType"
          :value="true"
          class="mb-4"
        >
          {{ stockMessage }}
        </v-alert>

        <!-- Quantity Selector -->
        <v-row class="mb-4" v-if="product.stock > 0">
          <v-col cols="6" sm="4">
            <v-text-field
              v-model.number="quantity"
              label="Quantity"
              type="number"
              min="1"
              :max="product.stock"
              outlined
              dense
            />
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <v-row class="mb-6">
          <v-col cols="12">
            <v-btn
              color="primary"
              large
              block
              :disabled="product.stock === 0 || !isAuthenticated"
              :loading="adding"
              @click="addToCart"
            >
              <v-icon left>mdi-cart-plus</v-icon>
              Add to Cart
            </v-btn>
          </v-col>
        </v-row>

        <!-- Product Description -->
        <v-card>
          <v-card-title>Product Description</v-card-title>
          <v-card-text>
            <p>{{ product.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Loading State -->
  <v-container v-else>
    <v-row>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="image" height="400" />
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="article" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProductDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      quantity: 1,
      adding: false,
      mainImage: ''
    }
  },
  computed: {
    ...mapGetters({
      product: 'products/product',
      isAuthenticated: 'auth/isAuthenticated'
    }),
    stockAlertType() {
      if (!this.product) return 'info'
      if (this.product.stock === 0) return 'error'
      if (this.product.stock < 10) return 'warning'
      return 'success'
    },
    stockMessage() {
      if (!this.product) return 'Loading...'
      if (this.product.stock === 0) return 'Out of Stock'
      if (this.product.stock < 10) return `Only ${this.product.stock} left in stock`
      return 'In Stock'
    }
  },
  watch: {
    product: {
      handler(newProduct) {
        if (newProduct && newProduct.images && newProduct.images.length > 0) {
          this.mainImage = newProduct.images[0]
        } else if (newProduct) {
          this.mainImage = `https://via.placeholder.com/400x400/1976D2/FFFFFF?text=${encodeURIComponent(newProduct.name)}`
        }
      },
      immediate: true
    }
  },
  async created() {
    await this.$store.dispatch('products/fetchProduct', this.id)
  },
  beforeDestroy() {
    this.$store.dispatch('products/clearProduct')
  },
  methods: {
    async addToCart() {
      if (!this.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      if (!this.product) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Product not loaded yet',
          color: 'warning'
        })
        return
      }

      this.adding = true
      try {
        await this.$store.dispatch('cart/addToCart', {
          productId: this.product.id,
          quantity: this.quantity
        })
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Product added to cart!',
          color: 'success'
        })
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to add product to cart',
          color: 'error'
        })
      } finally {
        this.adding = false
      }
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>