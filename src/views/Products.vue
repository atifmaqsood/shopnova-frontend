<template>
  <div class="products-page">
    <!-- Page Header -->
    <section class="page-header py-8 grey lighten-4">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <h1 class="text-h3 font-weight-bold mb-2">All Products</h1>
            <p class="text-body-1 grey--text">
              Discover our amazing collection of {{ pagination?.total || 0 }} products
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

    <v-container class="py-8">
      <v-row>
        <!-- Filters Sidebar -->
        <v-col cols="12" md="3">
          <v-card class="filters-card elevation-2" outlined>
            <v-card-title class="primary white--text">
              <v-icon left color="white">mdi-filter-variant</v-icon>
              Filters
            </v-card-title>
            
            <v-divider />
            
            <v-card-text class="pa-4">
              <!-- Category Filter -->
              <div class="filter-section mb-6">
                <h4 class="filter-label mb-3">Category</h4>
                <v-select
                  v-model="filters.categoryId"
                  :items="categoryItems"
                  label="Select Category"
                  outlined
                  dense
                  hide-details
                  clearable
                  @change="applyFilters"
                >
                  <template v-slot:prepend-inner>
                    <v-icon small>mdi-tag</v-icon>
                  </template>
                </v-select>
              </div>

              <!-- Price Range -->
              <div class="filter-section mb-6">
                <h4 class="filter-label mb-3">Price Range</h4>
                <div class="price-display mb-3">
                  <v-chip small outlined color="primary">${{ priceRange[0] }}</v-chip>
                  <span class="mx-2">-</span>
                  <v-chip small outlined color="primary">${{ priceRange[1] }}</v-chip>
                </div>
                <v-range-slider
                  v-model="priceRange"
                  :max="1000"
                  :min="0"
                  thumb-label="always"
                  color="primary"
                  track-color="grey lighten-2"
                  @end="setPriceFilter"
                  hide-details
                />
              </div>

              <!-- Clear Filters -->
              <v-btn
                block
                large
                outlined
                color="error"
                @click="clearFilters"
                class="mt-4"
              >
                <v-icon left>mdi-filter-remove</v-icon>
                Clear All Filters
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Filter Tags -->
          <v-card v-if="hasActiveFilters" class="mt-4 elevation-1" outlined>
            <v-card-text>
              <h4 class="filter-label mb-3">Active Filters</h4>
              <v-chip
                v-if="searchQuery"
                close
                small
                color="primary"
                class="ma-1"
                @click:close="searchQuery = ''; applyFilters()"
              >
                Search: {{ searchQuery }}
              </v-chip>
              <v-chip
                v-if="filters.categoryId"
                close
                small
                color="primary"
                class="ma-1"
                @click:close="filters.categoryId = null; applyFilters()"
              >
                Category
              </v-chip>
              <v-chip
                v-if="priceRange[0] > 0 || priceRange[1] < 1000"
                close
                small
                color="primary"
                class="ma-1"
                @click:close="priceRange = [0, 1000]; applyFilters()"
              >
                Price: ${{ priceRange[0] }}-${{ priceRange[1] }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Products Section -->
        <v-col cols="12" md="9">
          <!-- Toolbar -->
          <v-card class="toolbar-card mb-4 elevation-1" outlined>
            <v-card-text class="pa-4">
              <v-row align="center">
                <v-col cols="12" sm="6" md="7">
                  <div class="search-box-products">
                    <v-icon class="search-icon-products">mdi-magnify</v-icon>
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search products by name..."
                      class="search-input-products"
                      @keyup.enter="search"
                    />
                    <v-btn
                      v-if="searchQuery"
                      icon
                      small
                      @click="searchQuery = ''; search()"
                    >
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="5">
                  <v-select
                    v-model="sortBy"
                    :items="sortOptions"
                    label="Sort by"
                    outlined
                    dense
                    hide-details
                    @change="applyFilters"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon small>mdi-sort</v-icon>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Results Summary -->
          <div class="results-summary mb-4">
            <p class="text-body-2 grey--text mb-0">
              <template v-if="!loading">
                Showing <strong>{{ products?.length || 0 }}</strong> of <strong>{{ pagination?.total || 0 }}</strong> products
              </template>
              <template v-else>
                Loading products...
              </template>
            </p>
          </div>

          <!-- Products Grid -->
          <v-row v-if="!loading && products && products.length > 0">
            <v-col
              v-for="product in products"
              :key="product.id"
              cols="6"
              sm="6"
              md="4"
              lg="4"
            >
              <ProductCard :product="product" />
            </v-col>
          </v-row>

          <!-- Loading State -->
          <v-row v-else-if="loading">
            <v-col
              v-for="n in 6"
              :key="n"
              cols="6"
              sm="6"
              md="4"
            >
              <v-skeleton-loader type="card" elevation="2" />
            </v-col>
          </v-row>

          <!-- No Results -->
          <v-card v-else class="text-center pa-12 elevation-0" outlined>
            <v-icon size="80" color="grey lighten-1">mdi-package-variant-closed</v-icon>
            <h2 class="text-h5 font-weight-bold mt-4 mb-2">No Products Found</h2>
            <p class="text-body-1 grey--text mb-6">
              We couldn't find any products matching your criteria.<br>
              Try adjusting your filters or search terms.
            </p>
            <v-btn color="primary" outlined large @click="clearFilters">
              <v-icon left>mdi-refresh</v-icon>
              Clear Filters
            </v-btn>
          </v-card>

          <!-- Pagination -->
          <v-card v-if="pagination && pagination.pages > 1" class="mt-6 elevation-0" outlined>
            <v-card-text class="text-center pa-4">
              <v-pagination
                v-model="pagination.page"
                :length="pagination.pages"
                :total-visible="7"
                color="primary"
                @input="changePage"
                circle
              />
            </v-card-text>
          </v-card>
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
  components: {
    ProductCard
  },
  data() {
    return {
      searchQuery: '',
      priceRange: [0, 1000],
      sortBy: 'newest',
      sortOptions: [
        { text: 'Newest', value: 'newest' },
        { text: 'Price: Low to High', value: 'price_asc' },
        { text: 'Price: High to Low', value: 'price_desc' },
        { text: 'Name A-Z', value: 'name_asc' }
      ],
      breadcrumbs: [
        { text: 'Home', disabled: false, href: '/' },
        { text: 'Products', disabled: true }
      ]
    }
  },
  computed: {
    ...mapGetters({
      products: 'products/products',
      pagination: 'products/pagination',
      filters: 'products/filters',
      loading: 'products/loading',
      categories: 'categories/categories'
    }),
    categoryItems() {
      if (!Array.isArray(this.categories)) {
        return []
      }
      return this.categories.map(cat => ({
        text: cat.name,
        value: cat.id
      }))
    },
    hasActiveFilters() {
      return !!(
        this.searchQuery ||
        this.filters.categoryId ||
        this.priceRange[0] > 0 ||
        this.priceRange[1] < 1000
      )
    }
  },
  watch: {
    '$route.query': {
      handler() {
        this.initializeFromQuery()
        this.fetchProducts()
      },
      immediate: true
    }
  },
  methods: {
    initializeFromQuery() {
      const query = this.$route.query
      this.searchQuery = query.search || ''
      
      const filters = {
        search: query.search || '',
        categoryId: query.categoryId ? parseInt(query.categoryId) : null,
        minPrice: null,
        maxPrice: null
      }
      
      this.$store.dispatch('products/setFilters', filters)
    },
    search() {
      this.applyFilters()
    },
    applyFilters() {
      const filters = {
        search: this.searchQuery || '',
        categoryId: this.filters.categoryId || null,
        minPrice: this.priceRange[0] > 0 ? this.priceRange[0] : null,
        maxPrice: this.priceRange[1] < 1000 ? this.priceRange[1] : null
      }
      this.$store.dispatch('products/setFilters', filters)
    },
    setPriceFilter() {
      this.applyFilters()
    },
    clearFilters() {
      this.searchQuery = ''
      this.priceRange = [0, 1000]
      this.sortBy = 'newest'
      this.$store.dispatch('products/setFilters', {
        search: '',
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        sortBy: 'newest'
      })
    },
    changePage(page) {
      this.$store.dispatch('products/setPage', page)
    },
    fetchProducts() {
      this.$store.dispatch('products/fetchProducts')
    }
  }
}
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #fafafa;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%);
  border-bottom: 1px solid #e0e0e0;
}

