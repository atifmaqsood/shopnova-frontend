<template>
  <AdminLayout>
    <div class="users-content">
      <div class="page-header mb-6">
        <h1 class="page-title">User Management</h1>
        <v-select
          v-model="roleFilter"
          :items="roleOptions"
          label="Filter by Role"
          outlined
          dense
          clearable
          style="max-width: 200px;"
          @change="fetchUsers"
        />
      </div>

      <v-card class="users-table">
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          class="elevation-0"
        >
          <template slot="item.avatar" slot-scope="{ item }">
            <v-avatar size="40" color="primary">
              <v-img v-if="item.profileImage" :src="getUserImage(item)" />
              <span v-else class="white--text">{{ item.name.charAt(0).toUpperCase() }}</span>
            </v-avatar>
          </template>
          <template slot="item.role" slot-scope="{ item }">
            <v-chip
              small
              :color="item.role === 'ADMIN' ? 'red' : 'primary'"
              text-color="white"
            >
              {{ item.role }}
            </v-chip>
          </template>
          <template slot="item.isVerified" slot-scope="{ item }">
            <v-icon :color="item.isVerified ? 'green' : 'red'">
              {{ item.isVerified ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
          </template>
          <template slot="item.createdAt" slot-scope="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <v-btn icon small @click="viewUser(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="toggleUserRole(item)" v-if="item.role !== 'ADMIN'">
                  <v-list-item-title>Make Admin</v-list-item-title>
                </v-list-item>
                <v-list-item @click="toggleUserRole(item)" v-else>
                  <v-list-item-title>Remove Admin</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!--User Details Dialog -->
    <v-dialog v-model="showUserDialog" max-width="700px">
      <v-card v-if="selectedUser" class="premium-dialog">
        <div class="dialog-header">
          <div class="header-content">
            <v-avatar size="64" color="white" class="header-avatar">
              <v-img v-if="selectedUser.profileImage" :src="getUserImage(selectedUser)" />
              <span v-else class="gradient-text text-h4">
                {{ selectedUser.name.charAt(0).toUpperCase() }}
              </span>
            </v-avatar>
            <div class="header-info">
              <h2 class="dialog-title">{{ selectedUser.name }}</h2>
              <p class="dialog-subtitle">{{ selectedUser.email }}</p>
            </div>
            <v-spacer />
            <v-chip
              :color="selectedUser.role === 'ADMIN' ? '#fa709a' : '#0ea5e9'"
              text-color="white"
              class="role-chip"
            >
              {{ selectedUser.role }}
            </v-chip>
          </div>
        </div>

        <v-card-text class="dialog-content">
          <!-- User Stats -->
          <div class="stats-grid" v-if="userStats.ordersCount > 0 || userStats.totalSpent > 0">
            <div class="stat-box">
              <div class="stat-icon purple-gradient">
                <v-icon color="white">mdi-cart</v-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ userStats.ordersCount || 0 }}</div>
                <div class="stat-label">Orders</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon green-gradient">
                <v-icon color="white">mdi-cash</v-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">${{ userStats.totalSpent ? userStats.totalSpent.toLocaleString() : '0' }}</div>
                <div class="stat-label">Total Spent</div>
              </div>
            </div>
            <div class="stat-box" v-if="userStats.reviewsCount > 0">
              <div class="stat-icon blue-gradient">
                <v-icon color="white">mdi-star</v-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ userStats.reviewsCount || 0 }}</div>
                <div class="stat-label">Reviews</div>
              </div>
            </div>
          </div>

          <!-- User Information -->
          <v-divider class="my-6"></v-divider>

          <v-row>
            <v-col cols="12" md="6">
              <div class="info-section">
                <h3 class="section-title">
                  <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                  Personal Information
                </h3>
                <div class="info-item">
                  <span class="info-label">Name:</span>
                  <span class="info-value">{{ selectedUser.name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">{{ selectedUser.email }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">{{ selectedUser.phone || 'Not provided' }}</span>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-section">
                <h3 class="section-title">
                  <v-icon color="success" class="mr-2">mdi-shield-check</v-icon>
                  Account Status
                </h3>
                <div class="info-item">
                  <span class="info-label">Role:</span>
                  <v-chip small :color="selectedUser.role === 'ADMIN' ? 'error' : 'primary'" text-color="white">
                    {{ selectedUser.role }}
                  </v-chip>
                </div>
                <div class="info-item">
                  <span class="info-label">Verified:</span>
                  <v-chip small :color="selectedUser.isVerified ? 'success' : 'error'" text-color="white">
                    <v-icon left small>{{ selectedUser.isVerified ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                    {{ selectedUser.isVerified ? 'Yes' : 'No' }}
                  </v-chip>
                </div>
                <div class="info-item">
                  <span class="info-label">Active:</span>
                  <v-chip small :color="selectedUser.isActive ? 'success' : 'error'" text-color="white">
                    <v-icon left small>{{ selectedUser.isActive ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                    {{ selectedUser.isActive ? 'Yes' : 'No' }}
                  </v-chip>
                </div>
                <div class="info-item">
                  <span class="info-label">Joined:</span>
                  <span class="info-value">{{ formatDate(selectedUser.createdAt) }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn large class="close-btn" @click="showUserDialog = false">
            <v-icon left>mdi-close</v-icon>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/AdminLayout.vue'

export default {
  name: 'AdminUsers',
  components: {
    AdminLayout
  },
  data() {
    return {
      loading: false,
      users: [],
      selectedUser: null,
      showUserDialog: false,
      roleFilter: null,
      userStats: {
        ordersCount: 0,
        totalSpent: 0,
        reviewsCount: 0
      },
      roleOptions: [
        { text: 'Admin', value: 'ADMIN' },
        { text: 'User', value: 'USER' }
      ],
      headers: [
        { text: 'Avatar', value: 'avatar', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role' },
        { text: 'Verified', value: 'isVerified' },
        { text: 'Joined', value: 'createdAt' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  async created() {
    await this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        const params = {}
        if (this.roleFilter) {
          params.role = this.roleFilter
        }
        
        const response = await this.$http.get('/admin/users', { params })
        this.users = response.data?.users || []
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to fetch users',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async toggleUserRole(user) {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
      const action = newRole === 'ADMIN' ? 'promote to admin' : 'remove admin privileges'
      
      if (confirm(`Are you sure you want to ${action} for ${user.name}?`)) {
        try {
          await this.$http.patch(`/admin/users/${user.id}/role`, { role: newRole })
          this.$store.dispatch('ui/showSnackbar', {
            message: 'User role updated successfully!',
            color: 'success'
          })
          await this.fetchUsers()
        } catch (error) {
          this.$store.dispatch('ui/showSnackbar', {
            message: 'Failed to update user role',
            color: 'error'
          })
        }
      }
    },

    async viewUser(user) {
      this.selectedUser = user
      this.showUserDialog = true
      
      // Reset stats
      this.userStats = {
        ordersCount: 0,
        totalSpent: 0,
        reviewsCount: 0
      }
      
      // Fetch user statistics
      await this.fetchUserStats(user.id || user._id)
    },
    
    async fetchUserStats(userId) {
      try {
        // Fetch user's orders to calculate statistics
        const response = await this.$http.get('/orders', {
          params: { userId }
        })
        
        const userOrders = response.data?.orders || []
        
        this.userStats.ordersCount = userOrders.length
        this.userStats.totalSpent = userOrders.reduce((sum, order) => {
          return sum + (order.total || 0)
        }, 0)
        
        // If you have a reviews endpoint, fetch reviews count
        // For now, we'll leave it at 0 unless you have this data
      } catch (error) {
        console.error('Error fetching user stats:', error)
        // Keep stats at 0 if fetch fails
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    getUserImage(user) {
      if (!user.profileImage) return ''
      if (user.profileImage.startsWith('/uploads/')) {
        return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${user.profileImage}`
      }
      return user.profileImage
    }
  }
}
</script>

<style scoped>
.users-content {
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

.users-table {
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

.header-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.gradient-text {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.header-info {
  flex: 1;
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

.role-chip {
  font-weight: 700;
  padding: 20px 16px;
}

.dialog-content {
  padding: 32px !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 8px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.03), rgba(118, 75, 162, 0.03));
  border: 1px solid rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.purple-gradient { background: linear-gradient(135deg, #0ea5e9, #06b6d4); }
.green-gradient { background: linear-gradient(135deg, #43e97b, #38f9d7); }
.blue-gradient { background: linear-gradient(135deg, #4facfe, #00f2fe); }

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.info-section {
  padding: 0;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(14, 165, 233, 0.08);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #64748b;
  font-size: 0.9rem;
}

.info-value {
  font-weight: 600;
  color: #1e293b;
}

.dialog-actions {
  padding: 20px 32px !important;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.02), rgba(118, 75, 162, 0.02));
  border-top: 1px solid rgba(14, 165, 233, 0.1);
}

.close-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
  color: white !important;
  text-transform: none;
  font-weight: 700;
  border-radius: 12px;
  padding: 0 32px;
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
    flex-direction: column;
    text-align: center;
  }

  .dialog-content {
    padding: 24px !important;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
