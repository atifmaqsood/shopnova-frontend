<template>
  <v-card class="product-card" hover>
    <div class="product-image-area" @click="goToProduct">
      <v-img
        :src="productImage"
        height="200"
        class="white--text align-end"
        @error="imageError = true"
      >
        <template v-slot:placeholder>
          <div class="icon-fallback">
            <v-icon size="80" color="primary">mdi-package-variant</v-icon>
          </div>
        </template>
        <v-card-title class="text-h6 product-title-overlay">{{ product.name }}</v-card-title>
      </v-img>
    </div>

    <v-card-text>
      <div class="text--primary">
        <div class="text-h6 mb-2">${{ product.price }}</div>
        <p class="text-body-2 mb-2">{{ truncatedDescription }}</p>
        <v-chip
          small
          :color="stockColor"
          text-color="white"
        >
          {{ stockText }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        text
        @click="goToProduct"
      >
        View Details
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        :disabled="product.stock === 0 || !isAuthenticated"
        @click="addToCart"
        :loading="adding"
      >
        <v-icon left>mdi-cart-plus</v-icon>
        Add to Cart
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      adding: false,
      imageError: false
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated'
    }),
    productImage() {
      if (this.product.images && this.product.images.length > 0 && this.product.images[0]) {
        const imageUrl = this.product.images[0]
        if (imageUrl.startsWith('/uploads/')) {
          return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${imageUrl}`
        }
        return imageUrl
      }
      return 'https://via.placeholder.com/1x1/transparent/transparent.png'
    },
    truncatedDescription() {
      if (this.product.description.length > 100) {
        return this.product.description.substring(0, 100) + '...'
      }
      return this.product.description
    },
    stockColor() {
      if (this.product.stock === 0) return 'red'
      if (this.product.stock < 10) return 'orange'
      return 'green'
    },
    stockText() {
      if (this.product.stock === 0) return 'Out of Stock'
      if (this.product.stock < 10) return `Low Stock (${this.product.stock})`
      return 'In Stock'
    }
  },
  methods: {
    goToProduct() {
      this.$router.push(`/products/${this.product.id}`)
    },
    async addToCart() {
      if (!this.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      this.adding = true
      try {
        await this.$store.dispatch('cart/addToCart', {
          productId: this.product.id,
          quantity: 1
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
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.v-card__text {
  flex-grow: 1;
}

.product-image-area {
  cursor: pointer;
}

.icon-fallback {
  height: 200px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid #ddd;
}



.product-title-overlay {
  background: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(4px);
  margin: 0 !important;
  padding: 12px 16px !important;
}

.product-name-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(25, 118, 210, 0.9);
  color: white;
  padding: 12px 16px;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}


</style>