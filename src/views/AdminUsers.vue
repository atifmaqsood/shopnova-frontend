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

    <!-- User Details Dialog -->
    <v-dialog v-model="showUserDialog" max-width="600px">
      <v-card v-if="selectedUser">
        <v-card-title>
          User Details
          <v-spacer />
          <v-chip
            :color="selectedUser.role === 'ADMIN' ? 'red' : 'primary'"
            text-color="white"
          >
            {{ selectedUser.role }}
          </v-chip>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-avatar size="80" color="primary">
                <v-img v-if="selectedUser.profileImage" :src="getUserImage(selectedUser)" />
                <span v-else class="white--text text-h4">
                  {{ selectedUser.name.charAt(0).toUpperCase() }}
                </span>
              </v-avatar>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" md="6">
              <h4>Personal Information</h4>
              <p><strong>Name:</strong> {{ selectedUser.name }}</p>
              <p><strong>Email:</strong> {{ selectedUser.email }}</p>
              <p><strong>Phone:</strong> {{ selectedUser.phone || 'Not provided' }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <h4>Account Status</h4>
              <p><strong>Role:</strong> {{ selectedUser.role }}</p>
              <p><strong>Verified:</strong> 
                <v-icon :color="selectedUser.isVerified ? 'green' : 'red'" small>
                  {{ selectedUser.isVerified ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
                {{ selectedUser.isVerified ? 'Yes' : 'No' }}
              </p>
              <p><strong>Active:</strong> 
                <v-icon :color="selectedUser.isActive ? 'green' : 'red'" small>
                  {{ selectedUser.isActive ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
                {{ selectedUser.isActive ? 'Yes' : 'No' }}
              </p>
              <p><strong>Joined:</strong> {{ formatDate(selectedUser.createdAt) }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showUserDialog = false">Close</v-btn>
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

    viewUser(user) {
      this.selectedUser = user
      this.showUserDialog = true
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

.users-table {
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