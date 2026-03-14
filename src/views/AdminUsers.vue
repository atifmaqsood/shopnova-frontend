<template>
  <AdminLayout>
    <div class="admin-users-view">
      <!-- Premium Page Header -->
      <div class="page-header mb-10">
        <v-row align="end" no-gutters>
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <v-btn icon color="primary" @click="$router.go(-1)" class="mr-2">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <span class="text-overline font-weight-black primary--text letter-spacing-2">ACCESS MANAGEMENT</span>
            </div>
            <h1 class="text-h3 font-weight-black mb-2">Customer Base</h1>
            <p class="grey--text text-subtitle-1 mb-0">Manage platform users, coordinate roles, and monitor engagement metrics.</p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right mt-6 mt-md-0">
            <div class="d-flex align-center justify-md-end gap-3">
              <v-btn outlined color="primary" rounded class="px-6 font-weight-bold" @click="fetchUsers">
                <v-icon left>mdi-refresh</v-icon> Sync Directory
              </v-btn>
              <v-btn color="primary" x-large rounded elevation="8" class="px-8 font-weight-black">
                <v-icon left size="24">mdi-account-plus-outline</v-icon> Add Operator
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Filters & Active Sessions Stats -->
      <v-row class="mb-8">
        <v-col cols="12" lg="8">
          <v-card class="rounded-xl border-light pa-4 soft-shadow bg-white d-flex align-center">
            <v-text-field
              v-model="search"
              placeholder="Search by name, email, or verified status..."
              prepend-inner-icon="mdi-magnify"
              outlined
              dense
              hide-details
              class="rounded-lg flex-grow-1 mr-4"
            />
            <v-select
              v-model="roleFilter"
              :items="roleOptions"
              placeholder="Filter Role"
              outlined
              dense
              hide-details
              clearable
              style="max-width: 180px;"
              class="rounded-lg mr-4"
              @change="fetchUsers"
            />
            <v-btn icon color="primary" class="bg-primary-light">
              <v-icon>mdi-tune-variant</v-icon>
            </v-btn>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4">
          <v-card class="rounded-xl border-light pa-4 soft-shadow bg-white d-flex align-center h-100">
            <div class="px-4 border-right">
              <div class="text-h4 font-weight-black primary--text">{{ users.length }}</div>
              <div class="text-caption font-weight-bold grey--text text-uppercase">Total Profiles</div>
            </div>
            <div class="px-4">
              <div class="text-h4 font-weight-black success--text">{{ users.filter(u => u.isVerified).length }}</div>
              <div class="text-caption font-weight-bold grey--text text-uppercase">Verified</div>
            </div>
            <v-spacer />
            <v-avatar color="primary lighten-5" size="48">
              <v-icon color="primary">mdi-shield-account-outline</v-icon>
            </v-avatar>
          </v-card>
        </v-col>
      </v-row>

      <!-- Users Data Table -->
      <v-card class="rounded-xl border-light soft-shadow overflow-hidden">
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          :search="search"
          :items-per-page="10"
          class="bg-white premium-table"
        >
          <!-- User Profile Column -->
          <template slot="item.name" slot-scope="{ item }">
            <div class="d-flex align-center py-3">
              <v-avatar size="44" :class="item.role === 'ADMIN' ? 'gradient-coral shadow-sm' : 'gradient-primary shadow-sm'" class="mr-4">
                <v-img v-if="item.profileImage" :src="getUserImage(item)" />
                <span v-else class="white--text font-weight-black">{{ item.name.charAt(0).toUpperCase() }}</span>
              </v-avatar>
              <div>
                <div class="font-weight-black text-body-1">{{ item.name }}</div>
                <div class="text-caption grey--text">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <!-- Role Column -->
          <template slot="item.role" slot-scope="{ item }">
            <v-chip
              :color="item.role === 'ADMIN' ? 'error' : 'primary'"
              small
              label
              outlined
              class="font-weight-black px-3"
            >
              <v-icon left x-small>{{ item.role === 'ADMIN' ? 'mdi-crown-outline' : 'mdi-account-outline' }}</v-icon>
              {{ item.role }}
            </v-chip>
          </template>

          <!-- Status Column -->
          <template slot="item.isVerified" slot-scope="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" :color="item.isVerified ? 'success' : 'grey lighten-1'">
                  {{ item.isVerified ? 'mdi-check-decagram' : 'mdi-decagram-outline' }}
                </v-icon>
              </template>
              <span>{{ item.isVerified ? 'Identity Verified' : 'Pending Verification' }}</span>
            </v-tooltip>
          </template>

          <!-- Joined Column -->
          <template slot="item.createdAt" slot-scope="{ item }">
            <div class="text-body-2 grey--text font-weight-medium">
              {{ formatDate(item.createdAt) }}
            </div>
          </template>

          <!-- Actions Column -->
          <template slot="item.actions" slot-scope="{ item }">
            <div class="d-flex">
              <v-btn icon color="primary" class="bg-primary-light mr-2" @click="viewUser(item)">
                <v-icon small>mdi-account-search-outline</v-icon>
              </v-btn>
              <v-menu offset-y left transition="slide-y-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" class="bg-grey-light">
                    <v-icon small>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list dense class="rounded-lg pa-2">
                  <v-list-item @click="toggleUserRole(item)" class="rounded-md">
                    <v-list-item-icon class="mr-2">
                      <v-icon small :color="item.role === 'ADMIN' ? 'primary' : 'error'">
                        {{ item.role === 'ADMIN' ? 'mdi-account-arrow-left' : 'mdi-shield-star' }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="font-weight-bold text-caption">
                      {{ item.role === 'ADMIN' ? 'REVOKE ADMIN' : 'PROMOTE TO ADMIN' }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider class="my-2" />
                  <v-list-item class="rounded-md">
                    <v-list-item-icon class="mr-2"><v-icon small color="error">mdi-account-off-outline</v-icon></v-list-item-icon>
                    <v-list-item-title class="error--text font-weight-bold text-caption">SUSPEND PROFILE</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Enhanced User Profile Dialog -->
    <v-dialog v-model="showUserDialog" max-width="800px" scrollable>
      <v-card v-if="selectedUser" class="rounded-xl overflow-hidden">
        <v-toolbar flat dark class="gradient-primary pa-6 h-auto" height="160">
          <v-avatar size="96" class="border-4 white elevation-4 mr-8">
            <v-img v-if="selectedUser.profileImage" :src="getUserImage(selectedUser)" />
            <span v-else class="primary--text text-h3 font-weight-black">{{ selectedUser.name.charAt(0).toUpperCase() }}</span>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="d-flex align-center mb-1">
              <h2 class="text-h4 font-weight-black mr-4">{{ selectedUser.name }}</h2>
              <v-chip v-if="selectedUser.role === 'ADMIN'" x-small color="amber lighten-4" light class="font-weight-black coral--text">ADMINISTRATOR</v-chip>
            </div>
            <div class="d-flex align-center opacity-80">
              <v-icon x-small class="mr-2">mdi-email-outline</v-icon>
              <span class="text-body-1">{{ selectedUser.email }}</span>
            </div>
            <div class="mt-4">
              <v-chip x-small color="white" light class="px-3">Member since {{ formatDate(selectedUser.createdAt) }}</v-chip>
            </div>
          </div>
          <v-btn icon @click="showUserDialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text class="pa-8">
          <div class="text-caption font-weight-black grey--text text-uppercase letter-spacing-2 mb-6">Interaction Intelligence</div>
          <v-row class="mb-8">
            <v-col cols="4">
              <v-card flat class="rounded-xl border-light pa-6 text-center shadow-sm">
                <div class="text-h4 font-weight-black mb-1">{{ userStats.ordersCount || 0 }}</div>
                <div class="text-caption grey--text font-weight-bold">Total Orders</div>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card flat class="rounded-xl border-light pa-6 text-center shadow-sm">
                <div class="text-h4 font-weight-black success--text mb-1">${{ (userStats.totalSpent || 0).toLocaleString() }}</div>
                <div class="text-caption grey--text font-weight-bold">LTV (Life Time Value)</div>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card flat class="rounded-xl border-light pa-6 text-center shadow-sm">
                <div class="text-h4 font-weight-black primary--text mb-1">{{ (userStats.ordersCount ? (userStats.totalSpent / userStats.ordersCount) : 0).toFixed(0) }}</div>
                <div class="text-caption grey--text font-weight-bold">Avg. Order Value</div>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <div class="text-caption font-weight-black grey--text text-uppercase letter-spacing-2 mb-4">Profile Data</div>
              <v-list dense class="pa-0">
                <v-list-item class="px-0 py-2 border-bottom-light">
                  <v-list-item-content><v-list-item-title class="grey--text font-weight-bold">Status</v-list-item-title></v-list-item-content>
                  <v-list-item-action>
                    <v-chip x-small :color="selectedUser.isActive ? 'success' : 'error'" class="font-weight-black text-uppercase">{{ selectedUser.isActive ? 'Active' : 'Banned' }}</v-chip>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item class="px-0 py-2 border-bottom-light">
                  <v-list-item-content><v-list-item-title class="grey--text font-weight-bold">Trust Score</v-list-item-title></v-list-item-content>
                  <v-list-item-action>
                    <v-rating :value="selectedUser.isVerified ? 5 : 2" color="amber darken-2" dense small readonly />
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6" class="pl-md-8">
              <div class="text-caption font-weight-black grey--text text-uppercase letter-spacing-2 mb-4">Contact Gateway</div>
              <v-btn block x-large outlined color="primary" class="rounded-xl font-weight-black mb-4">
                <v-icon left>mdi-message-outline</v-icon> INITIATE CHAT
              </v-btn>
              <v-btn block x-large outlined color="grey darken-2" class="rounded-xl font-weight-black">
                <v-icon left>mdi-email-send-outline</v-icon> SEND BROADCAST
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-8 bg-white border-top">
          <v-btn x-large text rounded class="px-8 font-weight-bold grey--text" @click="showUserDialog = false">Dismiss Window</v-btn>
          <v-spacer />
          <v-btn x-large color="error" outlined rounded class="px-10 font-weight-black mr-4">
            <v-icon left>mdi-alert-octagon-outline</v-icon> FLAG ACCOUNT
          </v-btn>
          <v-btn x-large color="primary" rounded elevation="12" class="px-12 font-weight-black">
            EDIT PROFILE
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
  components: { AdminLayout },
  data() {
    return {
      search: '',
      loading: false,
      users: [],
      selectedUser: null,
      showUserDialog: false,
      roleFilter: null,
      userStats: { ordersCount: 0, totalSpent: 0 },
      roleOptions: [{ text: 'Admin Account', value: 'ADMIN' }, { text: 'Customer Profile', value: 'USER' }],
      headers: [
        { text: 'Identification', value: 'name', align: 'start' },
        { text: 'Role Tier', value: 'role' },
        { text: 'Verification', value: 'isVerified', align: 'center' },
        { text: 'Onboarding Date', value: 'createdAt' },
        { text: 'Management Control', value: 'actions', align: 'end', sortable: false }
      ]
    }
  },
  async created() { await this.fetchUsers() },
  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        const params = this.roleFilter ? { role: this.roleFilter } : {}
        const response = await this.$http.get('/admin/users', { params })
        this.users = response.data?.users || []
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', { message: 'User directory connection error.', color: 'error' })
      } finally { this.loading = false }
    },
    async toggleUserRole(user) {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
      if (confirm(`Change clearance level for ${user.name} to ${newRole}?`)) {
        try {
          await this.$http.patch(`/admin/users/${user.id}/role`, { role: newRole })
          this.$store.dispatch('ui/showSnackbar', { message: 'Security privileges updated.', color: 'success' })
          await this.fetchUsers()
        } catch (error) {
          this.$store.dispatch('ui/showSnackbar', { message: 'Permission update failed.', color: 'error' })
        }
      }
    },
    async viewUser(user) {
      this.selectedUser = user
      this.showUserDialog = true
      this.userStats = { ordersCount: 0, totalSpent: 0 }
      try {
        const response = await this.$http.get('/orders', { params: { userId: user.id || user._id } })
        const orders = response.data?.orders || []
        this.userStats.ordersCount = orders.length
        this.userStats.totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0)
      } catch (e) { /* silent stats fail */ }
    },
    getUserImage(user) {
      if (user.profileImage?.startsWith('/uploads/')) return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${user.profileImage}`
      return user.profileImage || ''
    },
    formatDate(date) { return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  }
}
</script>

<style scoped>
.admin-users-view {
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.border-light { border: 1px solid rgba(0,0,0,0.06) !important; }
.border-bottom-light { border-bottom: 1px solid rgba(0,0,0,0.05) !important; }
.border-right { border-right: 1px solid rgba(0,0,0,0.06) !important; }
.soft-shadow { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04) !important; }

.premium-table >>> th {
  background-color: #f8fafc !important;
  color: #64748b !important;
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  font-weight: 800 !important;
  letter-spacing: 1px;
  height: 60px !important;
}

.premium-table >>> td {
  height: 72px !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

.bg-primary-light { background-color: rgba(14, 165, 233, 0.08) !important; }
.bg-grey-light { background-color: rgba(100, 116, 139, 0.08) !important; }

.gradient-primary { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important; }
.gradient-coral { background: linear-gradient(135deg, #fb7185 0%, #e11d48 100%) !important; }
.coral--text { color: #e11d48 !important; }

.shadow-sm { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important; }
.letter-spacing-2 { letter-spacing: 2px; }
.opacity-80 { opacity: 0.8; }
.border-4 { border: 4px solid white !important; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
