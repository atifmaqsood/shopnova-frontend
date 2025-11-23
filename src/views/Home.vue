<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-carousel
        cycle
        height="600"
        hide-delimiters
        show-arrows-on-hover
        interval="5000"
        class="hero-carousel"
      >
        <v-carousel-item
          v-for="(slide, i) in heroSlides"
          :key="i"
          :src="slide.image"
        >
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-col cols="12" md="8" lg="6" class="text-center hero-content">
              <div class="hero-text-wrapper">
                <h1 class="hero-title text-h2 text-md-h1 font-weight-black white--text mb-6" data-aos="fade-down">
                  {{ slide.title }}
                </h1>
                <p class="hero-subtitle text-h6 text-md-h5 white--text mb-8 font-weight-light" data-aos="fade-up" data-aos-delay="200">
                  {{ slide.subtitle }}
                </p>
                <v-btn
                  x-large
                  color="white"
                  class="primary--text hero-btn"
                  elevation="8"
                  rounded
                  @click="$router.push('/products')"
                  data-aos="zoom-in"
                  data-aos-delay="400"
                >
                  Shop Now
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </section>

    <!-- Quick Stats Section -->
    <section class="stats-section py-8">
      <v-container>
        <v-row>
          <v-col cols="6" md="3" class="text-center" v-for="stat in stats" :key="stat.title">
            <div class="stat-card pa-4">
              <v-icon size="48" :color="stat.color" class="mb-3">{{ stat.icon }}</v-icon>
              <h3 class="text-h4 font-weight-bold primary--text">{{ stat.value }}</h3>
              <p class="text-body-2 grey--text text--darken-1">{{ stat.title }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Categories Section -->
    <section class="categories-section py-12 grey lighten-5">
      <v-container>
        <div class="section-header text-center mb-10">
          <h2 class="section-title text-h3 font-weight-bold primary--text mb-3">
            Shop by Category
          </h2>
          <p class="section-subtitle text-h6 grey--text text--darken-1">
            Explore our wide range of product categories
          </p>
        </div>
        <v-row>
          <v-col
            v-for="category in (categories || []).slice(0, 6)"
            :key="category.id"
            cols="6"
            sm="4"
            md="4"
            lg="2"
          >
            <v-card
              class="category-card elevation-4"
              hover
              @click="filterByCategory(category.id)"
              height="180"
            >
              <div class="category-content">
                <div class="category-main-icon mb-2">
                  <v-icon size="48" style="color: white !important;">{{ getCategoryIcon(category.name) }}</v-icon>
                </div>
                <h3 class="category-title text-subtitle-1 font-weight-bold text-center" style="color: white !important; letter-spacing: 0.5px;">
                  {{ category.name }}
                </h3>
                <div class="category-arrow-icon">
                  <v-icon style="color: white !important;">mdi-arrow-right-circle</v-icon>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Featured Products -->
    <section class="products-section py-12">
      <v-container>
        <div class="section-header text-center mb-10">
          <h2 class="section-title text-h3 font-weight-bold primary--text mb-3">
            Featured Products
          </h2>
          <p class="section-subtitle text-h6 grey--text text--darken-1">
            Handpicked products just for you
          </p>
        </div>
        <v-row v-if="featuredProducts.length > 0">
          <v-col
            v-for="product in featuredProducts"
            :key="product.id"
            cols="6"
            sm="6"
            md="4"
            lg="3"
          >
            <ProductCard :product="product" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="64" />
          </v-col>
        </v-row>
        <v-row class="mt-8">
          <v-col class="text-center">
            <v-btn
              x-large
              color="primary"
              elevation="2"
              rounded
              @click="$router.push('/products')"
            >
              View All Products
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section class="features-section py-12 grey lighten-5">
      <v-container>
        <v-row>
          <v-col
            v-for="feature in features"
            :key="feature.title"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="feature-card text-center pa-6" elevation="0">
              <v-avatar size="80" :color="feature.color" class="mb-4">
                <v-icon size="40" color="white">{{ feature.icon }}</v-icon>
              </v-avatar>
              <h4 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h4>
              <p class="text-body-2 grey--text">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section py-16 primary">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" lg="6" class="text-center">
            <v-icon size="64" color="white" class="mb-4">mdi-email-outline</v-icon>
            <h3 class="text-h3 font-weight-bold white--text mb-4">
              Stay Updated
            </h3>
            <p class="text-h6 white--text mb-8 font-weight-light">
              Subscribe to our newsletter and get exclusive deals, new arrivals, and special offers
            </p>
            <v-card elevation="8" class="newsletter-card pa-2">
              <v-row no-gutters>
                <v-col cols="12" sm="8">
                  <v-text-field
                    v-model="email"
                    placeholder="Enter your email address"
                    hide-details
                    solo
                    flat
                    class="newsletter-input"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-btn
                    color="primary"
                    block
                    x-large
                    elevation="0"
                    @click="subscribe"
                    class="newsletter-btn"
                  >
                    Subscribe
                    <v-icon right>mdi-send</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductCard from '@/components/product/ProductCard.vue'

export default {
  name: 'Home',
  components: {
    ProductCard
  },
  data() {
    return {
      email: '',
      heroSlides: [
        {
          title: 'Welcome to ShopNova',
          subtitle: 'Discover amazing products at great prices',
          image: require('@/assets/slider/slider_1.jpg')
        },
        {
          title: 'New Arrivals',
          subtitle: 'Check out our latest collection',
          image: require('@/assets/slider/slider_2.jpg')
        },
        {
          title: 'Special Offers',
          subtitle: 'Up to 50% off on selected items',
          image: require('@/assets/slider/slider_3.jpg')
        }
      ],
      featuredProducts: [],
      stats: [
        { icon: 'mdi-package-variant', value: '1000+', title: 'Products', color: 'primary' },
        { icon: 'mdi-truck-fast', value: 'Free', title: 'Shipping', color: 'success' },
        { icon: 'mdi-shield-check', value: '100%', title: 'Secure', color: 'warning' },
        { icon: 'mdi-head-question', value: '24/7', title: 'Support', color: 'info' }
      ],
      features: [
        {
          icon: 'mdi-truck-delivery',
          title: 'Free Shipping',
          description: 'Free shipping on orders over $50',
          color: 'primary'
        },
        {
          icon: 'mdi-cash-refund',
          title: 'Money Back',
          description: '30 days money back guarantee',
          color: 'success'
        },
        {
          icon: 'mdi-lock-check',
          title: 'Secure Payment',
          description: '100% secure payment processing',
          color: 'warning'
        },
        {
          icon: 'mdi-headset',
          title: '24/7 Support',
          description: 'Dedicated customer support',
          color: 'info'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categories/categories'
    })
  },
  async created() {
    await this.fetchFeaturedProducts()
  },
  methods: {
    async fetchFeaturedProducts() {
      try {
        this.$store.dispatch('ui/setLoading', true)
        const response = await this.$http.get('/products', {
          params: { limit: 8 }
        })
        console.log('Featured products response:', response)
        // Backend wraps response in {success, message, data, timestamp} format
        this.featuredProducts = response.data?.products || []
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        this.$store.dispatch('ui/setLoading', false)
      }
    },
    filterByCategory(categoryId) {
      this.$router.push({
        name: 'Products',
        query: { categoryId }
      })
    },
    getCategoryImage(categoryName) {
      return `https://via.placeholder.com/300x200/1976D2/FFFFFF?text=${encodeURIComponent(categoryName)}`
    },
    getCategoryIcon(categoryName) {
      const iconMap = {
        'Electronics': 'mdi-cellphone-link',
        'Clothing': 'mdi-tshirt-crew-outline',
        'Books': 'mdi-book-open-variant',
        'Home & Garden': 'mdi-home-city',
        'Sports': 'mdi-basketball',
        'Beauty': 'mdi-face-woman-shimmer',
        'Toys': 'mdi-teddy-bear',
        'Automotive': 'mdi-car-sports',
        'Health': 'mdi-heart-pulse',
        'Food': 'mdi-food-variant',
        'Jewelry': 'mdi-ring',
        'Music': 'mdi-headphones',
        'Furniture': 'mdi-chair-rolling',
        'Fashion': 'mdi-sunglasses',
        'Shoes': 'mdi-shoe-sneaker',
        'Bags': 'mdi-bag-personal',
        'Watches': 'mdi-watch',
        'Kitchen': 'mdi-chef-hat',
        'Gaming': 'mdi-gamepad-variant',
        'Pets': 'mdi-paw'
      }
      return iconMap[categoryName] || 'mdi-store'
    },
    subscribe() {
      if (this.email) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Thank you for subscribing!',
          color: 'success'
        })
        this.email = ''
      }
    }
  }
}
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  width: 100%;
}

