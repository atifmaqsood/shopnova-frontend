<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="premium-hero">
      <div class="hero-bg-accent"></div>
      <v-container>
        <v-row align="center" class="min-vh-80">
          <v-col cols="12" md="6" class="hero-content-wrapper">
            <div class="badge-modern mb-6">
              <v-icon x-small color="primary" class="mr-2">mdi-sparkles</v-icon>
              <span>Next-Gen eCommerce Platform</span>
            </div>
            <h1 class="hero-title mb-6">
              Shopping <span class="gradient-text">Redefined</span> <br/>
              for the Modern Era.
            </h1>
            <p class="hero-subtitle mb-8">
              Experience the future of SaaS eCommerce. Premium brands, AI-driven recommendations, and lightning-fast global delivery.
            </p>
            <div class="hero-actions">
              <v-btn x-large color="primary" rounded class="hero-btn-primary px-10 elevation-8" @click="$router.push('/products')">
                Explore Store
                <v-icon right>mdi-arrow-right-circle</v-icon>
              </v-btn>
              <v-btn x-large text color="primary" class="hero-btn-text ml-4" @click="$router.push('/categories')">
                View Categories
              </v-btn>
            </div>
            
            <div class="hero-stats mt-12 d-none d-sm-flex">
              <div class="stat-item mr-10">
                <span class="stat-value">50k+</span>
                <span class="stat-label">Active Users</span>
              </div>
              <div class="stat-item mr-10">
                <span class="stat-value">120+</span>
                <span class="stat-label">Premium Brands</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">4.9/5</span>
                <span class="stat-label">User Rating</span>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" md="6" class="hero-visual-wrapper d-none d-md-block">
            <div class="visual-stack">
              <div class="blob-gradient"></div>
              <v-img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80"
                class="hero-main-img elevate-premium"
                height="500"
              />
              <div class="floating-notif animate-float">
                <v-avatar color="white" size="48" class="mr-3">
                  <v-icon color="success">mdi-check-circle</v-icon>
                </v-avatar>
                <div>
                  <div class="text-caption font-weight-bold">Order Received</div>
                  <div class="text-h6 font-weight-black">$1,240.00</div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Categories Section -->
    <section class="py-16 grey lighten-4">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold mb-4">Shop by Category</h2>
          <p class="text-h6 grey--text">Curated collections for every lifestyle</p>
        </div>
        <v-row>
          <v-col
            v-for="category in categories"
            :key="category.id"
            cols="6" sm="4" md="2.4"
          >
            <v-card
              class="category-card glass-card text-center pa-6"
              flat
              @click="filterByCategory(category.id)"
            >
              <v-avatar color="primary lighten-5" size="64" class="mb-4">
                <v-icon color="primary" size="32">{{ category.icon || 'mdi-tag' }}</v-icon>
              </v-avatar>
              <h3 class="text-subtitle-1 font-weight-bold">{{ category.name }}</h3>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Featured Products -->
    <section class="py-16">
      <v-container>
        <div class="d-flex align-center justify-space-between mb-12">
          <div>
            <h2 class="text-h3 font-weight-bold mb-2">Featured Products</h2>
            <p class="text-h6 grey--text">Our most popular items this week</p>
          </div>
          <v-btn text color="primary" @click="$router.push('/products')">
            View All <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
        <v-row v-if="loading">
          <v-col v-for="i in 4" :key="i" cols="12" sm="6" md="3">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col
            v-for="product in featuredProducts"
            :key="product.id"
            cols="12" sm="6" md="3"
          >
            <ProductCard :product="product" />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Trending Section -->
    <section class="py-16 primary white--text">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-chip color="rgba(255,255,255,0.2)" text-color="white" label class="mb-4">
              NEW ARRIVAL
            </v-chip>
            <h2 class="text-h2 font-weight-black mb-6">Trending Technology</h2>
            <p class="text-h6 mb-8 opacity-80">
              Discover the latest in electronics and smart gadgets. Limited stock available at special launch prices.
            </p>
            <v-btn x-large color="white" light rounded class="primary--text px-8" @click="$router.push('/products?categoryId=1')">
              Shop Tech Now
            </v-btn>
          </v-col>
          <v-col cols="12" md="6" class="text-center">
            <v-img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
              max-height="400"
              contain
              class="floating-img"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features -->
    <section class="py-16">
      <v-container>
        <v-row>
          <v-col v-for="f in features" :key="f.title" cols="12" sm="6" md="3">
            <div class="d-flex align-center pa-4">
              <v-icon color="primary" size="48" class="mr-4">{{ f.icon }}</v-icon>
              <div>
                <div class="font-weight-bold">{{ f.title }}</div>
                <div class="text-caption grey--text">{{ f.description }}</div>
              </div>
            </div>
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
  components: { ProductCard },
  data() {
    return {
      featuredProducts: [],
      loading: true,
      features: [
        { icon: 'mdi-truck-fast', title: 'Lightning Delivery', description: 'Same day shipping available' },
        { icon: 'mdi-shield-lock', title: 'Secure Payment', description: 'SSL encrypted transactions' },
        { icon: 'mdi-cached', title: 'Easy Returns', description: '30-day hassle-free returns' },
        { icon: 'mdi-headset', title: '24/7 Support', description: 'Expert help at any time' }
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
      this.loading = true
      try {
        const response = await this.$store.dispatch('products/fetchAllProducts')
        // We can just get them from store after dispatching
        this.featuredProducts = this.$store.getters['products/products'].slice(0, 8)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    filterByCategory(categoryId) {
      this.$router.push({ name: 'Products', query: { categoryId } })
    }
  }
}
</script>

<style scoped>
/* Premium Hero Section */
.premium-hero {
  position: relative;
  overflow: hidden;
  padding: 80px 0;
  background: white;
}

.hero-bg-accent {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 60%;
  height: 120%;
  background: radial-gradient(circle at 70% 30%, rgba(14, 165, 233, 0.08), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.min-vh-80 {
  min-height: 80vh;
}

.badge-modern {
  display: inline-flex;
  align-items: center;
  background: rgba(14, 165, 233, 0.08);
  padding: 8px 16px;
  border-radius: 100px;
  color: #0ea5e9;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  color: #1e293b;
  letter-spacing: -2px;
}

.gradient-text {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #64748b;
  max-width: 540px;
}

.hero-btn-primary {
  text-transform: none !important;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
}

.hero-btn-text {
  text-transform: none !important;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
}

.hero-stats {
  border-top: 1px solid #f1f5f9;
  padding-top: 32px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
}

.stat-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
}

/* Visual Stack */
.visual-stack {
  position: relative;
  display: flex;
  justify-content: center;
}

.blob-gradient {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
  filter: blur(40px);
  z-index: 0;
}

.hero-main-img {
  border-radius: 32px !important;
  z-index: 1;
  border: 8px solid white;
}

.elevate-premium {
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.15) !important;
}

.floating-notif {
  position: absolute;
  bottom: 40px;
  right: -20px;
  background: white;
  padding: 16px 24px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  z-index: 2;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Category Cards */
.category-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 24px !important;
}

.category-card:hover {
  transform: scale(1.05) translateY(-10px);
  background: #0ea5e9 !important;
  color: white !important;
  box-shadow: 0 20px 40px rgba(14,165,233,0.3) !important;
}

.category-card:hover .v-icon {
  color: white !important;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }
}
</style>