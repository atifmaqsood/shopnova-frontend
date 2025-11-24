<template>
  <v-card class="product-card" hover elevation="2">
    <div class="product-image-wrapper" @click="goToProduct">
      <v-img
        :src="productImage"
        height="280"
        class="product-image"
        @error="imageError = true"
      >
        <template v-slot:placeholder>
          <div class="icon-fallback">
            <v-icon size="80" color="primary">mdi-package-variant</v-icon>
          </div>
        </template>
      </v-img>
      
      <!-- Stock Badge -->
      <v-chip
        :color="stockColor"
        text-color="white"
        small
        class="stock-badge"
      >
        {{ stockText }}
      </v-chip>
      
      <!-- Quick View Overlay -->
      <div class="quick-view-overlay">
        <v-btn
          icon
          large
          color="white"
          class="quick-view-btn"
          @click.stop="goToProduct"
        >
          <v-icon>mdi-eye-outline</v-icon>
        </v-btn>
      </div>
    </div>

    <v-card-text class="product-info pa-4">
      <h3 class="product-name mb-2" @click="goToProduct">
        {{ product.name }}
      </h3>
      
      <p class="product-description text-body-2 grey--text text--darken-1 mb-3">
        {{ truncatedDescription }}
      </p>
      
      <div class="d-flex align-center justify-space-between">
        <div class="price-section">
          <span class="product-price">${{ product.price }}</span>
        </div>
        
        <v-btn
          color="primary"
          :disabled="product.stock === 0 || !isAuthenticated"
          @click="addToCart"
          :loading="adding"
          small
          depressed
          class="add-to-cart-btn"
        >
          <v-icon left small>mdi-cart-plus</v-icon>
          Add
        </v-btn>
      </div>
    </v-card-text>
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
      if (this.product.description.length > 80) {
        return this.product.description.substring(0, 80) + '...'
      }
      return this.product.description
    },
    stockColor() {
      if (this.product.stock === 0) return 'error'
      if (this.product.stock < 10) return 'warning'
      return 'success'
    },
    stockText() {
      if (this.product.stock === 0) return 'Out of Stock'
      if (this.product.stock < 10) return `Only ${this.product.stock} left`
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
  border-radius: 16px !important;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e0e0e0;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
  border-color: #0ea5e9;
}

.product-image-wrapper {
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.product-image {
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.icon-fallback {
  height: 280px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.quick-view-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .quick-view-overlay {
  opacity: 1;
}

.quick-view-btn {
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.product-card:hover .quick-view-btn {
  transform: scale(1);
}

.product-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}

.product-name:hover {
  color: #0ea5e9;
}

.product-description {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3em;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.add-to-cart-btn {
  border-radius: 8px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3) !important;
}

.add-to-cart-btn:hover {
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4) !important;
}

/* Responsive */
@media (max-width: 600px) {
  .product-image-wrapper {
    height: 200px;
  }
  
  .product-image {
    height: 200px !important;
  }
  
  .icon-fallback {
    height: 200px;
  }
  
  .product-name {
    font-size: 0.95rem;
  }
  
  .product-price {
    font-size: 1.25rem;
  }
  
  .stock-badge {
    top: 8px;
    right: 8px;
  }
}
</style>