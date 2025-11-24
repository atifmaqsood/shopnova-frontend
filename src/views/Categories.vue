<template>
  <div class="categories-page">
    <!-- Page Header -->
    <section class="page-header py-8">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <h1 class="text-h3 font-weight-bold mb-2">All Categories</h1>
            <p class="text-body-1 grey--text">
              Browse our {{ categories.length }} product categories
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <v-breadcrumbs :items="breadcrumbs" class="pa-0 d-inline-flex">
              <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Categories Grid -->
    <v-container class="py-8">
      <v-row v-if="!loading && categories.length > 0">
        <v-col
          v-for="category in categories"
          :key="category.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="category-card-page elevation-4"
            hover
            @click="goToCategory(category.id)"
          >
            <!-- SVG Pattern Background -->
            <svg class="category-bg-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient :id="'grad-' + category.id" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :style="'stop-color:' + getCategoryGradient(category.id).start + ';stop-opacity:1'" />
                  <stop offset="100%" :style="'stop-color:' + getCategoryGradient(category.id).end + ';stop-opacity:1'" />
                </linearGradient>
                
                <pattern :id="'hexPattern-' + category.id" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20,5 L30,12.5 L30,27.5 L20,35 L10,27.5 L10,12.5 Z" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
                </pattern>
                
                <pattern :id="'dotPattern-' + category.id" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.2)"/>
                </pattern>
              </defs>
              
              <rect width="200" height="200" :fill="'url(#grad-' + category.id + ')'" />
              <circle cx="-20" cy="-20" r="60" fill="rgba(255,255,255,0.08)" />
              <circle cx="220" cy="220" r="80" fill="rgba(0,0,0,0.08)" />
              <circle cx="200" cy="20" r="50" fill="rgba(255,255,255,0.06)" />
              <circle cx="20" cy="180" r="40" fill="rgba(0,0,0,0.06)" />
              <rect width="200" height="200" :fill="'url(#hexPattern-' + category.id + ')'" />
              <path d="M0,0 L200,200 M-50,50 L150,250 M50,-50 L250,150" stroke="rgba(255,255,255,0.08)" stroke-width="30" />
              <path d="M0,140 Q50,120 100,140 T200,140 L200,200 L0,200 Z" fill="rgba(0,0,0,0.1)" />
              <path d="M0,0 L80,0 L0,80 Z" fill="rgba(255,255,255,0.12)" />
              <rect width="200" height="200" :fill="'url(#dotPattern-' + category.id + ')'" opacity="0.5" />
            </svg>
            
            <div class="category-content-page">
              <div class="category-icon-page mb-3">
                <v-icon size="56" style="color: white !important;">{{ getCategoryIcon(category.name) }}</v-icon>
              </div>
              <h3 class="category-name-page text-h6 font-weight-bold text-center mb-2" style="color: white !important;">
                {{ category.name }}
              </h3>
              <p v-if="getProductCount(category)" class="category-count text-center" style="color: rgba(255,255,255,0.9) !important;">
                {{ getProductCount(category) }} {{ getProductCount(category) === 1 ? 'Product' : 'Products' }}
              </p>
              <div class="category-arrow-page">
                <v-icon style="color: white !important;">mdi-arrow-right-circle</v-icon>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-row v-else-if="loading">
        <v-col
          v-for="n in 8"
          :key="n"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-skeleton-loader type="card" elevation="2" />
        </v-col>
      </v-row>

      <!-- No Categories -->
      <v-card v-else class="text-center pa-12 elevation-0" outlined>
        <v-icon size="80" color="grey lighten-1">mdi-tag-off</v-icon>
        <h2 class="text-h5 font-weight-bold mt-4 mb-2">No Categories Found</h2>
        <p class="text-body-1 grey--text mb-6">
          Categories will appear here once they are added.
        </p>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Categories',
  data() {
    return {
      breadcrumbs: [
        { text: 'Home', disabled: false, href: '/' },
        { text: 'Categories', disabled: true }
      ]
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categories/categories',
      loading: 'categories/loading'
    })
  },
  methods: {
    goToCategory(categoryId) {
      this.$router.push({
        name: 'Products',
        query: { categoryId }
      })
    },
    getProductCount(category) {
      // Handle different API response formats
      if (category._count && category._count.products !== undefined) {
        return category._count.products
      }
      if (category.productCount !== undefined) {
        return category.productCount
      }
      if (category.products && Array.isArray(category.products)) {
        return category.products.length
      }
      return null // Return null to hide the count if not available
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
        { start: '#2196f3', end: '#1976d2' },
        { start: '#e91e63', end: '#c2185b' },
        { start: '#4caf50', end: '#388e3c' },
        { start: '#ff9800', end: '#f57c00' },
        { start: '#9c27b0', end: '#7b1fa2' },
        { start: '#009688', end: '#00695c' },
        { start: '#f44336', end: '#d32f2f' },
        { start: '#3f51b5', end: '#303f9f' },
      ]
      return gradients[(categoryId - 1) % gradients.length]
    }
  }
}
</script>

<style scoped>
.categories-page {
  min-height: 100vh;
  background: #fafafa;
}

.page-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%);
  border-bottom: 1px solid #e0e0e0;
}

.category-card-page {
  cursor: pointer;
  border-radius: 20px !important;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
}

.category-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.category-card-page:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25) !important;
}

.category-card-page:hover .category-bg-pattern {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.category-content-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 20px;
}

.category-icon-page {
  transform: scale(0.9);
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

.category-card-page:hover .category-icon-page {
  transform: scale(1);
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6));
}

.category-name-page {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.category-card-page:hover .category-name-page {
  transform: translateY(-4px);
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.7) !important;
}

.category-count {
  font-size: 0.9rem;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

.category-arrow-page {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  transition: all 0.4s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  margin-top: 8px;
}

.category-card-page:hover .category-arrow-page {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7));
}
</style>