.hero-carousel >>> .v-carousel__item {
  position: relative;
}

.hero-carousel >>> .v-image {
  filter: brightness(0.7);
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-text-wrapper {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero-title {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.hero-subtitle {
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  opacity: 0.95;
}

.hero-btn {
  font-weight: 700;
  letter-spacing: 1px;
  padding: 28px 48px !important;
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

/* Stats Section */
.stats-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%);
}

.stat-card {
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

/* Section Headers */
.section-header {
  margin-bottom: 48px;
}

.section-title {
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  border-radius: 2px;
}

/* Categories Section */
.category-card {
  cursor: pointer;
  border-radius: 20px !important;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  background: linear-gradient(135deg, #929ca3 0%, #689cc7 100%);
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-card:nth-child(6n+1) {
  background: linear-gradient(135deg, #929ca3 0%, #689cc7 100%);
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.15);
}

.category-card:nth-child(6n+2) {
  background: linear-gradient(135deg, #929ca3 0%, #689cc7 100%);
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.15);
}

.category-card:nth-child(6n+3) {
  background: linear-gradient(135deg, #929ca3 0%, #689cc7 100%);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.15);
}

.category-card:nth-child(6n+4) {
  background: linear-gradient(135deg, #929ca3 0%, #689cc7 100%);
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.15);
}

.category-card:nth-child(6n+5) {
  background: linear-gradient(135deg, #929ca3 0%, #689cc7 100%);
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.15);
}

.category-card:nth-child(6n+6) {
  background: linear-gradient(135deg, #929ca3 0%, #689cc7 100%);
  box-shadow: 0 4px 15px rgba(0, 150, 136, 0.15);
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15) !important;
}

.category-card:nth-child(6n+1):hover {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  box-shadow: 0 12px 25px rgba(33, 150, 243, 0.3) !important;
}

.category-card:nth-child(6n+2):hover {
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  box-shadow: 0 12px 25px rgba(233, 30, 99, 0.3) !important;
}

.category-card:nth-child(6n+3):hover {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  box-shadow: 0 12px 25px rgba(76, 175, 80, 0.3) !important;
}

.category-card:nth-child(6n+4):hover {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  box-shadow: 0 12px 25px rgba(255, 152, 0, 0.3) !important;
}

.category-card:nth-child(6n+5):hover {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  box-shadow: 0 12px 25px rgba(156, 39, 176, 0.3) !important;
}

.category-card:nth-child(6n+6):hover {
  background: linear-gradient(135deg, #009688 0%, #00695c 100%);
  box-shadow: 0 12px 25px rgba(0, 150, 136, 0.3) !important;
}

.category-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.category-main-icon {
  transform: scale(0.9);
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

.category-card:hover .category-main-icon {
  transform: scale(1);
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6));
}

.category-title {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
  transition: all 0.3s ease;
  font-weight: 700 !important;
  text-align: center;
  line-height: 1.2 !important;
  margin: 8px 0 !important;
}

.category-card:hover .category-title {
  transform: translateY(-4px);
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.7) !important;
}

.category-arrow-icon {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  transition: all 0.4s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.category-card:hover .category-arrow-icon {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7));
}

/* Features Section */
.feature-card {
  background: white;
  border-radius: 16px !important;
  transition: all 0.3s ease;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1) !important;
}

.feature-card .v-avatar {
  transition: transform 0.3s ease;
}

.feature-card:hover .v-avatar {
  transform: rotate(360deg);
}

/* Newsletter Section */
.newsletter-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  position: relative;
  overflow: hidden;
}

.newsletter-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.newsletter-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.newsletter-card {
  border-radius: 50px !important;
  overflow: hidden;
  background: white;
}

.newsletter-input >>> .v-input__slot {
  min-height: 60px !important;
  padding: 0 24px !important;
}

.newsletter-btn {
  height: 60px !important;
  border-radius: 0 50px 50px 0 !important;
  font-weight: 700;
  letter-spacing: 1px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-text-wrapper {
    padding: 30px;
  }
  
  .hero-title {
    font-size: 2.5rem !important;
  }
  
  .hero-subtitle {
    font-size: 1.25rem !important;
  }
  
  .section-title {
    font-size: 2rem !important;
  }
}

@media (max-width: 600px) {
  .hero-text-wrapper {
    padding: 20px;
  }
  
  .hero-title {
    font-size: 1.75rem !important;
  }
  
  .hero-subtitle {
    font-size: 1rem !important;
  }
  
  .hero-btn {
    padding: 20px 32px !important;
  }
  
  .newsletter-btn {
    border-radius: 0 0 50px 50px !important;
  }
}
</style>