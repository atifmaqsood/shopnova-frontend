<template>
  <v-card class="product-card" hover>
    <v-img
      :src="productImage"
      height="200"
      class="white--text align-end"
      @click="goToProduct"
    >
      <v-card-title class="text-h6">{{ product.name }}</v-card-title>
    </v-img>

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
      adding: false
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated'
    }),
    productImage() {
      if (this.product.images && this.product.images.length > 0) {
        const imageUrl = this.product.images[0]
        // If it's a relative URL, prepend the API base URL
        if (imageUrl.startsWith('/uploads/')) {
          return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${imageUrl}`
        }
        return imageUrl
      }
      return `https://via.placeholder.com/300x200/1976D2/FFFFFF?text=${encodeURIComponent(this.product.name)}`
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
</style>