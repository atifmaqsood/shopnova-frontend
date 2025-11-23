<template>
  <v-app class="admin-app">
    <!-- Admin Navbar -->
    <v-app-bar app color="white" flat height="64" class="admin-navbar">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none" />
      
      <v-toolbar-title class="admin-title">
        <v-icon color="primary" size="28" class="mr-2">mdi-shield-crown</v-icon>
        <span class="primary--text font-weight-bold">ShopNova Admin</span>
      </v-toolbar-title>

      <v-spacer />

      <!-- Admin User Menu -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-card min-width="200">
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">{{ user?.name || 'Admin' }}</v-list-item-title>
                <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item @click="logout">
              <v-list-item-icon>
                <v-icon small color="error">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="error--text">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Admin Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      width="280"
      class="admin-sidebar"
    >
      <v-list nav class="admin-nav pt-4">
        <v-list-item
          v-for="item in adminMenuItems"
          :key="item.name"
          :to="item.to"
          exact
          class="nav-item"
        >
          <v-list-item-icon>
            <v-icon color="primary">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Admin Main Content -->
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
          to: '/admin'
        },
        {
          name: 'products',
          title: 'Products',
          icon: 'mdi-package-variant',
          to: '/admin/products'
        },
        {
          name: 'categories',
          title: 'Categories',
          icon: 'mdi-tag',
          to: '/admin/categories'
        },
        {
          name: 'orders',
          title: 'Orders',
          icon: 'mdi-clipboard-list',
          to: '/admin/orders'
        },
        {
          name: 'users',
          title: 'Users',
          icon: 'mdi-account-group',
          to: '/admin/users'
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
.admin-app {
  background: #f5f5f5;
}

.admin-navbar {
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-title {
  display: flex;
  align-items: center;
}

.admin-sidebar {
  background: #ffffff !important;
  border-right: 1px solid #e0e0e0;
}

.admin-nav {
  padding: 0 12px;
}

.nav-item {
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: rgba(25, 118, 210, 0.08);
}

.nav-item.v-list-item--active {
  background-color: rgba(25, 118, 210, 0.12);
  color: #1976d2;
}

.nav-item.v-list-item--active .v-list-item__icon {
  color: #1976d2 !important;
}

.admin-main {
  background: #f5f5f5;
}

.admin-content {
  padding: 24px;
  min-height: calc(100vh - 64px);
}

@media (max-width: 960px) {
  .admin-sidebar {
    width: 260px !important;
  }
  
  .admin-content {
    padding: 16px;
  }
}
</style>