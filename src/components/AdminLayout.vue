<template>
  <v-app class="admin-app">
    <!-- Modern Admin Navbar -->
    <v-app-bar app color="white" flat height="72" class="admin-navbar" elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none" />
      
      <v-toolbar-title class="admin-title">
        <div class="logo-container">
          <v-icon size="32" class="logo-icon">mdi-shield-crown</v-icon>
          <span class="logo-text">ShopNova Admin</span>
        </div>
      </v-toolbar-title>

      <v-spacer />

      <!-- Search Bar -->
      <v-text-field
        placeholder="Search..."
        prepend-inner-icon="mdi-magnify"
        outlined
        dense
        hide-details
        class="search-field d-none d-md-flex mr-4"
        style="max-width: 300px;"
      />

      <!-- Notifications -->
      <v-btn icon class="mr-2">
        <v-badge color="error" dot>
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- Admin User Menu -->
      <v-menu offset-y left transition="slide-y-transition" nudge-bottom="10">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on" class="user-menu-btn">
            <v-avatar size="36" color="gradient-primary" class="mr-2">
              <span class="white--text font-weight-bold">{{ (user?.name || 'A')[0].toUpperCase() }}</span>
            </v-avatar>
            <span class="d-none d-sm-inline user-name">{{ user?.name || 'Admin' }}</span>
            <v-icon right small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-card class="user-menu-card" min-width="260" elevation="8">
          <v-list class="py-0">
            <v-list-item class="user-info-section">
              <v-list-item-avatar size="48" color="gradient-primary">
                <span class="white--text text-h6">{{ (user?.name || 'A')[0].toUpperCase() }}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">{{ user?.name || 'Admin' }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ user?.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item @click="logout" class="logout-item">
              <v-list-item-icon>
                <v-icon color="error">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="error--text font-weight-medium">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Modern Admin Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      width="280"
      class="admin-sidebar"
    >
      <div class="sidebar-content">
        <v-list nav class="admin-nav pt-6">
          <v-list-item
            v-for="item in adminMenuItems"
            :key="item.name"
            :to="item.to"
            exact
            class="nav-item"
          >
            <v-list-item-icon>
              <v-icon :color="item.color || 'primary'">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="nav-title">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>

    <!-- Modern Admin Main Content -->
    <v-main class="admin-main">
      <div class="admin-content">
        <slot />
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
      drawer: true,
      adminMenuItems: [
        {
          name: 'dashboard',
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: '/admin',
          color: '#0ea5e9'
        },
        {
          name: 'products',
          title: 'Products',
          icon: 'mdi-package-variant',
          to: '/admin/products',
          color: '#f093fb'
        },
        {
          name: 'categories',
          title: 'Categories',
          icon: 'mdi-tag',
          to: '/admin/categories',
          color: '#4facfe'
        },
        {
          name: 'orders',
          title: 'Orders',
          icon: 'mdi-clipboard-list',
          to: '/admin/orders',
          color: '#43e97b'
        },
        {
          name: 'users',
          title: 'Users',
          icon: 'mdi-account-group',
          to: '/admin/users',
          color: '#fa709a'
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.admin-app {
  background: #f5f7fa;
  position: relative;
}

.v-app-bar {
  z-index: 6 !important;
}

.admin-navbar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(14, 165, 233, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05) !important;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
}

.logo-icon {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.logo-text {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.search-field {
  border-radius: 12px;
}

.user-menu-btn {
  text-transform: none;
  border-radius: 50px;
  padding: 4px 12px 4px 4px !important;
  transition: all 0.3s ease;
}

.user-menu-btn:hover {
  background: rgba(14, 165, 233, 0.08);
}

.user-name {
  font-weight: 600;
  color: #2d3748;
  margin: 0 4px;
}

.user-menu-card {
  border-radius: 16px !important;
  overflow: hidden;
  margin-top: 8px;
}

.user-info-section {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  padding: 16px !important;
  min-height: 80px;
}

.user-info-section .v-list-item__title,
.user-info-section .v-list-item__subtitle {
  color: white !important;
}

.logout-item {
  transition: all 0.3s ease;
  min-height: 48px;
}

.logout-item:hover {
  background: rgba(244, 67, 54, 0.05);
}

.admin-sidebar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(14, 165, 233, 0.1);
  box-shadow: 4px 0 30px rgba(0, 0, 0, 0.05);
}

.sidebar-content {
  height: 100%;
  position: relative;
}

.admin-nav {
  padding: 0 16px;
}

.nav-item {
  border-radius: 16px;
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  border-radius: 0 4px 4px 0;
  transition: height 0.3s ease;
  opacity: 0;
}

.nav-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.nav-item:hover::before {
  opacity: 0.08;
}

.nav-item.v-list-item--active {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  transform: translateX(4px);
}

.nav-item.v-list-item--active .v-list-item__icon {
  margin-right: 16px !important;
  transition: transform 0.3s ease;
}

.nav-item:hover .v-list-item__icon,
.nav-item.v-list-item--active .v-list-item__icon {
  transform: scale(1.1) rotate(5deg);
}

.nav-item.v-list-item--active .v-icon {
  color: white !important;
}

.nav-title {
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: -0.2px;
}

.nav-item.v-list-item--active .nav-title {
  font-weight: 700;
  color: white !important;
}

.admin-main {
  background: transparent;
  position: relative;
  z-index: 1;
}

.admin-content {
  padding: 32px;
  min-height: calc(100vh - 72px);
}

@media (max-width: 960px) {
  .admin-sidebar {
    width: 260px !important;
  }
  
  .admin-content {
    padding: 20px;
  }
}

@media (max-width: 600px) {
  .admin-content {
    padding: 16px;
  }
}

/* Gradient color class */
.gradient-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
}
</style>
