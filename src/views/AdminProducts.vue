<template>
  <AdminLayout>
    <div class="admin-products-view">
      <!-- Premium Page Header -->
      <div class="page-header mb-10">
        <v-row align="end" no-gutters>
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <v-btn icon color="primary" @click="$router.go(-1)" class="mr-2">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <span class="text-overline font-weight-black primary--text letter-spacing-2">CATALOG MANAGER</span>
            </div>
            <h1 class="text-h3 font-weight-black mb-2">Global Inventory</h1>
            <p class="grey--text text-subtitle-1 mb-0">Manage your product listings, stock levels, and multi-channel pricing.</p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right mt-6 mt-md-0">
            <div class="d-flex align-center justify-md-end gap-3">
              <v-btn outlined color="primary" rounded class="px-6 font-weight-bold" @click="fetchProducts">
                <v-icon left>mdi-refresh</v-icon> Sync Data
              </v-btn>
              <v-btn color="primary" x-large rounded elevation="8" class="px-8 font-weight-black" @click="showAddDialog = true">
                <v-icon left size="24">mdi-plus</v-icon> Create Product
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Filters & Search Toolbar -->
      <v-card class="filter-card rounded-xl border-light mb-8 pa-4 soft-shadow">
        <v-row align="center" dense>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="search"
              placeholder="Search products by SKU, name or ID..."
              prepend-inner-icon="mdi-magnify"
              outlined
              dense
              hide-details
              class="rounded-lg search-field-premium"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="categoryFilter"
              :items="categoryItems"
              placeholder="All Collections"
              outlined
              dense
              hide-details
              clearable
              prepend-inner-icon="mdi-filter-variant"
              class="rounded-lg"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="stockFilter"
              :items="stockOptions"
              placeholder="Stock Status"
              outlined
              dense
              hide-details
              prepend-inner-icon="mdi-warehouse"
              class="rounded-lg"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn block color="primary" text class="font-weight-bold">
              Advanced Filters
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- Products Data Table -->
      <v-card class="table-card rounded-xl border-light soft-shadow overflow-hidden">
        <v-data-table
          :headers="headers"
          :items="filteredProducts"
          :loading="loading"
          :search="search"
          :items-per-page="10"
          class="bg-white premium-table"
        >
          <!-- Custom Product Column -->
          <template slot="item.name" slot-scope="{ item }">
            <div class="d-flex align-center py-4">
              <v-avatar size="64" rounded="lg" class="mr-4 border-light grey lighten-4">
                <v-img :src="getProductImage(item)" cover />
              </v-avatar>
              <div class="overflow-hidden">
                <div class="text-subtitle-1 font-weight-black text-truncate">{{ item.name }}</div>
                <div class="text-caption grey--text d-flex align-center">
                  <span class="mr-2">SKU: {{ item.id.toString().padStart(6, '0') }}</span>
                  <v-divider vertical class="mx-2" style="height: 12px" />
                  <span>{{ item.category?.name || 'Uncategorized' }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Status Column -->
          <template slot="item.stock" slot-scope="{ item }">
            <div class="d-flex flex-column">
              <div class="d-flex align-center mb-1">
                <v-icon small :color="getStockColor(item.stock)" class="mr-2">mdi-circle-medium</v-icon>
                <span class="font-weight-black">{{ item.stock }} in stock</span>
              </div>
              <v-progress-linear
                :value="Math.min((item.stock / 100) * 100, 100)"
                :color="getStockColor(item.stock)"
                height="4"
                rounded
                class="stock-bar"
              />
            </div>
          </template>

          <!-- Price Column -->
          <template slot="item.price" slot-scope="{ item }">
            <div class="text-h6 font-weight-black primary--text">${{ item.price?.toFixed(2) }}</div>
          </template>

          <!-- Actions Column -->
          <template slot="item.actions" slot-scope="{ item }">
            <div class="d-flex">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon color="primary" v-bind="attrs" v-on="on" @click="editProduct(item)" class="mx-1 bg-primary-light">
                    <v-icon small>mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
                <span>Edit Metadata</span>
              </v-tooltip>
              
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon color="error" v-bind="attrs" v-on="on" @click="deleteProduct(item.id)" class="mx-1 bg-error-light">
                    <v-icon small>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Remove Item</span>
              </v-tooltip>
            </div>
          </template>

          <!-- Footer customization -->
          <template slot="footer.page-text" slot-scope="{ pageStart, pageStop, itemsLength }">
            Showing {{ pageStart }} - {{ pageStop }} of {{ itemsLength }} products
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Product Editor Dialog -->
    <v-dialog v-model="showAddDialog" max-width="1000px" persistent scrollable>
      <v-card class="editor-dialog rounded-xl">
        <v-toolbar flat class="px-4 py-2 border-bottom">
          <v-avatar color="primary lighten-5" size="48" rounded="lg" class="mr-4">
            <v-icon color="primary">{{ editingProduct ? 'mdi-package-variant-closed' : 'mdi-plus-box' }}</v-icon>
          </v-avatar>
          <div>
            <v-toolbar-title class="text-h5 font-weight-black">{{ editingProduct ? 'Edit Inventory Item' : 'Create New Collection Item' }}</v-toolbar-title>
            <div class="text-caption grey--text font-weight-bold">Configure product specifications and visibility</div>
          </div>
          <v-spacer />
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-8">
          <ValidationObserver ref="observer">
            <v-form>
              <v-row>
                <!-- Image Section -->
                <v-col cols="12" md="4">
                  <div class="section-label mb-4">Product Visuals</div>
                  <div class="image-uploader rounded-xl border-dashed d-flex flex-column align-center justify-center pa-6 mb-6">
                    <div v-if="selectedFiles.length === 0 && (!editingProduct || !editingProduct.images || editingProduct.images.length === 0)" class="text-center">
                      <v-icon size="48" color="primary lighten-3" class="mb-4">mdi-cloud-upload-outline</v-icon>
                      <div class="text-subtitle-2 font-weight-bold mb-1">Click or drag images</div>
                      <div class="text-caption grey--text">Supported: JPG, PNG, WEBP</div>
                    </div>
                    
                    <v-row v-else dense class="w-100">
                      <v-col v-for="(img, i) in displayImages" :key="i" cols="6" class="position-relative">
                        <v-img :src="img" aspect-ratio="1" class="rounded-lg border-light" cover />
                        <v-btn icon x-small color="error" class="remove-btn" @click="removeImage(i)">
                          <v-icon x-small>mdi-close</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <input type="file" ref="fileInput" multiple hidden @change="handleFileUpload" accept="image/*" />
                    <v-btn color="primary" rounded outlined class="mt-6 font-weight-black" @click="$refs.fileInput.click()">
                      {{ displayImages.length > 0 ? 'Add More' : 'Select Files' }}
                    </v-btn>
                  </div>
                  
                  <v-alert border="left" colored-border color="info" elevation="2" class="text-caption rounded-lg">
                    High-quality images increase store conversion rate by up to 35%.
                  </v-alert>
                </v-col>

                <!-- Details Section -->
                <v-col cols="12" md="8" class="pl-md-8">
                  <div class="section-label mb-4">Core Specifications</div>
                  
                  <v-row>
                    <v-col cols="12">
                      <ValidationProvider name="name" rules="required">
                        <template v-slot="{ errors }">
                          <v-text-field
                            v-model="productForm.name"
                            label="Product Title"
                            placeholder="e.g., Premium Leather Weekend Bag"
                            outlined
                            :error-messages="errors"
                            class="rounded-lg"
                          />
                        </template>
                      </ValidationProvider>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <ValidationProvider name="categoryId" rules="required">
                        <template v-slot="{ errors }">
                          <v-select
                            v-model="productForm.categoryId"
                            :items="categoryItems"
                            label="Primary Category"
                            outlined
                            :error-messages="errors"
                            class="rounded-lg"
                          />
                        </template>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12" md="3">
                      <ValidationProvider name="price" rules="required">
                        <template v-slot="{ errors }">
                          <v-text-field
                            v-model="productForm.price"
                            label="Retail Price"
                            prefix="$"
                            type="number"
                            outlined
                            :error-messages="errors"
                            class="rounded-lg"
                          />
                        </template>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12" md="3">
                      <ValidationProvider name="stock" rules="required">
                        <template v-slot="{ errors }">
                          <v-text-field
                            v-model="productForm.stock"
                            label="Inventory"
                            type="number"
                            outlined
                            :error-messages="errors"
                            class="rounded-lg"
                          />
                        </template>
                      </ValidationProvider>
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="productForm.description"
                        label="Product Narration"
                        placeholder="Detail the features, materials, and value proposition..."
                        outlined
                        rows="4"
                        class="rounded-lg"
                      />
                    </v-col>
                  </v-row>

                  <div class="section-label mb-4 mt-4">Advanced Config</div>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-switch v-model="productForm.active" color="primary" label="Active & Visible in Store" inset />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-switch v-model="productForm.featured" color="amber darken-2" label="Featured in Collections" inset />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </ValidationObserver>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-8">
          <v-btn text large rounded class="px-8 font-weight-bold grey--text text--darken-2" @click="closeDialog">Discard</v-btn>
          <v-spacer />
          <v-btn x-large color="primary" rounded elevation="12" class="px-12 font-weight-black" :loading="saving" @click="saveProduct">
            <v-icon left>mdi-check-circle-outline</v-icon> {{ editingProduct ? 'Synchronize Updates' : 'Publish Product' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminLayout from '@/components/AdminLayout.vue'

export default {
  name: 'AdminProducts',
  components: {
    AdminLayout
  },
  data() {
    return {
      search: '',
      categoryFilter: null,
      stockFilter: 'all',
      showAddDialog: false,
      editingProduct: null,
      saving: false,
      loading: false,
      products: [],
      selectedFiles: [],
      productForm: {
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: null,
        active: true,
        featured: false
      },
      stockOptions: [
        { text: 'All Inventory', value: 'all' },
        { text: 'Low Stock (< 10)', value: 'low' },
        { text: 'Out of Stock', value: 'out' }
      ],
      headers: [
        { text: 'Product & SKU', value: 'name', align: 'start', sortable: true },
        { text: 'Inventory Level', value: 'stock', sortable: true },
        { text: 'Unit Price', value: 'price', sortable: true },
        { text: 'Control Actions', value: 'actions', sortable: false, align: 'end' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categories/categories'
    }),
    categoryItems() {
      return this.categories.map(cat => ({
        text: cat.name,
        value: cat.id
      }))
    },
    filteredProducts() {
      let filtered = this.products;
      if (this.categoryFilter) {
        filtered = filtered.filter(p => p.categoryId === this.categoryFilter);
      }
      if (this.stockFilter === 'low') {
        filtered = filtered.filter(p => p.stock > 0 && p.stock < 10);
      } else if (this.stockFilter === 'out') {
        filtered = filtered.filter(p => p.stock === 0);
      }
      return filtered;
    },
    displayImages() {
      const images = [];
      if (this.editingProduct && this.editingProduct.images) {
        images.push(...this.editingProduct.images.map(img => this.getProductImage({ images: [img] })));
      }
      if (this.selectedFiles.length > 0) {
        images.push(...this.selectedFiles.map(file => URL.createObjectURL(file)));
      }
      return images;
    }
  },
  async created() {
    await this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      this.loading = true
      try {
        const response = await this.$http.get('/products', {
          params: { limit: 100, includeNoImage: true }
        })
        this.products = response.data?.products || []
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Cloud sync failed. Checking local buffer...',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async saveProduct() {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) return

      this.saving = true
      try {
        const productData = {
          ...this.productForm,
          price: parseFloat(this.productForm.price),
          stock: parseInt(this.productForm.stock),
          categoryId: parseInt(this.productForm.categoryId),
          images: this.editingProduct ? [...this.editingProduct.images] : []
        }
        
        if (this.selectedFiles.length > 0) {
          const base64Promises = this.selectedFiles.map(file => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
            });
          });
          const base64Images = await Promise.all(base64Promises);
          productData.images = [...productData.images, ...base64Images];
        }

        if (this.editingProduct) {
          await this.$http.put(`/products/${this.editingProduct.id}`, productData)
        } else {
          await this.$http.post('/products', productData)
        }

        this.$store.dispatch('ui/showSnackbar', {
          message: `Product record successfully ${this.editingProduct ? 'updated' : 'published'}!`,
          color: 'success'
        })
        
        this.closeDialog()
        await this.fetchProducts()
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Transaction failed. Please verify product schema.',
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },
    editProduct(product) {
      this.editingProduct = product
      this.productForm = {
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        categoryId: product.categoryId,
        active: product.active ?? true,
        featured: product.featured ?? false
      }
      this.selectedFiles = []
      this.showAddDialog = true
    },
    async deleteProduct(id) {
      if (confirm('Are you certain? This action will permanently remove the item from all catalog indices.')) {
        try {
          await this.$http.delete(`/products/${id}`)
          this.$store.dispatch('ui/showSnackbar', {
            message: 'Item removed from database.',
            color: 'success'
          })
          await this.fetchProducts()
        } catch (error) {
          this.$store.dispatch('ui/showSnackbar', { message: 'Deletion failed.', color: 'error' })
        }
      }
    },
    closeDialog() {
      this.showAddDialog = false
      this.editingProduct = null
      this.selectedFiles = []
      this.productForm = { name: '', description: '', price: '', stock: '', categoryId: null, active: true, featured: false }
    },
    handleFileUpload(e) {
      this.selectedFiles = [...this.selectedFiles, ...Array.from(e.target.files)];
    },
    removeImage(index) {
      if (this.editingProduct && this.editingProduct.images && index < this.editingProduct.images.length) {
        this.editingProduct.images.splice(index, 1);
      } else {
        const fileIndex = index - (this.editingProduct?.images?.length || 0);
        this.selectedFiles.splice(fileIndex, 1);
      }
    },
    getProductImage(product) {
      if (product.images && product.images.length > 0) {
        const imageUrl = product.images[0]
        if (imageUrl.startsWith('/uploads/')) {
          return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${imageUrl}`
        }
        return imageUrl
      }
      return `https://via.placeholder.com/150/f1f5f9/64748b?text=NO+IMAGE`
    },
    getStockColor(stock) {
      if (stock === 0) return 'error'
      if (stock < 10) return 'warning'
      return 'success'
    }
  }
}
</script>

<style scoped>
.admin-products-view {
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-title {
  letter-spacing: -2px;
}

.gap-3 { gap: 12px; }

.section-label {
  font-size: 0.75rem;
  font-weight: 900;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.border-light { border: 1px solid rgba(0,0,0,0.05) !important; }
.soft-shadow { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -1px rgba(0,0,0,0.02) !important; }

.premium-table >>> th {
  background-color: #f8fafc !important;
  color: #64748b !important;
  text-transform: uppercase !important;
  font-size: 0.7rem !important;
  font-weight: 800 !important;
  letter-spacing: 1px;
  height: 56px !important;
}

.premium-table >>> td {
  height: 80px !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

.premium-table >>> tr:hover {
  background-color: rgba(14, 165, 233, 0.01) !important;
}

.bg-primary-light { background-color: rgba(14, 165, 233, 0.08) !important; }
.bg-error-light { background-color: rgba(239, 68, 68, 0.08) !important; }

/* Image Uploader Styles */
.image-uploader {
  min-height: 300px;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

.border-dashed { border: 2px dashed #e2e8f0; }

.image-uploader:hover {
  border-color: #0ea5e9;
  background-color: rgba(14, 165, 233, 0.02);
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.6) !important;
  backdrop-filter: blur(4px);
  z-index: 2;
}

.stock-bar {
  width: 100px;
  opacity: 0.6;
}

.editor-dialog {
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
