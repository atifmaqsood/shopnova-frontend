<template>
  <AdminLayout>
    <div class="categories-content">
      <div class="page-header mb-6">
        <h1 class="page-title">Category Management</h1>
        <v-btn color="primary" large @click="showAddDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Add New Category
        </v-btn>
      </div>

      <v-card class="categories-table">
        <v-data-table
          :headers="headers"
          :items="categories"
          :loading="loading"
          class="elevation-0"
        >
          <template slot="item.image" slot-scope="{ item }">
            <v-avatar size="40" class="ma-1">
              <v-img v-if="item.image" :src="getCategoryImage(item)" />
              <v-icon v-else color="grey">mdi-tag</v-icon>
            </v-avatar>
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <v-btn icon small @click="editCategory(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="error" @click="deleteCategory(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Add/Edit Category Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600px" persistent>
      <v-card class="premium-dialog">
        <div class="dialog-header">
          <div class="header-content">
            <v-icon large color="white" class="header-icon">mdi-tag</v-icon>
            <div>
              <h2 class="dialog-title">{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h2>
              <p class="dialog-subtitle">{{ editingCategory ? 'Update category information' : 'Create a new product category' }}</p>
            </div>
          </div>
        </div>

        <v-card-text class="dialog-content">
          <v-form ref="form">
            <div class="form-group">
              <label class="form-label">Category Name *</label>
              <v-text-field
                v-model="categoryForm.name"
                placeholder="Enter category name"
                outlined
                dense
                required
                class="modern-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <v-textarea
                v-model="categoryForm.description"
                placeholder="Enter category description"
                outlined
                rows="3"
                dense
                class="modern-input"
              />
            </div>
            
            <!-- Image Upload -->
            <div class="form-group">
              <label class="form-label">Category Image (Optional)</label>
              <div class="upload-area">
                <v-file-input
                  v-model="selectedFile"
                  accept="image/*"
                  outlined
                  dense
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  placeholder="Click to select or drag and drop"
                  show-size
                  class="modern-input upload-input"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small color="primary" label>
                      <v-icon left small>mdi-image</v-icon>
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
                
                <!-- Image Preview -->
                <div v-if="selectedFile || (editingCategory && editingCategory.image)" class="image-preview-container">
                  <div class="preview-label">Preview:</div>
                  <div class="image-preview-wrapper">
                    <v-img
                      :src="selectedFile ? getFilePreview(selectedFile) : getCategoryImage(editingCategory)"
                      height="160"
                      width="160"
                      contain
                      class="preview-image"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                    <v-btn
                      v-if="selectedFile"
                      icon
                      small
                      color="error"
                      class="remove-image-btn"
                      @click="selectedFile = null"
                    >
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-form>
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
            @click="saveCategory"
          >
            <v-icon left>{{ editingCategory ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            {{ editingCategory ? 'Update Category' : 'Create Category' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/AdminLayout.vue'

export default {
  name: 'AdminCategories',
  components: {
    AdminLayout
  },
  data() {
    return {
      showAddDialog: false,
      editingCategory: null,
      saving: false,
      loading: false,
      categories: [],
      headers: [
        { text: 'Image', value: 'image', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Created', value: 'createdAt' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      categoryForm: {
        name: '',
        description: ''
      },
      selectedFile: null
    }
  },
  async created() {
    await this.fetchCategories()
  },
  methods: {
    async fetchCategories() {
      this.loading = true
      try {
        const response = await this.$http.get('/categories')
        this.categories = response.data || []
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to fetch categories',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async saveCategory() {
      if (!this.categoryForm.name) return

      this.saving = true
      try {
        let requestData
        let headers = {}
        
        if (this.selectedFile) {
          // Use FormData when image is present
          requestData = new FormData()
          requestData.append('name', this.categoryForm.name)
          requestData.append('description', this.categoryForm.description || '')
          requestData.append('image', this.selectedFile)
          headers['Content-Type'] = 'multipart/form-data'
        } else {
          // Use JSON when no image
          requestData = {
            name: this.categoryForm.name,
            description: this.categoryForm.description || ''
          }
        }

        if (this.editingCategory) {
          await this.$http.patch(`/categories/${this.editingCategory.id}`, requestData, { headers })
        } else {
          await this.$http.post('/categories', requestData, { headers })
        }

        this.$store.dispatch('ui/showSnackbar', {
          message: `Category ${this.editingCategory ? 'updated' : 'created'} successfully!`,
          color: 'success'
        })
        
        this.closeDialog()
        await this.fetchCategories()
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to save category',
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },
    editCategory(category) {
      this.editingCategory = category
      this.categoryForm = {
        name: category.name,
        description: category.description || ''
      }
      this.selectedFile = null
      this.showAddDialog = true
    },
    async deleteCategory(id) {
      if (confirm('Are you sure you want to delete this category?')) {
        try {
          await this.$http.delete(`/categories/${id}`)
          this.$store.dispatch('ui/showSnackbar', {
            message: 'Category deleted successfully!',
            color: 'success'
          })
          await this.fetchCategories()
        } catch (error) {
          this.$store.dispatch('ui/showSnackbar', {
            message: 'Failed to delete category',
            color: 'error'
          })
        }
      }
    },
    closeDialog() {
      this.showAddDialog = false
      this.editingCategory = null
      this.selectedFile = null
      this.categoryForm = {
        name: '',
        description: ''
      }
    },
    getCategoryImage(category) {
      if (!category.image) return ''
      if (category.image.startsWith('/uploads/')) {
        return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${category.image}`
      }
      return category.image
    },
    getFilePreview(file) {
      return URL.createObjectURL(file)
    }
  }
}
</script>

<style scoped>
.categories-content {
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

.categories-table {
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
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.image-preview-wrapper {
  position: relative;
  display: inline-block;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.preview-image {
  border-radius: 16px;
  border: 3px solid rgba(14, 165, 233, 0.2);
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(10px);
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
