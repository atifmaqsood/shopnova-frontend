<template>
  <AdminLayout>
    <div class="admin-categories-view">
      <!-- Premium Page Header -->
      <div class="page-header mb-10">
        <v-row align="end" no-gutters>
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <v-btn icon color="primary" @click="$router.go(-1)" class="mr-2">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <span class="text-overline font-weight-black primary--text letter-spacing-2">TAXONOMY CONTROL</span>
            </div>
            <h1 class="text-h3 font-weight-black mb-2">Collection Tags</h1>
            <p class="grey--text text-subtitle-1 mb-0">Organize your offerings into meaningful clusters for optimized discovery.</p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right mt-6 mt-md-0">
            <v-btn color="primary" x-large rounded elevation="8" class="px-8 font-weight-black" @click="showAddDialog = true">
              <v-icon left size="24">mdi-shape-plus</v-icon> Define Category
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Categories Grid/List -->
      <v-row>
        <v-col v-for="cat in categories" :key="cat.id" cols="12" sm="6" lg="4" xl="3">
          <v-card class="category-card rounded-xl border-light soft-shadow h-100 overflow-hidden d-flex flex-column">
            <v-img :src="getCategoryImage(cat)" height="180" class="grey lighten-4" cover>
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-icon size="48" color="grey lighten-2">mdi-folder-outline</v-icon>
                </v-row>
              </template>
              <div class="d-flex align-center justify-end pa-4">
                <v-btn fab x-small color="white" class="elevation-4 mr-2" @click="editCategory(cat)">
                  <v-icon small color="primary">mdi-pencil</v-icon>
                </v-btn>
                <v-btn fab x-small color="white" class="elevation-4" @click="deleteCategory(cat.id)">
                  <v-icon small color="error">mdi-trash-can-outline</v-icon>
                </v-btn>
              </div>
            </v-img>
            
            <v-card-text class="pa-6 flex-grow-1">
              <div class="text-h5 font-weight-black mb-2">{{ cat.name }}</div>
              <p class="text-body-2 grey--text line-clamp-2 mb-4">{{ cat.description || 'No description provided for this collection.' }}</p>
              
              <div class="d-flex align-center">
                <v-chip x-small color="primary" label class="font-weight-black px-2 mr-2">UID: {{ cat.id }}</v-chip>
                <v-spacer />
                <div class="text-caption font-weight-bold grey--text text-uppercase">{{ formatDate(cat.createdAt) }}</div>
              </div>
            </v-card-text>
            
            <v-divider />
            <v-btn block text color="primary" class="font-weight-black py-6 rounded-0">
              View Items in Collection
            </v-btn>
          </v-card>
        </v-col>

        <!-- Empty State / Add New Placeholder -->
        <v-col cols="12" sm="6" lg="4" xl="3">
          <v-card 
            class="rounded-xl border-dashed h-100 d-flex flex-column align-center justify-center pa-10 cursor-pointer add-cat-placeholder"
            @click="showAddDialog = true"
            flat
          >
            <v-avatar color="primary lighten-5" size="80" class="mb-4">
              <v-icon size="40" color="primary">mdi-plus</v-icon>
            </v-avatar>
            <div class="text-h6 font-weight-black mb-1">New Collection</div>
            <div class="text-caption grey--text text-center">Add a new taxonomic group to your inventory flow.</div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Category Editor Dialog -->
    <v-dialog v-model="showAddDialog" max-width="600px" persistent>
      <v-card class="rounded-xl overflow-hidden">
        <v-toolbar flat class="gradient-primary pa-4" height="100">
          <v-icon large color="white" class="mr-6 bg-white-20 pa-4 rounded-xl">mdi-tag-outline</v-icon>
          <div>
            <div class="text-overline white--text opacity-80 mb-1">TAXONOMY DEFINITION</div>
            <v-toolbar-title class="text-h5 font-weight-black white--text">{{ editingCategory ? 'Edit Collection' : 'Create Collection' }}</v-toolbar-title>
          </div>
          <v-spacer />
          <v-btn icon dark @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text class="pa-8">
          <v-form ref="form">
            <v-text-field
              v-model="categoryForm.name"
              label="Collection Name"
              outlined
              class="rounded-lg mb-4"
              placeholder="e.g., Summer Essentials"
            />
            
            <v-textarea
              v-model="categoryForm.description"
              label="Narrative Description"
              outlined
              class="rounded-lg mb-6"
              rows="3"
            />

            <!-- Image Hub -->
            <div class="text-caption font-weight-black grey--text text-uppercase letter-spacing-2 mb-4">Collection Visual</div>
            <div class="image-uploader-cat rounded-xl border-light pa-6 bg-grey-lightest d-flex align-center">
              <v-avatar size="100" rounded="lg" class="mr-6 border shadow-sm">
                <v-img :src="selectedFile ? getFilePreview(selectedFile) : getCategoryImage(editingCategory)" cover>
                  <template v-slot:placeholder>
                    <v-icon size="40" color="grey lighten-3">mdi-image-outline</v-icon>
                  </template>
                </v-img>
              </v-avatar>
              
              <div class="flex-grow-1">
                <div class="text-subtitle-2 font-weight-black mb-1">Cover Image</div>
                <div class="text-caption grey--text mb-4">Update the thumbnail for this collection.</div>
                <v-file-input
                  v-model="selectedFile"
                  accept="image/*"
                  outlined
                  dense
                  hide-details
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera-outline"
                  placeholder="Change Image"
                  class="rounded-lg"
                />
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-8 bg-white border-top">
          <v-btn text large rounded class="px-8 font-weight-bold grey--text" @click="closeDialog">Discard</v-btn>
          <v-spacer />
          <v-btn x-large color="primary" rounded elevation="12" class="px-10 font-weight-black" :loading="saving" @click="saveCategory">
            {{ editingCategory ? 'Update Collection' : 'Create Collection' }}
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
  components: { AdminLayout },
  data() {
    return {
      showAddDialog: false,
      editingCategory: null,
      saving: false,
      loading: false,
      categories: [],
      categoryForm: { name: '', description: '' },
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
        this.$store.dispatch('ui/showSnackbar', { message: 'Cloud link failed.', color: 'error' })
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
          requestData = new FormData()
          requestData.append('name', this.categoryForm.name)
          requestData.append('description', this.categoryForm.description || '')
          requestData.append('image', this.selectedFile)
          headers['Content-Type'] = 'multipart/form-data'
        } else {
          requestData = { name: this.categoryForm.name, description: this.categoryForm.description || '' }
        }

        if (this.editingCategory) {
          await this.$http.patch(`/categories/${this.editingCategory.id}`, requestData, { headers })
        } else {
          await this.$http.post('/categories', requestData, { headers })
        }

        this.$store.dispatch('ui/showSnackbar', { message: 'Taxonomy entry saved.', color: 'success' })
        this.closeDialog()
        await this.fetchCategories()
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', { message: 'Transaction error.', color: 'error' })
      } finally {
        this.saving = false
      }
    },
    editCategory(category) {
      this.editingCategory = category
      this.categoryForm = { name: category.name, description: category.description || '' }
      this.selectedFile = null
      this.showAddDialog = true
    },
    async deleteCategory(id) {
      if (confirm('Permanently remove this collection? Products may lose their primary mapping.')) {
        try {
          await this.$http.delete(`/categories/${id}`)
          this.$store.dispatch('ui/showSnackbar', { message: 'Collection deleted.', color: 'success' })
          await this.fetchCategories()
        } catch (error) {
          this.$store.dispatch('ui/showSnackbar', { message: 'Action restricted.', color: 'error' })
        }
      }
    },
    closeDialog() {
      this.showAddDialog = false
      this.editingCategory = null
      this.selectedFile = null
      this.categoryForm = { name: '', description: '' }
    },
    getCategoryImage(category) {
      if (category?.image) {
        if (category.image.startsWith('/uploads/')) {
          return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${category.image}`
        }
        return category.image
      }
      return ''
    },
    getFilePreview(file) { return URL.createObjectURL(file) },
    formatDate(date) { return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }
  }
}
</script>

<style scoped>
.admin-categories-view {
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.border-light { border: 1px solid rgba(0,0,0,0.06) !important; }
.soft-shadow { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04) !important; }
.border-dashed { border: 2px dashed #cbd5e1 !important; }

.add-cat-placeholder {
  transition: all 0.3s ease;
  background-color: rgba(14, 165, 233, 0.02) !important;
}

.add-cat-placeholder:hover {
  border-color: #0ea5e9 !important;
  background-color: rgba(14, 165, 233, 0.04) !important;
}

.gradient-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
}

.bg-white-20 { background-color: rgba(255, 255, 255, 0.2) !important; }
.bg-grey-lightest { background-color: #f8fafc !important; }

.shadow-sm { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important; }
.letter-spacing-2 { letter-spacing: 2px; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
