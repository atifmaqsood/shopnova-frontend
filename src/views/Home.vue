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
              <!-- SVG Pattern Background -->
              <svg class="category-bg-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient :id="'grad-' + category.id" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" :style="'stop-color:' + getCategoryGradient(category.id).start + ';stop-opacity:1'" />
                    <stop offset="100%" :style="'stop-color:' + getCategoryGradient(category.id).end + ';stop-opacity:1'" />
                  </linearGradient>
                  
                  <!-- Hexagon Pattern -->
                  <pattern :id="'hexPattern-' + category.id" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20,5 L30,12.5 L30,27.5 L20,35 L10,27.5 L10,12.5 Z" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
                  </pattern>
                  
                  <!-- Dots Pattern -->
                  <pattern :id="'dotPattern-' + category.id" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.2)"/>
                  </pattern>
                </defs>
                
                <!-- Base Gradient Background -->
                <rect width="200" height="200" :fill="'url(#grad-' + category.id + ')'" />
                
                <!-- Decorative Shapes Layer 1 -->
                <circle cx="-20" cy="-20" r="60" fill="rgba(255,255,255,0.08)" />
                <circle cx="220" cy="220" r="80" fill="rgba(0,0,0,0.08)" />
                <circle cx="200" cy="20" r="50" fill="rgba(255,255,255,0.06)" />
                <circle cx="20" cy="180" r="40" fill="rgba(0,0,0,0.06)" />
                
                <!-- Hexagon Pattern Overlay -->
                <rect width="200" height="200" :fill="'url(#hexPattern-' + category.id + ')'" />
                
                <!-- Diagonal Stripes -->
                <path d="M0,0 L200,200 M-50,50 L150,250 M50,-50 L250,150" stroke="rgba(255,255,255,0.08)" stroke-width="30" />
                
                <!-- Bottom Wave -->
                <path d="M0,140 Q50,120 100,140 T200,140 L200,200 L0,200 Z" fill="rgba(0,0,0,0.1)" />
                
                <!-- Top Corner Accent -->
                <path d="M0,0 L80,0 L0,80 Z" fill="rgba(255,255,255,0.12)" />
                
                <!-- Dots Pattern Overlay -->
                <rect width="200" height="200" :fill="'url(#dotPattern-' + category.id + ')'" opacity="0.5" />
              </svg>
              
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
            cols="12"
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

    <!-- Trending Products Section -->
    <section class="trending-section py-12 grey lighten-5">
      <v-container>
        <div class="section-header text-center mb-10">
          <v-chip color="primary" label class="mb-4">
            <v-icon left small>mdi-fire</v-icon>
            Trending Now
          </v-chip>
          <h2 class="section-title text-h3 font-weight-bold primary--text mb-3">
            Hot Deals This Week
          </h2>
          <p class="section-subtitle text-h6 grey--text text--darken-1">
            Don't miss out on these amazing offers
          </p>
        </div>
        <v-row v-if="featuredProducts.length > 0">
          <v-col
            v-for="product in featuredProducts.slice(0, 4)"
            :key="'trending-' + product.id"
            cols="12"
            sm="6"
            md="3"
          >
            <ProductCard :product="product" />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section with Stats -->
    <section class="features-section py-16">
      <v-container>
        <div class="section-header text-center mb-12">
          <h2 class="section-title text-h3 font-weight-bold primary--text mb-3">
            Why Shop With Us?
          </h2>
          <p class="section-subtitle text-h6 grey--text text--darken-1">
            Experience the best in online shopping
          </p>
        </div>
        
        <v-row>
          <v-col
            v-for="feature in features"
            :key="feature.title"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="feature-card text-center pa-6 h-100" elevation="0" outlined>
              <v-avatar size="80" :color="feature.color" class="mb-4">
                <v-icon size="40" color="white">{{ feature.icon }}</v-icon>
              </v-avatar>
              <h4 class="text-h6 font-weight-bold mb-2">{{ feature.title }}</h4>
              <p class="text-body-2 grey--text mb-0">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Customer Testimonials Slider -->
    <section class="testimonials-section py-16 grey lighten-5">
      <v-container>
        <div class="section-header text-center mb-12">
          <v-chip color="success" label class="mb-4">
            <v-icon left small>mdi-star</v-icon>
            Customer Reviews
          </v-chip>
          <h2 class="section-title text-h3 font-weight-bold primary--text mb-3">
            What Our Customers Say
          </h2>
          <p class="section-subtitle text-h6 grey--text text--darken-1">
            Join thousands of satisfied customers
          </p>
        </div>
        
        <v-carousel
          cycle
          height="auto"
          hide-delimiters
          show-arrows-on-hover
          interval="5000"
          class="testimonial-carousel"
        >
          <v-carousel-item
            v-for="(testimonial, index) in testimonials"
            :key="index"
          >
            <v-row justify="center" class="fill-height ma-0">
              <v-col cols="12" md="8" lg="6">
                <v-card class="testimonial-card pa-8" elevation="8">
                  <div class="text-center mb-6">
                    <v-avatar size="80" :color="testimonial.color" class="mb-4">
                      <span class="white--text text-h4 font-weight-bold">{{ testimonial.initial }}</span>
                    </v-avatar>
                    <h4 class="text-h5 font-weight-bold mb-2">{{ testimonial.name }}</h4>
                    <div class="rating mb-2 justify-center">
                      <v-icon v-for="i in 5" :key="i" color="amber" size="24">mdi-star</v-icon>
                    </div>
                    <p class="text-caption grey--text">{{ testimonial.date }}</p>
                  </div>
                  <p class="text-h6 grey--text text--darken-2 testimonial-text text-center">
                    "{{ testimonial.review }}"
                  </p>
                </v-card>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
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
      ],
      testimonials: [
        {
          name: 'Sarah Johnson',
          initial: 'SJ',
          color: 'purple',
          date: '2 weeks ago',
          review: 'Amazing shopping experience! The products are high quality and delivery was super fast. Will definitely shop here again.'
        },
        {
          name: 'Michael Chen',
          initial: 'MC',
          color: 'blue',
          date: '1 month ago',
          review: 'Best online store I\'ve used. Great customer service, easy returns, and the prices are unbeatable. Highly recommended!'
        },
        {
          name: 'Emily Rodriguez',
          initial: 'ER',
          color: 'pink',
          date: '3 weeks ago',
          review: 'Love the variety of products and the website is so easy to navigate. My order arrived perfectly packaged and on time.'
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
    getCategoryGradient(categoryId) {
      const gradients = [
        { start: '#2196f3', end: '#1976d2' }, // Blue
        { start: '#e91e63', end: '#c2185b' }, // Pink
        { start: '#4caf50', end: '#388e3c' }, // Green
        { start: '#ff9800', end: '#f57c00' }, // Orange
        { start: '#9c27b0', end: '#7b1fa2' }, // Purple
        { start: '#009688', end: '#00695c' }, // Teal
        { start: '#f44336', end: '#d32f2f' }, // Red
        { start: '#3f51b5', end: '#303f9f' }, // Indigo
      ]
      return gradients[(categoryId - 1) % gradients.length]
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.category-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25) !important;
}

.category-card:hover .category-bg-pattern {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.category-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
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

/* Trending Section */
.trending-section {
  position: relative;
}

/* Features Section */
.features-section {
  background: white;
}

.feature-card {
  background: white;
  border-radius: 16px !important;
  transition: all 0.3s ease;
  height: 100%;
  border: 2px solid #e0e0e0;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1) !important;
  border-color: #0ea5e9;
}

.feature-card .v-avatar {
  transition: transform 0.3s ease;
}

.feature-card:hover .v-avatar {
  transform: rotate(360deg);
}

/* Testimonials Section */
.testimonials-section {
  position: relative;
}

.testimonial-carousel {
  border-radius: 16px;
  overflow: visible !important;
}

.testimonial-carousel >>> .v-window__container {
  padding: 20px 0;
}

.testimonial-card {
  border-radius: 20px !important;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  transition: all 0.3s ease;
}

.testimonial-text {
  font-style: italic;
  line-height: 1.8;
  font-weight: 400;
  position: relative;
}

.testimonial-text::before {
  content: '"';
  font-size: 4rem;
  position: absolute;
  top: -20px;
  left: -10px;
  color: rgba(14, 165, 233, 0.2);
  font-family: Georgia, serif;
}

.rating {
  display: flex;
  gap: 4px;
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