<template>
  <div class="products-retail-container">
    <!-- Header Section -->
    <v-sheet class="shop-hero py-10" color="grey lighten-4">
      <v-container>
        <div class="d-flex align-center justify-space-between flex-wrap gap-4">
          <div>
            <h1 class="text-h2 font-weight-black mb-2">Our Collection</h1>
            <v-breadcrumbs :items="breadcrumbs" class="pa-0" />
          </div>
          <div class="search-premium glass-panel px-4 py-2 d-flex align-center">
            <v-icon color="primary" class="mr-3">mdi-magnify</v-icon>
            <input 
              v-model="searchQuery" 
              placeholder="Search items..." 
              class="search-field"
              @input="onSearch"
            />
            <v-btn icon v-if="searchQuery" @click="clearSearch" small>
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-sheet>

    <v-container class="py-12">
      <v-row>
        <!-- Sidebar Filters -->
        <v-col cols="12" md="3">
          <div class="filter-sidebar sticky-top">
            <h3 class="text-h6 font-weight-bold mb-6 d-flex align-center">
              <v-icon class="mr-2">mdi-filter-variant</v-icon> Refine Selection
            </h3>

            <div class="filter-group mb-8">
              <label class="filter-label">Category</label>
              <div class="category-list mt-3">
                <v-chip
                  v-for="cat in categoryOptions"
                  :key="cat.id"
                  :input-value="selectedCat === cat.id"
                  @click="toggleCat(cat.id)"
                  class="ma-1"
                  outlined
                  :color="selectedCat === cat.id ? 'primary' : ''"
                  label
                >
                  {{ cat.name }}
                </v-chip>
              </div>
            </div>

            <div class="filter-group mb-8">
              <label class="filter-label">Price Range</label>
              <v-range-slider
                v-model="priceRange"
                :max="2000"
                :min="0"
                class="mt-6"
                thumb-label
                color="primary"
                @change="onFilterChange"
              />
              <div class="d-flex justify-space-between text-caption grey--text">
                <span>$0</span>
                <span>$2000+</span>
              </div>
            </div>

            <v-btn block color="primary" rounded outlined @click="resetFilters">
              Reset Filters
            </v-btn>
          </div>
        </v-col>

        <!-- Product Grid -->
        <v-col cols="12" md="9">
          <div class="grid-header d-flex justify-space-between align-center mb-8">
            <span class="grey--text">{{ filteredProducts.length }} products found</span>
            <div style="width: 200px">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                dense
                outlined
                rounded
                hide-details
                @change="onFilterChange"
              />
            </div>
          </div>

          <v-row v-if="loading">
            <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
              <v-skeleton-loader type="card" />
            </v-col>
          </v-row>

          <v-row v-else-if="filteredProducts.length > 0">
            <v-col 
              v-for="product in filteredProducts" 
              :key="product.id" 
              cols="12" sm="6" md="4"
            >
              <ProductCard :product="product" />
            </v-col>
          </v-row>

          <div v-else class="text-center py-16">
            <v-icon size="100" color="grey lighten-2">mdi-package-variant-closed</v-icon>
            <h3 class="text-h5 mt-4">No products found</h3>
            <p class="grey--text">Try adjusting your filters or search term</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductCard from '@/components/product/ProductCard.vue'

export default {
  name: 'Products',
  components: { ProductCard },
  data() {
    return {
      searchQuery: '',
      priceRange: [0, 2000],
      selectedCat: null,
      sortBy: 'newest',
      loading: true,
      filteredProducts: [],
      sortOptions: [
        { text: 'Newest First', value: 'newest' },
        { text: 'Price: Low to High', value: 'price_asc' },
        { text: 'Price: High to Low', value: 'price_desc' },
        { text: 'Name A-Z', value: 'name_asc' }
      ],
      breadcrumbs: [
        { text: 'Home', to: '/' },
        { text: 'Shop', disabled: true }
      ]
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categories/categories'
    }),
    categoryOptions() {
      return [{ id: null, name: 'All' }, ...this.categories]
    }
  },
  async created() {
    const query = this.$route.query
    if (query.categoryId) this.selectedCat = parseInt(query.categoryId)
    if (query.search) this.searchQuery = query.search
    await this.loadProducts()
  },
  methods: {
    async loadProducts() {
      this.loading = true
      try {
        const { mockApiService } = await import('@/services/mockApiService')
        const results = await mockApiService.getProducts({
          search: this.searchQuery,
          categoryId: this.selectedCat,
          minPrice: this.priceRange[0],
          maxPrice: this.priceRange[1],
          sortBy: this.sortBy
        })
        this.filteredProducts = results
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    onSearch() {
      this.loadProducts()
    },
    clearSearch() {
      this.searchQuery = ''
      this.loadProducts()
    },
    toggleCat(id) {
      this.selectedCat = id
      this.loadProducts()
    },
    onFilterChange() {
      this.loadProducts()
    },
    resetFilters() {
      this.searchQuery = ''
      this.priceRange = [0, 2000]
      this.selectedCat = null
      this.sortBy = 'newest'
      this.loadProducts()
    }
  }
}
</script>

<style scoped>
.shop-hero {
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent);
}

.search-premium {
  min-width: 300px;
  border-radius: 12px;
}

.search-field {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-weight: 500;
}

.filter-sidebar {
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.sticky-top {
  position: sticky;
  top: 100px;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--secondary);
  letter-spacing: 1px;
}

.gap-4 {
  gap: 16px;
}
</style>