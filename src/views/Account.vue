<template>
  <div class="account-page">
    <!-- Header Section -->
    <section class="profile-header">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="profile-info d-flex align-center">
              <div class="profile-avatar-container mr-6">
                <v-avatar size="120" class="profile-avatar">
                  <v-img :src="profileImage" />
                </v-avatar>
                <v-btn
                  fab
                  small
                  color="primary"
                  class="avatar-edit-btn"
                  @click="showImageUpload = true"
                >
                  <v-icon small>mdi-camera</v-icon>
                </v-btn>
              </div>
              <div class="profile-details">
                <h1 class="display-1 font-weight-bold mb-2">{{ user?.name || 'User' }}</h1>
                <p class="text-h6 grey--text mb-2">{{ user?.email }}</p>
                <v-chip color="primary" small class="mb-2">
                  <v-icon left small>mdi-shield-account</v-icon>
                  {{ user?.role }}
                </v-chip>
                <p class="text-body-2 grey--text">
                  Member since {{ formatDate(user?.createdAt) }}
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-md-right">
            <v-btn color="primary" large @click="showEditProfile = true">
              <v-icon left>mdi-pencil</v-icon>
              Edit Profile
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-container class="py-8">
      <v-row>
        <!-- Quick Stats -->
        <v-col cols="12">
          <v-row>
            <v-col cols="6" sm="3">
              <v-card class="stat-card text-center pa-4" color="primary" dark>
                <v-icon size="40" class="mb-2">mdi-package-variant</v-icon>
                <div class="text-h4 font-weight-bold">{{ recentOrders.length }}</div>
                <div class="text-body-2">Recent Orders</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card class="stat-card text-center pa-4" color="success" dark>
                <v-icon size="40" class="mb-2">mdi-bell</v-icon>
                <div class="text-h4 font-weight-bold">{{ unreadCount }}</div>
                <div class="text-body-2">Notifications</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card class="stat-card text-center pa-4" color="info" dark>
                <v-icon size="40" class="mb-2">mdi-map-marker</v-icon>
                <div class="text-h4 font-weight-bold">2</div>
                <div class="text-body-2">Addresses</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card class="stat-card text-center pa-4" color="warning" dark>
                <v-icon size="40" class="mb-2">mdi-heart</v-icon>
                <div class="text-h4 font-weight-bold">5</div>
                <div class="text-body-2">Wishlist</div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <!-- Quick Actions -->
        <v-col cols="12" md="4">
          <v-card class="action-card elevation-4">
            <v-card-title class="primary white--text">
              <v-icon left color="white">mdi-lightning-bolt</v-icon>
              Quick Actions
            </v-card-title>
            <v-list class="pa-0">
              <v-list-item @click="$router.push('/cart')" class="action-item">
                <v-list-item-icon>
                  <v-icon color="primary">mdi-cart</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>View Cart</v-list-item-title>
                  <v-list-item-subtitle>Check your shopping cart</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
              
              <v-divider />
              
              <v-list-item @click="viewOrders" class="action-item">
                <v-list-item-icon>
                  <v-icon color="success">mdi-package-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>My Orders</v-list-item-title>
                  <v-list-item-subtitle>Track your orders</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
              
              <v-divider />
              
              <v-list-item @click="$router.push('/addresses')" class="action-item">
                <v-list-item-icon>
                  <v-icon color="info">mdi-map-marker</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>My Addresses</v-list-item-title>
                  <v-list-item-subtitle>Manage delivery addresses</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
              
              <v-divider />
              
              <v-list-item @click="viewNotifications" class="action-item">
                <v-list-item-icon>
                  <v-icon color="warning">mdi-bell</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Notifications</v-list-item-title>
                  <v-list-item-subtitle>View your notifications</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-badge v-if="unreadCount > 0" :content="unreadCount" color="red">
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-badge>
                  <v-icon v-else>mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Recent Orders -->
        <v-col cols="12" md="8">
          <v-card class="orders-card elevation-4">
            <v-card-title class="success white--text">
              <v-icon left color="white">mdi-package-variant</v-icon>
              Recent Orders
            </v-card-title>
            <v-card-text class="pa-0">
              <div v-if="recentOrders.length > 0">
                <div v-for="(order, index) in recentOrders" :key="order.id">
                  <div class="order-item pa-4">
                    <v-row align="center">
                      <v-col cols="12" sm="8">
                        <div class="d-flex align-center mb-2">
                          <v-chip color="primary" small class="mr-2">
                            #{{ order.id }}
                          </v-chip>
                          <span class="text-body-2 grey--text">{{ formatDate(order.createdAt) }}</span>
                        </div>
                        <div class="order-summary">
                          <span class="font-weight-medium">
                            {{ order.items?.length || 0 }} item(s)
                          </span>
                          <span class="mx-2">â€¢</span>
                          <span class="text-h6 primary--text font-weight-bold">
                            ${{ order.total.toFixed(2) }}
                          </span>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="4" class="text-sm-right">
                        <v-chip :color="getStatusColor(order.status)" text-color="white" small class="mb-2">
                          {{ order.status }}
                        </v-chip>
                        <br>
                        <v-btn small outlined color="primary" @click="viewOrderDetails(order.id)">
                          View Details
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                  <v-divider v-if="index < recentOrders.length - 1" />
                </div>
              </div>
              <div v-else class="text-center pa-8">
                <v-icon size="80" color="grey lighten-2">mdi-package-variant-closed</v-icon>
                <h3 class="text-h6 grey--text mt-4">No orders yet</h3>
                <p class="grey--text">Start shopping to see your orders here</p>
                <v-btn color="primary" @click="$router.push('/products')">
                  Start Shopping
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Profile Dialog -->
    <v-dialog v-model="showEditProfile" max-width="600px" persistent>
      <v-card>
        <v-card-title class="primary white--text">
          <v-icon left color="white">mdi-account-edit</v-icon>
          Edit Profile
        </v-card-title>
        <v-card-text class="pa-6">
          <ValidationObserver ref="profileObserver">
            <v-form>
              <ValidationProvider name="name" rules="required">
                <template slot-scope="{ errors }">
                  <v-text-field
                    v-model="profileForm.name"
                    label="Full Name"
                    :error-messages="errors"
                    outlined
                    prepend-inner-icon="mdi-account"
                  />
                </template>
              </ValidationProvider>
              
              <ValidationProvider name="phone">
                <template slot-scope="{ errors }">
                  <v-text-field
                    v-model="profileForm.phone"
                    label="Phone Number"
                    :error-messages="errors"
                    outlined
                    prepend-inner-icon="mdi-phone"
                    placeholder="+1234567890"
                  />
                </template>
              </ValidationProvider>
            </v-form>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn text @click="closeEditProfile">Cancel</v-btn>
          <v-btn color="primary" :loading="updating" @click="updateProfile">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Image Upload Dialog -->
    <v-dialog v-model="showImageUpload" max-width="500px" persistent>
      <v-card>
        <v-card-title class="primary white--text">
          <v-icon left color="white">mdi-camera</v-icon>
          Update Profile Picture
        </v-card-title>
        <v-card-text class="pa-6">
          <div class="text-center mb-4">
            <v-avatar size="120" class="mb-4">
              <v-img :src="imagePreview || profileImage" />
            </v-avatar>
          </div>
          <v-file-input
            v-model="selectedImage"
            label="Select Profile Picture"
            accept="image/*"
            outlined
            prepend-icon="mdi-camera"
            show-size
            @change="previewImage"
          />
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn text @click="closeImageUpload">Cancel</v-btn>
          <v-btn color="primary" :loading="uploadingImage" @click="uploadProfileImage" :disabled="!selectedImage">
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Account',
  data() {
    return {
      recentOrders: [],
      showEditProfile: false,
      showImageUpload: false,
      updating: false,
      uploadingImage: false,
      selectedImage: null,
      imagePreview: null,
      profileForm: {
        name: '',
        phone: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      unreadCount: 'notifications/unreadCount'
    }),
    profileImage() {
      if (this.user?.profileImage) {
        if (this.user.profileImage.startsWith('/uploads/')) {
          return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${this.user.profileImage}`
        }
        return this.user.profileImage
      }
      return require('@/assets/avatar2.jpg')
    }
  },
  async created() {
    this.$store.dispatch('notifications/fetchUnreadCount')
    await this.fetchRecentOrders()
  },
  methods: {
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    async fetchRecentOrders() {
      try {
        const response = await this.$http.get('/orders/my-orders', {
          params: { limit: 5 }
        })
        // Extract orders from nested API response structure
        this.recentOrders = response.data?.orders || []
      } catch (error) {
        console.warn('Failed to fetch recent orders:', error.message)
      }
    },
    viewOrders() {
      // Navigate to orders page when implemented
      this.$store.dispatch('ui/showSnackbar', {
        message: 'Orders page coming soon!',
        color: 'info'
      })
    },
    viewNotifications() {
      if (this.$route.path !== '/notifications') {
        this.$router.push('/notifications').catch(() => {})
      }
    },
    getStatusColor(status) {
      const colors = {
        PENDING: 'orange',
        PROCESSING: 'blue',
        SHIPPED: 'purple',
        DELIVERED: 'green',
        CANCELLED: 'red'
      }
      return colors[status] || 'grey'
    },
    async updateProfile() {
      const isValid = await this.$refs.profileObserver.validate()
      if (!isValid) return

      this.updating = true
      try {
        const response = await this.$http.put('/users/profile', this.profileForm)
        console.log('Profile update response:', response.data)
        
        await this.$store.dispatch('auth/fetchProfile')
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Profile updated successfully!',
          color: 'success'
        })
        this.closeEditProfile()
      } catch (error) {
        console.error('Profile update error:', error)
        this.$store.dispatch('ui/showSnackbar', {
          message: error.response?.data?.message || 'Failed to update profile',
          color: 'error'
        })
      } finally {
        this.updating = false
      }
    },
    async uploadProfileImage() {
      if (!this.selectedImage) return

      this.uploadingImage = true
      try {
        const formData = new FormData()
        formData.append('profileImage', this.selectedImage)
        
        const response = await this.$http.put('/users/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log('Image upload response:', response.data)
        
        await this.$store.dispatch('auth/fetchProfile')
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Profile picture updated successfully!',
          color: 'success'
        })
        this.closeImageUpload()
      } catch (error) {
        console.error('Image upload error:', error)
        this.$store.dispatch('ui/showSnackbar', {
          message: error.response?.data?.message || 'Failed to update profile picture',
          color: 'error'
        })
      } finally {
        this.uploadingImage = false
      }
    },
    previewImage() {
      if (this.selectedImage) {
        this.imagePreview = URL.createObjectURL(this.selectedImage)
      }
    },
    closeEditProfile() {
      this.showEditProfile = false
      this.profileForm = {
        name: this.user?.name || '',
        phone: this.user?.phone || ''
      }
    },
    closeImageUpload() {
      this.showImageUpload = false
      this.selectedImage = null
      this.imagePreview = null
    },
    viewOrderDetails(orderId) {
      this.$router.push(`/orders/${orderId}`)
    }
  },
  watch: {
    user: {
      handler(newUser) {
        if (newUser) {
          this.profileForm = {
            name: newUser.name || '',
            phone: newUser.phone || ''
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.account-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.profile-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
  padding: 60px 0;
  margin-bottom: 0;
}

.profile-avatar-container {
  position: relative;
}

.profile-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.profile-details h1 {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 16px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.action-card {
  border-radius: 16px;
  overflow: hidden;
}

.action-item {
  transition: background-color 0.2s ease;
}

.action-item:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

.orders-card {
  border-radius: 16px;
  overflow: hidden;
}

.order-item {
  transition: background-color 0.2s ease;
}

.order-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

@media (max-width: 960px) {
  .profile-header {
    padding: 40px 0;
  }
  
  .profile-info {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar-container {
    margin-right: 0 !important;
    margin-bottom: 24px;
  }
}
</style>
