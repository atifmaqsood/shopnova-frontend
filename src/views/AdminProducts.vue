<template>
  <AdminLayout>
    <div class="products-content">
      <div class="page-header mb-6">
        <h1 class="page-title">Product Management</h1>
        <v-btn color="primary" large @click="showAddDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Add New Product
        </v-btn>
      </div>

      <!-- Products List -->
      <v-card class="products-table">
        <v-data-table
          :headers="headers"
          :items="products"
          :loading="loading"
          class="elevation-0"
        >
          <template slot="item.images" slot-scope="{ item }">
            <v-avatar size="40" class="ma-1">
              <v-img :src="getProductImage(item)" />
            </v-avatar>
          </template>
          <template slot="item.price" slot-scope="{ item }">
            ${{ item.price.toFixed(2) }}
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <v-btn icon small @click="editProduct(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="error" @click="deleteProduct(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Add/Edit Product Dialog -->
    <v-dialog v-model="showAddDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
        </v-card-title>
        <v-card-text>
          <ValidationObserver ref="observer">
            <v-form>
              <v-row>
                <v-col cols="12" md="6">
                  <ValidationProvider name="name" rules="required">
                    <template v-slot="{ errors }">
                      <v-text-field
                        v-model="productForm.name"
                        label="Product Name"
                        :error-messages="errors"
                        outlined
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
                        label="Category"
                        :error-messages="errors"
                        outlined
                      />
                    </template>
                  </ValidationProvider>
                </v-col>
              </v-row>

              <ValidationProvider name="description" rules="required">
                <template v-slot="{ errors }">
                  <v-textarea
                    v-model="productForm.description"
                    label="Description"
                    :error-messages="errors"
                    outlined
                    rows="3"
                  />
                </template>
              </ValidationProvider>

              <v-row>
                <v-col cols="12" md="6">
                  <ValidationProvider name="price" rules="required">
                    <template v-slot="{ errors }">
                      <v-text-field
                        v-model="productForm.price"
                        label="Price"
                        type="number"
                        step="0.01"
                        :error-messages="errors"
                        outlined
                        prefix="$"
                      />
                    </template>
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="6">
                  <ValidationProvider name="stock" rules="required">
                    <template v-slot="{ errors }">
                      <v-text-field
                        v-model="productForm.stock"
                        label="Stock Quantity"
                        type="number"
                        :error-messages="errors"
                        outlined
                      />
                    </template>
                  </ValidationProvider>
                </v-col>
              </v-row>

              <!-- Image Upload -->
              <div class="mb-4">
                <h4 class="mb-2">Product Images</h4>
                <v-file-input
                  v-model="selectedFiles"
                  label="Select Images"
                  multiple
                  accept="image/*"
                  outlined
                  prepend-icon="mdi-camera"
                  show-size
                  :rules="fileRules"
                />
                
                <!-- Image Preview -->
                <div v-if="selectedFiles && selectedFiles.length > 0" class="mt-4">
                  <h5 class="mb-2">Preview:</h5>
                  <v-row>
                    <v-col
                      v-for="(file, index) in selectedFiles"
                      :key="index"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <v-card>
                        <v-img
                          :src="getFilePreview(file)"
                          height="120"
                          contain
                        />
                        <v-card-actions class="pa-2">
                          <v-btn
                            icon
                            small
                            color="error"
                            @click="removeFile(index)"
                          >
                            <v-icon small>mdi-delete</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-form>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveProduct">
            {{ editingProduct ? 'Update' : 'Save' }}
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
      showAddDialog: false,
      editingProduct: null,
      saving: false,
      loading: false,
      products: [],
      selectedFiles: [],
      headers: [
        { text: 'Image', value: 'images', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Category', value: 'category.name' },
        { text: 'Price', value: 'price' },
        { text: 'Stock', value: 'stock' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      productForm: {
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: null
      },
      fileRules: [
        files => !files || files.length <= 5 || 'Maximum 5 images allowed',
        files => !files || files.every(file => file.size <= 5 * 1024 * 1024) || 'File size must be less than 5MB'
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
          params: { limit: 100 }
        })
        this.products = response.data?.products || []
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to fetch products',
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
        const formData = new FormData()
        
        // Add product data
        formData.append('name', this.productForm.name)
        formData.append('description', this.productForm.description)
        formData.append('price', this.productForm.price)
        formData.append('stock', this.productForm.stock)
        formData.append('categoryId', this.productForm.categoryId)
        
        // Add images
        if (this.selectedFiles && this.selectedFiles.length > 0) {
          this.selectedFiles.forEach(file => {
            formData.append('images', file)
          })
        }

        if (this.editingProduct) {
          await this.$http.patch(`/products/${this.editingProduct.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        } else {
          await this.$http.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }

        this.$store.dispatch('ui/showSnackbar', {
          message: `Product ${this.editingProduct ? 'updated' : 'created'} successfully!`,
          color: 'success'
        })
        
        this.closeDialog()
        await this.fetchProducts()
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to save product',
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
        categoryId: product.categoryId
      }
      this.selectedFiles = []
      this.showAddDialog = true
    },
    async deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await this.$http.delete(`/products/${id}`)
          this.$store.dispatch('ui/showSnackbar', {
            message: 'Product deleted successfully!',
            color: 'success'
          })
          await this.fetchProducts()
        } catch (error) {
          this.$store.dispatch('ui/showSnackbar', {
            message: 'Failed to delete product',
            color: 'error'
          })
        }
      }
    },
    closeDialog() {
      this.showAddDialog = false
      this.editingProduct = null
      this.selectedFiles = []
      this.productForm = {
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: null
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
      return `https://via.placeholder.com/40x40/1976D2/FFFFFF?text=${encodeURIComponent(product.name.charAt(0))}`
    },
    getFilePreview(file) {
      return URL.createObjectURL(file)
    },
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.products-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.products-table {
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>