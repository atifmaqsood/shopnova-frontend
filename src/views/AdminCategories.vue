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
    <v-dialog v-model="showAddDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="categoryForm.name"
              label="Category Name"
              outlined
              required
            />
            <v-textarea
              v-model="categoryForm.description"
              label="Description"
              outlined
              rows="3"
            />
            
            <!-- Image Upload -->
            <div class="mb-4">
              <h4 class="mb-2">Category Image (Optional)</h4>
              <v-file-input
                v-model="selectedFile"
                label="Select Image"
                accept="image/*"
                outlined
                prepend-icon="mdi-camera"
                show-size
              />
              
              <!-- Image Preview -->
              <div v-if="selectedFile" class="mt-4">
                <h5 class="mb-2">Preview:</h5>
                <v-img
                  :src="getFilePreview(selectedFile)"
                  height="120"
                  width="120"
                  contain
                  class="category-preview"
                />
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :loading="saving" @click="saveCategory">
            {{ editingCategory ? 'Update' : 'Save' }}
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

.categories-table {
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

.category-preview {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>