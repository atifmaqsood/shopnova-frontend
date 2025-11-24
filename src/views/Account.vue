<template>
  <div class="account-page">
    <!-- Header Section with Gradient Background -->
    <section class="profile-header-modern">
      <div class="header-overlay"></div>
      <v-container class="header-content">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <div class="profile-avatar-wrapper">
              <v-avatar size="140" class="profile-avatar-modern elevation-8">
                <v-img :src="profileImage" />
              </v-avatar>
              <v-btn
                fab
                small
                class="avatar-edit-btn-modern elevation-4"
                @click="showImageUpload = true"
              >
                <v-icon color="white" small>mdi-camera</v-icon>
              </v-btn>
            </div>
            
            <h1 class="profile-name mt-6 mb-2">{{ user?.name || 'User' }}</h1>
            <p class="profile-email mb-3">{{ user?.email }}</p>
            
            <div class="profile-badges mb-4">
              <v-chip color="white" class="mr-2 elevation-2">
                <v-icon left small color="primary">mdi-shield-check</v-icon>
                <span class="font-weight-bold">{{ user?.role }}</span>
              </v-chip>
              <v-chip color="white" class="elevation-2">
                <v-icon left small color="success">mdi-check-decagram</v-icon>
                <span class="font-weight-bold">Verified</span>
              </v-chip>
            </div>
            
            <p class="profile-member-since">
              <v-icon small class="mr-1">mdi-calendar</v-icon>
              Member since {{ formatDate(user?.createdAt) }}
            </p>
            
            <div class="profile-actions mt-6">
              <v-btn color="white" large class="mr-3 elevation-4" @click="showEditProfile = true">
                <v-icon left color="primary">mdi-pencil</v-icon>
                <span class="primary--text font-weight-bold">Edit Profile</span>
              </v-btn>
              <v-btn outlined color="white" large class="elevation-0" @click="viewNotifications">
                <v-icon left>mdi-bell</v-icon>
                Notifications
                <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" class="ml-2" />
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-container class="py-8">
      <v-row>
        <!-- Quick Stats with Modern Design -->
        <v-col cols="12">
          <h2 class="text-h5 font-weight-bold mb-6">
            <v-icon left color="primary">mdi-chart-box</v-icon>
            Quick Overview
          </h2>
          <v-row>
            <v-col cols="6" sm="6" md="3">
              <v-card class="stat-card-modern elevation-4" hover @click="$router.push('/orders')">
                <div class="stat-icon-wrapper stat-primary">
                  <v-icon size="40" color="white">mdi-package-variant</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ recentOrders.length }}</div>
                  <div class="stat-label">Orders</div>
                </div>
                <v-icon class="stat-arrow">mdi-chevron-right</v-icon>
              </v-card>
            </v-col>
            
            <v-col cols="6" sm="6" md="3">
              <v-card class="stat-card-modern elevation-4" hover @click="viewNotifications">
                <div class="stat-icon-wrapper stat-success">
                  <v-icon size="40" color="white">mdi-bell</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ unreadCount }}</div>
                  <div class="stat-label">Notifications</div>
                </div>
                <div v-if="unreadCount > 0" class="stat-badge-custom pulse-animation">
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </div>
                <v-icon class="stat-arrow">mdi-chevron-right</v-icon>
              </v-card>
            </v-col>
            
            <v-col cols="6" sm="6" md="3">
              <v-card class="stat-card-modern elevation-4" hover @click="$router.push('/addresses')">
                <div class="stat-icon-wrapper stat-info">
                  <v-icon size="40" color="white">mdi-map-marker</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">2</div>
                  <div class="stat-label">Addresses</div>
                </div>
                <v-icon class="stat-arrow">mdi-chevron-right</v-icon>
              </v-card>
            </v-col>
            
            <v-col cols="6" sm="6" md="3">
              <v-card class="stat-card-modern elevation-4" hover>
                <div class="stat-icon-wrapper stat-warning">
                  <v-icon size="40" color="white">mdi-heart</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">5</div>
                  <div class="stat-label">Wishlist</div>
                </div>
                <v-icon class="stat-arrow">mdi-chevron-right</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <!-- Quick Actions -->
        <v-col cols="12" md="4">
          <v-card class="action-card-modern elevation-4">
            <v-card-title class="action-card-header">
              <v-icon left color="primary">mdi-lightning-bolt</v-icon>
              Quick Actions
            </v-card-title>
            <v-list class="pa-2 bg-transparent">
              <v-list-item @click="$router.push('/cart')" class="action-item-modern mb-2">
                <v-list-item-avatar class="action-icon-bg primary lighten-5">
                  <v-icon color="primary">mdi-cart</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">View Cart</v-list-item-title>
                  <v-list-item-subtitle>Check your shopping cart</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon small color="grey">mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
              
              <v-list-item @click="viewOrders" class="action-item-modern mb-2">
                <v-list-item-avatar class="action-icon-bg success lighten-5">
                  <v-icon color="success">mdi-package-variant</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">My Orders</v-list-item-title>
                  <v-list-item-subtitle>Track your orders</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon small color="grey">mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
              
              <v-list-item @click="$router.push('/addresses')" class="action-item-modern mb-2">
                <v-list-item-avatar class="action-icon-bg info lighten-5">
                  <v-icon color="info">mdi-map-marker</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">My Addresses</v-list-item-title>
                  <v-list-item-subtitle>Manage delivery addresses</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon small color="grey">mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
              
              <v-list-item @click="viewNotifications" class="action-item-modern">
                <v-list-item-avatar class="action-icon-bg warning lighten-5">
                  <v-icon color="warning">mdi-bell</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">Notifications</v-list-item-title>
                  <v-list-item-subtitle>View your notifications</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" dot offset-x="10" offset-y="10">
                    <v-icon small color="grey">mdi-chevron-right</v-icon>
                  </v-badge>
                  <v-icon v-else small color="grey">mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Recent Orders -->
        <v-col cols="12" md="8">
          <v-card class="orders-card-modern elevation-4">
            <div class="d-flex justify-space-between align-center px-6 py-4 border-bottom">
              <v-card-title class="pa-0 font-weight-bold text-h6">
                <v-icon left color="primary">mdi-history</v-icon>
                Recent Orders
              </v-card-title>
              <v-btn text color="primary" small @click="viewOrders" v-if="recentOrders.length > 0">
                View All
                <v-icon right small>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
            
            <v-card-text class="pa-0">
              <div v-if="recentOrders.length > 0">
                <div v-for="(order, index) in recentOrders" :key="order.id">
                  <div class="order-item-modern pa-5 hover-bg">
                    <v-row align="center">
                      <v-col cols="12" sm="8">
                        <div class="d-flex align-center mb-3">
                          <span class="text-h6 font-weight-bold mr-3">#{{ order.id }}</span>
                          <v-chip :color="getStatusColor(order.status)" small label class="font-weight-bold">
                            {{ order.status }}
                          </v-chip>
                        </div>
                        <div class="d-flex align-center text-body-2 grey--text">
                          <v-icon small class="mr-1">mdi-calendar</v-icon>
                          <span class="mr-4">{{ formatDate(order.createdAt) }}</span>
                          <v-icon small class="mr-1">mdi-package-variant</v-icon>
                          <span>{{ order.items?.length || 0 }} items</span>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="4" class="text-sm-right d-flex flex-column align-end justify-center">
                        <div class="text-h6 primary--text font-weight-bold mb-2">
                          ${{ order.total.toFixed(2) }}
                        </div>
                        <v-btn small outlined color="primary" class="rounded-lg" @click="viewOrderDetails(order.id)">
                          View Details
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                  <v-divider v-if="index < recentOrders.length - 1" />
                </div>
              </div>
              <div v-else class="text-center pa-12 empty-state">
                <div class="empty-icon-bg mb-4">
                  <v-icon size="64" color="primary" style="opacity: 0.5">mdi-shopping-outline</v-icon>
                </div>
                <h3 class="text-h6 font-weight-bold mb-2">No orders yet</h3>
                <p class="grey--text mb-6">Looks like you haven't placed any orders yet.</p>
                <v-btn color="primary" large elevation="2" @click="$router.push('/products')">
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
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Header Styles */
.profile-header-modern {
  position: relative;
  background: linear-gradient(-45deg, #0f172a, #1e293b, #0f172a, #334155);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  color: white;
  padding: 60px 0 100px;
  margin-bottom: -60px;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 40%);
  pointer-events: none;
}

