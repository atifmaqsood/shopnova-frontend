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
    <v-dialog v-model="showAddDialog" max-width="900px" persistent scrollable>
      <v-card class="premium-dialog">
        <div class="dialog-header">
          <div class="header-content">
            <v-icon large color="white" class="header-icon">mdi-package-variant</v-icon>
            <div>
              <h2 class="dialog-title">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
              <p class="dialog-subtitle">{{ editingProduct ? 'Update product information' : 'Create a new product listing' }}</p>
            </div>
          </div>
        </div>

        <v-card-text class="dialog-content">
          <ValidationObserver ref="observer">
            <v-form>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">Product Name *</label>
                    <ValidationProvider name="name" rules="required">
                      <template v-slot="{ errors }">
                        <v-text-field
                          v-model="productForm.name"
                          placeholder="Enter product name"
                          :error-messages="errors"
                          outlined
                          dense
                          class="modern-input"
                        />
                      </template>
                    </ValidationProvider>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">Category *</label>
                    <ValidationProvider name="categoryId" rules="required">
                      <template v-slot="{ errors }">
                        <v-select
                          v-model="productForm.categoryId"
                          :items="categoryItems"
                          placeholder="Select category"
                          :error-messages="errors"
                          outlined
                          dense
                          class="modern-input"
                        />
                      </template>
                    </ValidationProvider>
                  </div>
                </v-col>
              </v-row>

              <div class="form-group">
                <label class="form-label">Description *</label>
                <ValidationProvider name="description" rules="required">
                  <template v-slot="{ errors }">
                    <v-textarea
                      v-model="productForm.description"
                      placeholder="Enter product description"
                      :error-messages="errors"
                      outlined
                      rows="3"
                      dense
                      class="modern-input"
                    />
                  </template>
                </ValidationProvider>
              </div>

              <v-row>
                <v-col cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">Price ($) *</label>
                    <ValidationProvider name="price" rules="required">
                      <template v-slot="{ errors }">
                        <v-text-field
                          v-model="productForm.price"
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          :error-messages="errors"
                          outlined
                          dense
                          prefix="$"
                          class="modern-input"
                        />
                      </template>
                    </ValidationProvider>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="form-group">
                    <label class="form-label">Stock Quantity *</label>
                    <ValidationProvider name="stock" rules="required">
                      <template v-slot="{ errors }">
                        <v-text-field
                          v-model="productForm.stock"
                          placeholder="0"
                          type="number"
                          :error-messages="errors"
                          outlined
                          dense
                          class="modern-input"
                        />
                      </template>
                    </ValidationProvider>
                  </div>
                </v-col>
              </v-row>

              <!-- Image Upload -->
              <div class="form-group">
                <label class="form-label">Product Images</label>
                <div class="upload-area">
                  <v-file-input
                    v-model="selectedFiles"
                    multiple
                    accept="image/*"
                    outlined
                    dense
                    prepend-icon=""
                    prepend-inner-icon="mdi-camera-multiple"
                    placeholder="Click to select images (max 5)"
                    show-size
                    :rules="fileRules"
                    class="modern-input upload-input"
                  >
                    <template v-slot:selection="{ index }">
                      <v-chip v-if="index === 0" small color="primary" label>
                        <v-icon left small>mdi-image-multiple</v-icon>
                        {{ selectedFiles.length }} file(s)
                      </v-chip>
                    </template>
                  </v-file-input>
                  
                  <!-- Image Preview Gallery -->
                  <div v-if="(selectedFiles && selectedFiles.length > 0) || (editingProduct && editingProduct.images && editingProduct.images.length > 0)" class="image-preview-container">
                    <div class="preview-label">{{ selectedFiles && selectedFiles.length > 0 ? 'New Images Preview:' : 'Existing Images:' }}</div>
                    
                    <!-- Show existing images when editing -->
                    <v-row class="image-gallery" v-if="editingProduct && editingProduct.images && editingProduct.images.length > 0 && (!selectedFiles || selectedFiles.length === 0)">
                      <v-col
                        v-for="(imageUrl, index) in editingProduct.images"
                        :key="'existing-' + index"
                        cols="6"
                        sm="4"
                        md="3"
                      >
                        <div class="gallery-item">
                          <v-img
                            :src="getProductImage({ images: [imageUrl] })"
                            height="140"
                            class="preview-image"
                          >
                            <template v-slot:placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                              </v-row>
                            </template>
                          </v-img>
                          <div class="image-number">{{ index + 1 }}</div>
                        </div>
                      </v-col>
                    </v-row>
                    
                    <!-- Show new selected files -->
                    <v-row class="image-gallery" v-if="selectedFiles && selectedFiles.length > 0">
                      <v-col
                        v-for="(file, index) in selectedFiles"
                        :key="'new-' + index"
                        cols="6"
                        sm="4"
                        md="3"
                      >
                        <div class="gallery-item">
                          <v-img
                            :src="getFilePreview(file)"
                            height="140"
                            class="preview-image"
                          >
                            <template v-slot:placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                              </v-row>
                            </template>
                          </v-img>
                          <v-btn
                            icon
                            x-small
                            color="error"
                            class="remove-image-btn"
                            @click="removeFile(index)"
                          >
                            <v-icon x-small>mdi-close</v-icon>
                          </v-btn>
                          <div class="image-number">{{ index + 1 }}</div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </div>
            </v-form>
          </ValidationObserver>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-btn text large class="cancel-btn" @click="closeDialog">
            <v-icon left>mdi-close</v-icon>
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            large
            class="save-btn"
            :loading="saving"
            @click="saveProduct"
          >
            <v-icon left>{{ editingProduct ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            {{ editingProduct ? 'Update Product' : 'Create Product' }}
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.products-table {
  border-radius: 16px;
  overflow: hidden;
}

/* Premium Dialog Styles */
.premium-dialog {
  border-radius: 24px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  padding: 32px;
  color: white;
  position: relative;
  overflow: hidden;
}

.dialog-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 16px;
  border-radius: 16px;
}

.dialog-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  color: white;
  line-height: 1.2;
}

