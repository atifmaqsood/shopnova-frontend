<template>
  <div class="product-detail">
    <!-- Breadcrumb -->
    <v-container class="py-2">
      <v-breadcrumbs
        :items="breadcrumbs"
        divider=">"
        class="pa-0"
      >
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            :to="item.to"
            :disabled="item.disabled"
            class="text-body-2"
          >
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-container>

    <v-container v-if="product" class="py-8">
      <v-row class="product-main">
        <!-- Product Images Gallery -->
        <v-col cols="12" lg="7" xl="6">
          <div class="image-gallery">
            <!-- Main Image -->
            <div class="main-image-container">
              <v-card class="main-image-card" elevation="0">
                <v-img
                  :src="mainImage"
                  :alt="product.name"
                  class="main-image"
                  contain
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5" />
                    </v-row>
                  </template>
                </v-img>
                
                <!-- Image Navigation Arrows -->
                <v-btn
                  v-if="product.images && product.images.length > 1"
                  icon
                  class="nav-btn nav-btn-left"
                  @click="previousImage"
                  :disabled="currentImageIndex === 0"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  v-if="product.images && product.images.length > 1"
                  icon
                  class="nav-btn nav-btn-right"
                  @click="nextImage"
                  :disabled="currentImageIndex === product.images.length - 1"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card>
            </div>

            <!-- Thumbnail Carousel -->
            <div v-if="product.images && product.images.length > 1" class="thumbnail-carousel">
              <div class="thumbnail-container">
                <div
                  v-for="(image, index) in product.images"
                  :key="index"
                  class="thumbnail-item"
                  :class="{ active: currentImageIndex === index }"
                  @click="selectImage(index)"
                >
                  <v-img
                    :src="getImageUrl(image)"
                    :alt="`${product.name} ${index + 1}`"
                    class="thumbnail-image"
                    cover
                  />
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Product Information -->
        <v-col cols="12" lg="5" xl="6">
          <div class="product-info">
            <!-- Category Badge -->
            <v-chip
              v-if="product.category"
              small
              outlined
              color="primary"
              class="mb-3 category-chip"
            >
              {{ product.category.name }}
            </v-chip>

            <!-- Product Title -->
            <h1 class="product-title mb-4">{{ product.name }}</h1>

            <!-- Price -->
            <div class="price-section mb-6">
              <span class="current-price">${{ product.price }}</span>
            </div>

            <!-- Stock Status -->
            <div class="stock-section mb-6">
              <div class="stock-indicator" :class="stockStatusClass">
                <v-icon small class="mr-2">{{ stockIcon }}</v-icon>
                <span class="stock-text">{{ stockMessage }}</span>
              </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div v-if="product.stock > 0" class="purchase-section mb-8">
              <div class="quantity-selector mb-4">
                <label class="quantity-label">Quantity:</label>
                <div class="quantity-controls">
                  <v-btn
                    icon
                    small
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                    class="quantity-btn"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="quantity-display">{{ quantity }}</span>
                  <v-btn
                    icon
                    small
                    @click="increaseQuantity"
                    :disabled="quantity >= product.stock"
                    class="quantity-btn"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>

              <v-btn
                color="primary"
                x-large
                block
                rounded
                :disabled="!isAuthenticated"
                :loading="adding"
                @click="addToCart"
                class="add-to-cart-btn"
              >
                <v-icon left>mdi-cart-plus</v-icon>
                Add to Cart
              </v-btn>

              <v-btn
                outlined
                large
                block
                rounded
                class="mt-3 wishlist-btn"
                @click="toggleWishlist"
              >
                <v-icon left>mdi-heart-outline</v-icon>
                Add to Wishlist
              </v-btn>
            </div>

            <!-- Product Features -->
            <div class="features-section mb-6">
              <div class="feature-item">
                <v-icon color="green" class="mr-2">mdi-truck-delivery</v-icon>
                <span>Free shipping on orders over $50</span>
              </div>
              <div class="feature-item">
                <v-icon color="blue" class="mr-2">mdi-shield-check</v-icon>
                <span>30-day return policy</span>
              </div>
              <div class="feature-item">
                <v-icon color="orange" class="mr-2">mdi-headset</v-icon>
                <span>24/7 customer support</span>
              </div>
            </div>

            <!-- Product Description -->
            <v-expansion-panels class="description-panel" flat>
              <v-expansion-panel>
                <v-expansion-panel-header class="px-0">
                  <h3>Product Description</h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="px-0">
                  <p class="description-text">{{ product.description }}</p>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Loading State -->
    <v-container v-else class="py-8">
      <v-row>
        <v-col cols="12" lg="7">
          <v-skeleton-loader type="image" height="500" class="mb-4" />
          <v-skeleton-loader type="list-item-avatar" height="100" />
        </v-col>
        <v-col cols="12" lg="5">
          <v-skeleton-loader type="article" />
        </v-col>
      </v-row>
    </v-container>

    <!-- Related Products Section -->
    <div v-if="product" class="related-products-section">
      <v-container class="py-12">
        <div class="section-header mb-8">
          <h2 class="section-title">You Might Also Like</h2>
          <p class="section-subtitle">Discover similar products that other customers loved</p>
        </div>
        
        <div v-if="relatedProducts.length > 0" class="related-products-grid">
          <div
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            class="related-product-card"
            @click="navigateToProduct(relatedProduct.id)"
          >
            <div class="product-image-container">
              <v-img
                :src="getRelatedProductImage(relatedProduct)"
                :alt="relatedProduct.name"
                class="product-image"
                cover
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>
              <div class="product-overlay">
                <v-btn
                  icon
                  color="white"
                  class="overlay-btn"
                  @click.stop="quickAddToCart(relatedProduct)"
                >
                  <v-icon>mdi-cart-plus</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="product-info-card">
              <h3 class="product-name">{{ relatedProduct.name }}</h3>
              <p class="product-price">${{ relatedProduct.price }}</p>
              <div v-if="relatedProduct.category" class="product-category">
                {{ relatedProduct.category.name }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-related-products">
          <v-icon size="64" color="grey lighten-2">mdi-package-variant</v-icon>
          <p class="no-products-text">No related products found</p>
        </div>
      </v-container>
    </div>
  </div>
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
      mainImage: '',
      currentImageIndex: 0,
      relatedProducts: []
    }
  },
  computed: {
    ...mapGetters({
      product: 'products/product',
      isAuthenticated: 'auth/isAuthenticated'
    }),
    breadcrumbs() {
      const items = [
        { text: 'Home', to: '/', disabled: false },
        { text: 'Products', to: '/products', disabled: false }
      ]
      if (this.product?.category) {
        items.push({ text: this.product.category.name, disabled: true })
      }
      if (this.product) {
        items.push({ text: this.product.name, disabled: true })
      }
      return items
    },
    stockStatusClass() {
      if (!this.product) return 'stock-loading'
      if (this.product.stock === 0) return 'stock-out'
      if (this.product.stock < 10) return 'stock-low'
      return 'stock-available'
    },
    stockIcon() {
      if (!this.product) return 'mdi-loading'
      if (this.product.stock === 0) return 'mdi-close-circle'
      if (this.product.stock < 10) return 'mdi-alert-circle'
      return 'mdi-check-circle'
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
          this.currentImageIndex = 0
          this.mainImage = this.getImageUrl(newProduct.images[0])
        } else if (newProduct) {
          this.mainImage = `https://via.placeholder.com/500x500/1976D2/FFFFFF?text=${encodeURIComponent(newProduct.name)}`
        }
        if (newProduct) {
          this.fetchRelatedProducts()
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
    selectImage(index) {
      this.currentImageIndex = index
      this.mainImage = this.getImageUrl(this.product.images[index])
    },
    nextImage() {
      if (this.currentImageIndex < this.product.images.length - 1) {
        this.selectImage(this.currentImageIndex + 1)
      }
    },
    previousImage() {
      if (this.currentImageIndex > 0) {
        this.selectImage(this.currentImageIndex - 1)
      }
    },
    increaseQuantity() {
      if (this.quantity < this.product.stock) {
        this.quantity++
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
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
    },
    toggleWishlist() {
      this.$store.dispatch('ui/showSnackbar', {
        message: 'Wishlist feature coming soon!',
        color: 'info'
      })
    },
    getImageUrl(imageUrl) {
      if (!imageUrl) return ''
      if (imageUrl.startsWith('/uploads/')) {
        return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${imageUrl}`
      }
      return imageUrl
    },
    getRelatedProductImage(product) {
      if (product.images && product.images.length > 0) {
        return this.getImageUrl(product.images[0])
      }
      return `https://via.placeholder.com/300x300/1976D2/FFFFFF?text=${encodeURIComponent(product.name)}`
    },
    async fetchRelatedProducts() {
      if (!this.product?.category?.id) return
      
      try {
        const response = await this.$store.dispatch('products/fetchProducts', {
          category: this.product.category.id,
          limit: 4
        })
        this.relatedProducts = response.filter(p => p.id !== this.product.id).slice(0, 4)
      } catch (error) {
        console.error('Error fetching related products:', error)
      }
    },
    navigateToProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },
    async quickAddToCart(product) {
      if (!this.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      try {
        await this.$store.dispatch('cart/addToCart', {
          productId: product.id,
          quantity: 1
        })
        this.$store.dispatch('ui/showSnackbar', {
          message: `${product.name} added to cart!`,
          color: 'success'
        })
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to add product to cart',
          color: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.product-detail {
  background: #fafafa;
  min-height: 100vh;
}

.product-main {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Image Gallery Styles */
.image-gallery {
  padding: 24px;
}

.main-image-container {
  position: relative;
  margin-bottom: 20px;
}

.main-image-card {
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
}

.main-image {
  height: 500px;
  border-radius: 12px;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.nav-btn-left {
  left: 16px;
}

.nav-btn-right {
  right: 16px;
}

/* Thumbnail Carousel */
.thumbnail-carousel {
  margin-top: 16px;
}

.thumbnail-container {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0;
  scrollbar-width: thin;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail-item:hover {
  border-color: #1976d2;
  transform: translateY(-2px);
}

.thumbnail-item.active {
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
}

/* Product Info Styles */
.product-info {
  padding: 32px;
}

.category-chip {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #1a1a1a;
  margin: 0;
}

.price-section {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
}

.current-price {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1976d2;
}

/* Stock Status */
.stock-section {
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.stock-indicator {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 500;
}

.stock-available {
  background: #e8f5e8;
  color: #2e7d32;
}

.stock-low {
  background: #fff3e0;
  color: #f57c00;
}

.stock-out {
  background: #ffebee;
  color: #d32f2f;
}

/* Purchase Section */
.purchase-section {
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quantity-label {
  font-weight: 600;
  color: #424242;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
}

.quantity-btn {
  background: white !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

.quantity-display {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.add-to-cart-btn {
  height: 56px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px;
}

.wishlist-btn {
  height: 48px !important;
  font-weight: 500 !important;
  text-transform: none !important;
}

/* Features Section */
.features-section {
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #616161;
}

.feature-item:last-child {
  margin-bottom: 0;
}

/* Description Panel */
.description-panel {
  background: transparent;
}

.description-text {
  line-height: 1.6;
  color: #424242;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 960px) {
  .product-main {
    margin: 0 -12px;
    border-radius: 0;
  }
  
  .image-gallery,
  .product-info {
    padding: 20px;
  }
  
  .product-title {
    font-size: 2rem;
  }
  
  .current-price {
    font-size: 1.8rem;
  }
}

@media (max-width: 600px) {
  .thumbnail-container {
    gap: 8px;
  }
  
  .thumbnail-item {
    width: 60px;
    height: 60px;
  }
  
  .quantity-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* Related Products Section */
.related-products-section {
  background: #f8f9fa;
  margin-top: 60px;
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.related-product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.related-product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.product-image {
  height: 100%;
  transition: transform 0.3s ease;
}

.related-product-card:hover .product-image {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.related-product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-btn {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
}

.product-info-card {
  padding: 20px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 8px;
}

.product-category {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.no-related-products {
  text-align: center;
  padding: 60px 20px;
}

.no-products-text {
  font-size: 1.1rem;
  color: #666;
  margin-top: 16px;
}

@media (max-width: 960px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .related-products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 600px) {
  .related-products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .product-image-container {
    height: 200px;
  }
  
  .product-info-card {
    padding: 16px;
  }
}
</style>