/* Stats Cards */
.stat-card-modern {
  border-radius: 20px !important;
  padding: 24px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  overflow: visible; /* Changed to visible for badge */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: white;
}

.profile-avatar-wrapper {
  position: relative;
  display: inline-block;
  padding: 4px; /* Space for the border */
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(8px);
}

.profile-avatar-modern {
  border: 4px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.avatar-edit-btn-modern {
  position: absolute;
  bottom: 0;
  right: 0;
  border: 3px solid #ffffff;
  background-color: #3b82f6 !important; /* Primary color */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translate(10%, 10%); /* Fine tune position */
}

.avatar-edit-btn-modern:hover {
  transform: translate(10%, 10%) scale(1.1);
}

.stat-card-modern:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
  border-color: transparent;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card-modern:hover .stat-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.stat-primary { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2); }
.stat-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 10px 20px rgba(5, 150, 105, 0.2); }
.stat-info { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); box-shadow: 0 10px 20px rgba(2, 132, 199, 0.2); }
.stat-warning { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); box-shadow: 0 10px 20px rgba(217, 119, 6, 0.2); }

.stat-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.1;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.stat-label {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-arrow {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: #cbd5e1;
  position: absolute;
  right: 20px;
  top: 50%;
  margin-top: -12px;
}

.stat-card-modern:hover .stat-arrow {
  opacity: 1;
  transform: translateX(0);
  color: #3b82f6;
}



.stat-badge-custom {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: bold;
  border: 3px solid #f8fafc;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
  z-index: 10;
  padding: 0 6px;
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

/* Action Card */
.action-card-modern {
  border-radius: 16px !important;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
  height: 100%;
}

.action-card-header {
  padding: 20px 24px;
  font-weight: 700;
  font-size: 1.1rem;
  border-bottom: 1px solid #f1f5f9;
}

.action-item-modern {
  border-radius: 12px;
  margin: 0 8px;
  transition: all 0.2s ease;
}

.action-item-modern:hover {
  background-color: #f8fafc;
}

.action-icon-bg {
  border-radius: 12px;
  margin-right: 16px !important;
}

/* Orders Card */
.orders-card-modern {
  border-radius: 16px !important;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
  height: 100%;
}

.border-bottom {
  border-bottom: 1px solid #f1f5f9;
}

.order-item-modern {
  transition: background-color 0.2s ease;
}

.hover-bg:hover {
  background-color: #f8fafc;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon-bg {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 600px) {
  .profile-header-modern {
    padding: 40px 0 80px;
  }
  
  .profile-name {
    font-size: 1.75rem;
  }
  
  .stat-card-modern {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
  
  .stat-icon-wrapper {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .stat-arrow {
    display: none;
  }
}
</style>
