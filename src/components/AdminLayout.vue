<template>
  <v-app class="admin-app">
    <!-- Mobile Sidebar Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      width="280"
      class="admin-sidebar"
      color="#f8fafc"
    >
      <div class="sidebar-header pa-6">
        <div class="logo-group">
          <div class="logo-sq">
            <v-icon color="white">mdi-shield-crown</v-icon>
          </div>
          <div class="ml-3">
            <div class="logo-text-admin">Nova<span class="primary--text">Admin</span></div>
            <div class="logo-subtext">PLATFORM VERSION 2.0</div>
          </div>
        </div>
      </div>

      <v-list nav class="px-4">
        <v-list-item-group v-model="activeMenu" color="primary">
          <div v-for="(group, gIdx) in menuGroups" :key="gIdx" class="mb-6">
            <div class="px-4 mb-2 text-caption font-weight-black grey--text text-uppercase letter-spacing-2">
              {{ group.title }}
            </div>
            
            <v-list-item
              v-for="item in group.items"
              :key="item.name"
              :to="item.to"
              exact
              class="nav-item mb-1"
            >
              <v-list-item-icon class="mr-4">
                <v-icon size="20">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="nav-title">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-card flat class="user-card-mini rounded-xl pa-3 bg-white border">
            <div class="d-flex align-center">
              <v-avatar size="40" class="gradient-primary mr-3">
                <span class="white--text font-weight-bold text-subtitle-1">{{ (user?.name || 'A')[0].toUpperCase() }}</span>
              </v-avatar>
              <div class="overflow-hidden">
                <div class="text-subtitle-2 font-weight-black text-truncate">{{ user?.name || 'Admin' }}</div>
                <div class="text-caption grey--text text-truncate">System Administrator</div>
              </div>
              <v-spacer />
              <v-btn icon x-small @click="logout" color="error">
                <v-icon small>mdi-logout</v-icon>
              </v-btn>
            </div>
          </v-card>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Desktop Sidebar (Permanent) -->
    <v-navigation-drawer
      app
      permanent
      width="280"
      class="admin-sidebar d-none d-lg-block border-right"
      floating
    >
      <div class="sidebar-header pa-8">
        <div class="logo-group">
          <div class="logo-sq pulse-glow">
            <v-icon color="white">mdi-shield-crown</v-icon>
          </div>
          <div class="ml-4">
            <div class="logo-text-admin">Nova<span class="primary--text">Admin</span></div>
            <div class="logo-subtext">CONTROL CENTER</div>
          </div>
        </div>
      </div>

      <v-list nav class="px-6">
        <div v-for="(group, gIdx) in menuGroups" :key="gIdx" class="mb-8">
          <div class="px-4 mb-3 text-caption font-weight-black grey--text text-uppercase letter-spacing-2" style="font-size: 0.7rem !important;">
            {{ group.title }}
          </div>
          
          <v-list-item
            v-for="item in group.items"
            :key="item.name"
            :to="item.to"
            exact
            class="nav-item mb-2"
          >
            <v-list-item-icon class="mr-4">
              <v-icon size="20">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="nav-title">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>

      <template v-slot:append>
        <div class="pa-6">
          <v-card flat class="user-card-mini rounded-xl pa-4 bg-white border-light soft-shadow">
            <div class="d-flex align-center">
              <v-avatar size="44" class="gradient-primary mr-3 elevation-4">
                <span class="white--text font-weight-bold">{{ (user?.name || 'A')[0].toUpperCase() }}</span>
              </v-avatar>
              <div class="overflow-hidden">
                <div class="text-subtitle-1 font-weight-black text-truncate" style="line-height: 1.2">{{ user?.name || 'Admin' }}</div>
                <div class="text-caption grey--text text-truncate">Power User</div>
              </div>
              <v-spacer />
              <v-menu top left offset-y offset-x>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" small color="grey darken-1">
                    <v-icon small>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense class="rounded-lg pa-2">
                  <v-list-item @click="logout" class="rounded-md">
                    <v-list-item-icon class="mr-2"><v-icon small color="error">mdi-logout</v-icon></v-list-item-icon>
                    <v-list-item-title class="error--text font-weight-bold">Logout</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Header Tools (Mobile Only) -->
    <v-app-bar 
      app 
      flat 
      color="white" 
      class="d-lg-none border-bottom"
      height="72"
    >
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title class="font-weight-black">NovaAdmin</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="admin-main-bg">
      <div class="admin-page-container">
        <!-- Top Tool Bar (Desktop) -->
        <div class="desktop-top-bar d-none d-lg-flex align-center justify-end mb-8 px-8 pt-4">
          <div class="meta-info d-flex align-center mr-auto">
            <v-chip outlined small class="mr-4 px-3 font-weight-bold">
              <v-icon left x-small color="success">mdi-circle</v-icon>
              Server: Healthy
            </v-chip>
            <div class="text-caption grey--text font-weight-medium d-flex align-center">
              <v-icon x-small class="mr-1">mdi-clock-outline</v-icon>
              Last synced: Just now
            </div>
          </div>
          
          <v-btn icon class="mr-2 grey--text text--darken-1">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon class="mr-2 grey--text text--darken-1">
            <v-badge color="error" dot overlap>
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>
          <v-btn text class="rounded-pill px-4 grey--text text--darken-2 font-weight-bold" @click="$router.push('/')">
            Storefront <v-icon right size="18">mdi-launch</v-icon>
          </v-btn>
        </div>

        <div class="page-content px-4 px-lg-8 pb-12">
          <slot />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AdminLayout',
  data() {
    return {
      drawer: false,
      activeMenu: 0,
      menuGroups: [
        {
          title: 'Management',
          items: [
            { name: 'dashboard', title: 'Analytics', icon: 'mdi-view-dashboard-outline', to: '/admin' },
            { name: 'orders', title: 'Sales & Orders', icon: 'mdi-clipboard-text-outline', to: '/admin/orders' },
            { name: 'users', title: 'Customer List', icon: 'mdi-account-group-outline', to: '/admin/users' }
          ]
        },
        {
          title: 'Catalog',
          items: [
            { name: 'products', title: 'Inventory', icon: 'mdi-package-variant-closed', to: '/admin/products' },
            { name: 'categories', title: 'Collection Tags', icon: 'mdi-tag-outline', to: '/admin/categories' }
          ]
        },
        {
          title: 'Config',
          items: [
            { name: 'settings', title: 'Domain Settings', icon: 'mdi-cog-outline', to: '/admin/settings' }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.admin-app {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  background-color: #f1f5f9 !important;
}

.admin-sidebar {
  border-right: 1px solid rgba(0,0,0,0.05) !important;
}

.sidebar-header {
  padding-bottom: 20px;
}

.logo-group {
  display: flex;
  align-items: center;
}

.logo-sq {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.pulse-glow {
  animation: logo-glow 3s infinite;
}

@keyframes logo-glow {
  0%, 100% { box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3); }
  50% { box-shadow: 0 8px 24px rgba(14, 165, 233, 0.5); }
}

.logo-text-admin {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  line-height: 1;
}

.logo-subtext {
  font-size: 0.65rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 1.5px;
  margin-top: 4px;
}

.nav-item {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  color: #64748b !important;
}

.nav-item:hover {
  background-color: white !important;
  color: #0ea5e9 !important;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.02) !important;
}

.nav-item.v-list-item--active {
  background: white !important;
  color: #0ea5e9 !important;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02) !important;
}

.nav-item.v-list-item--active .v-icon {
  color: #0ea5e9 !important;
}

.nav-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.letter-spacing-2 {
  letter-spacing: 2px;
}

.user-card-mini {
  border: 1px solid rgba(0,0,0,0.05) !important;
  background: white !important;
}

.border-right {
  border-right: 1px solid rgba(0,0,0,0.06) !important;
}

.border-bottom {
  border-bottom: 1px solid rgba(0,0,0,0.06) !important;
}

.soft-shadow {
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05) !important;
}

.gradient-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
}

.admin-main-bg {
  background-color: #f1f5f9;
}

.admin-page-container {
  max-width: 1600px;
  margin: 0 auto;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.1);
}
</style>
