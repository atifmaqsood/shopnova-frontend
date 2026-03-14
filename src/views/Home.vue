<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-container>
        <v-row align="center" class="py-16">
          <v-col cols="12" md="6" data-aos="fade-right">
            <h1 class="text-h2 font-weight-black mb-6 primary--text line-height-tight">
              Modern Shopping <br/>
              <span class="secondary--text">Reimagined.</span>
            </h1>
            <p class="text-h6 grey--text text--darken-1 mb-8">
              Experience the next generation of eCommerce with ShopNova. Premium products, seamless checkout, and lightning-fast delivery.
            </p>
            <div class="d-flex gap-4">
              <v-btn x-large color="primary" rounded elevation="4" @click="$router.push('/products')" class="px-8">
                Explore Shop
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
              <v-btn x-large outlined color="primary" rounded class="px-8" @click="$router.push('/categories')">
                Categories
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="d-none d-md-block" data-aos="fade-left">
            <div class="hero-image-container">
              <v-img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
                class="hero-image rounded-xl elevation-10"
                height="450"
              />
              <div class="floating-card glass-card pa-4">
                <div class="d-flex align-center">
                  <v-avatar color="success" size="48" class="mr-4">
                    <v-icon color="white">mdi-check-decagram</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-2 font-weight-bold">Verified Seller</div>
                    <div class="text-caption grey--text">SaaS Trusted Store</div>
                  </div>
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
.hero-section {
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent);
}

.hero-image-container {
  position: relative;
}

.floating-card {
  position: absolute;
  bottom: -20px;
  left: -20px;
  min-width: 200px;
  z-index: 2;
}

.category-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  background: var(--primary) !important;
  color: white !important;
}

.category-card:hover .v-icon {
  color: white !important;
}

.line-height-tight {
  line-height: 1.1;
}

.gap-4 {
  gap: 16px;
}

.opacity-80 {
  opacity: 0.8;
}

.floating-img {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
</style>