.dialog-subtitle {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.dialog-content {
  padding: 32px !important;
  max-height: 600px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.modern-input {
  margin-top: 0 !important;
}

.modern-input >>> .v-input__control > .v-input__slot {
  border-color: rgba(14, 165, 233, 0.2) !important;
}

.modern-input >>> .v-input__control > .v-input__slot:hover {
  border-color: rgba(14, 165, 233, 0.4) !important;
}

.modern-input.v-input--is-focused >>> .v-input__control > .v-input__slot {
  border-color: rgba(14, 165, 233, 0.6) !important;
}

.upload-area {
  border: 2px dashed rgba(14, 165, 233, 0.3);
  border-radius: 16px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.02), rgba(118, 75, 162, 0.02));
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: rgba(14, 165, 233, 0.5);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(118, 75, 162, 0.05));
}

.upload-input {
  margin-bottom: 0;
}

.image-preview-container {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(14, 165, 233, 0.1);
}

.preview-label {
  font-weight: 600;
  color: #64748b;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.image-gallery {
  margin: 0 -8px;
}

.gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.preview-image {
  border-radius: 16px;
  border: 3px solid rgba(14, 165, 233, 0.2);
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(10px);
  z-index: 2;
}

.image-number {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.75rem;
  z-index: 2;
}

.dialog-actions {
  padding: 20px 32px !important;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.02), rgba(118, 75, 162, 0.02));
  border-top: 1px solid rgba(14, 165, 233, 0.1);
}

.cancel-btn {
  text-transform: none;
  font-weight: 600;
  color: #64748b;
}

.save-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
  color: white !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.4);
  transition: all 0.3s ease;
}

.save-btn:hover {
  box-shadow: 0 6px 24px rgba(14, 165, 233, 0.5);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .dialog-header {
    padding: 24px;
  }

  .header-content {
    gap: 16px;
  }

  .dialog-title {
    font-size: 1.5rem;
  }

  .dialog-content {
    padding: 24px !important;
  }

  .dialog-actions {
    padding: 16px 24px !important;
    flex-wrap: wrap;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    margin: 4px 0 !important;
  }
}
</style>