/* Filters Card */
.filters-card {
  position: sticky;
  top: 90px;
  border-radius: 12px !important;
  overflow: hidden;
}

.filter-section {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.filter-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #424242;
}

.price-display {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Toolbar */
.toolbar-card {
  border-radius: 12px !important;
  background: white;
}

.search-box-products {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  height: 40px;
  transition: all 0.3s ease;
}

.search-box-products:hover {
  border-color: #bdbdbd;
  background: #eeeeee;
}

.search-box-products:focus-within {
  border-color: #1976d2;
  background: white;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
}

.search-icon-products {
  color: #757575;
  margin-right: 8px;
}

.search-input-products {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #212121;
  min-width: 0;
}

.search-input-products::placeholder {
  color: #9e9e9e;
}

/* Results Summary */
.results-summary {
  padding: 8px 0;
}

/* Cards Enhancement */
.filters-card,
.toolbar-card {
  transition: box-shadow 0.3s ease;
}

/* Responsive */
@media (max-width: 960px) {
  .filters-card {
    position: relative;
    top: 0;
    margin-bottom: 24px;
  }
  
  .page-header {
    padding: 24px 0 !important;
  }
}

@media (max-width: 600px) {
  .search-box-products {
    height: 36px;
  }
  
  .search-input-products {
    font-size: 13px;
  }
}
</style>