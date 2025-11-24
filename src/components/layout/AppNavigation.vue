<template>
  <div>
    <!-- Top Bar -->
    <v-app-bar 
      app 
      color="white" 
      flat 
      height="80" 
      class="navbar-modern" 
      elevate-on-scroll
      elevation="0"
    >
      <v-container class="d-flex align-center py-0" fluid>
        <!-- Mobile Menu -->
        <v-app-bar-nav-icon 
          @click="$store.dispatch('ui/toggleDrawer')" 
          class="d-lg-none"
          color="primary"
        />
        
        <!-- Logo -->
        <v-toolbar-title class="mr-6">
          <router-link to="/" class="text-decoration-none d-flex align-center logo-wrapper">
            <div class="logo-icon-wrapper">
              <v-icon color="white" size="32">mdi-shopping</v-icon>
            </div>
            <div class="logo-text ml-3">
              <span class="logo-title">ShopNova</span>
              <span class="logo-subtitle d-none d-md-block">Your Shopping Paradise</span>
            </div>
          </router-link>
        </v-toolbar-title>

        <!-- Desktop Navigation -->
        <div class="d-none d-lg-flex align-center nav-links">
          <v-btn text class="nav-btn mx-1" @click="$router.push('/')">
            <v-icon left small>mdi-home</v-icon>
            Home
          </v-btn>
          <v-btn text class="nav-btn mx-1" @click="$router.push('/products')">
            <v-icon left small>mdi-shopping</v-icon>
            Products
          </v-btn>
          <v-menu offset-y max-height="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text class="nav-btn mx-1" v-bind="attrs" v-on="on">
                <v-icon left small>mdi-tag-multiple</v-icon>
                Categories
                <v-icon right small>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list class="category-dropdown">
              <v-list-item
                v-for="category in (categories || [])"
                :key="category.id"
                @click="filterByCategory(category.id)"
                class="category-item"
              >
                <v-list-item-icon>
                  <v-icon small color="primary">mdi-tag</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ category.name }}</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="$router.push('/categories')" class="category-item">
                <v-list-item-icon>
                  <v-icon small color="primary">mdi-view-grid</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="primary--text font-weight-medium">View All Categories</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- Search Bar -->
        <v-form @submit.prevent="search" class="search-container-modern mx-4 d-none d-lg-flex">
          <div class="search-box-modern">
            <v-icon class="search-icon-modern">mdi-magnify</v-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="search-input-modern"
              @keyup.enter="search"
            />
            <v-btn
              v-if="searchQuery"
              icon
              x-small
              class="clear-btn-modern"
              @click="searchQuery = ''"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-form>

        <v-spacer />

        <!-- Action Buttons -->
        <div class="d-flex align-center ml-2">
          <!-- Cart -->
          <v-btn icon class="mx-1" @click="$router.push('/cart')" v-if="isAuthenticated">
            <v-badge :content="cartItemCount" :value="cartItemCount > 0" color="red" overlap>
              <v-icon>mdi-cart-outline</v-icon>
            </v-badge>
          </v-btn>

          <!-- Notifications -->
          <v-btn icon class="mx-1" @click="viewNotifications" v-if="isAuthenticated">
            <v-badge :content="unreadCount" :value="unreadCount > 0" color="red" overlap>
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>

          <!-- User Menu -->
          <v-menu offset-y v-if="isAuthenticated">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon class="mx-1" v-bind="attrs" v-on="on">
                <v-avatar size="32">
                  <v-img :src="getUserImage()" />
                </v-avatar>
              </v-btn>
            </template>
            <v-card min-width="200">
              <v-list dense>
                <v-list-item @click="$router.push('/account')">
                  <v-list-item-icon>
                    <v-icon small>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>My Account</v-list-item-title>
                </v-list-item>
                <v-list-item @click="$router.push('/orders')">
                  <v-list-item-icon>
                    <v-icon small>mdi-package-variant</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Orders</v-list-item-title>
                </v-list-item>
                <v-list-item @click="$router.push('/admin')" v-if="isAdmin">
                  <v-list-item-icon>
                    <v-icon small>mdi-shield-crown</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Admin Panel</v-list-item-title>
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

          <!-- Login/Register -->
          <div v-else class="d-none d-sm-flex">
            <v-btn outlined color="primary" small class="mr-2" @click="$router.push('/login')">Login</v-btn>
            <v-btn color="primary" small @click="$router.push('/register')">Register</v-btn>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawerOpen"
      app
      temporary
      width="300"
      class="modern-drawer"
      style="z-index: 1002 !important;"
    >
      <div class="drawer-header pa-4">
        <h3 class="white--text font-weight-bold">ShopNova</h3>
      </div>
      
      <!-- Mobile Search -->
      <div class="pa-4">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search products..."
          outlined
          dense
          hide-details
          prepend-inner-icon="mdi-magnify"
          @keyup.enter="search"
          class="mobile-search"
        >
          <template v-slot:append v-if="searchQuery">
            <v-btn icon x-small @click="searchQuery = ''">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
      
      <v-divider />
      
      <v-list nav class="py-0">
        <v-list-item @click="$router.push('/')" class="nav-item">
          <v-list-item-icon>
            <v-icon color="primary">mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="font-weight-medium">Home</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$router.push('/products')" class="nav-item">
          <v-list-item-icon>
            <v-icon color="primary">mdi-shopping</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="font-weight-medium">Products</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2" />

        <v-subheader class="text-uppercase font-weight-bold grey--text">Categories</v-subheader>
        <v-list-item
          v-for="category in (categories || []).slice(0, 6)"
          :key="category.id"
          @click="filterByCategory(category.id)"
          class="category-item"
        >
          <v-list-item-icon>
            <v-icon size="20" color="grey">mdi-tag</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="font-weight-regular">{{ category.name }}</v-list-item-title>
        </v-list-item>
        
        <v-list-item v-if="categories && categories.length > 6" @click="$router.push('/categories'); $store.dispatch('ui/toggleDrawer')" class="category-item">
          <v-list-item-icon>
            <v-icon size="20" color="primary">mdi-view-grid</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="font-weight-medium primary--text">View All Categories</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2" v-if="isAuthenticated" />
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppNavigation',
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated',
      isAdmin: 'auth/isAdmin',
      user: 'auth/user',
      cartItemCount: 'cart/itemCount',
      unreadCount: 'notifications/unreadCount',
      categories: 'categories/categories',
      drawer: 'ui/drawer'
    }),
    drawerOpen: {
      get() {
        return this.drawer
      },
      set(value) {
        if (value !== this.drawer) {
          this.$store.dispatch('ui/toggleDrawer')
        }
      }
    }
  },
  methods: {
    search() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          name: 'Products',
          query: { search: this.searchQuery.trim() }
        })
        // Close drawer on mobile after search
        if (this.drawer) {
          this.$store.dispatch('ui/toggleDrawer')
        }
      }
    },
    filterByCategory(categoryId) {
      this.$router.push({
        name: 'Products',
        query: { categoryId }
      })
      this.$store.dispatch('ui/toggleDrawer')
    },
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    },
    viewNotifications() {
      if (this.$route.path !== '/notifications') {
        this.$router.push('/notifications').catch(() => {})
      }
    },
    getUserImage() {
      const profileImage = this.user?.profileImage
      if (!profileImage) {
        return require('@/assets/avatar2.jpg')
      }
      if (profileImage.startsWith('/uploads/')) {
        return `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}${profileImage}`
      }
      if (profileImage.startsWith('http')) {
        return profileImage
      }
      return require('@/assets/avatar2.jpg')
    }
  }
}
</script>

<style scoped>
/* Modern Navbar */
.navbar-modern {
  box-shadow: 0 2px 20px rgba(0,0,0,0.08) !important;
  border-bottom: 1px solid #e8eaed;
  z-index: 1001 !important;
  background: white !important;
}

/* Logo Styles */
.logo-wrapper {
  transition: transform 0.2s ease;
}

.logo-wrapper:hover {
  transform: translateY(-2px);
}

.logo-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  transition: all 0.3s ease;
}

.logo-wrapper:hover .logo-icon-wrapper {
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
  transform: scale(1.05);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.logo-subtitle {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-top: -2px;
}

/* Navigation Buttons */
.nav-links {
  gap: 4px;
}

.nav-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
  color: #475569 !important;
}

.nav-btn:hover {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%) !important;
  color: #0ea5e9 !important;
}

/* Category Dropdown */
.category-dropdown {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  max-height: 400px;
  overflow-y: auto;
}

.category-dropdown::-webkit-scrollbar {
  width: 6px;
}

.category-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.category-dropdown::-webkit-scrollbar-thumb {
  background: #0ea5e9;
  border-radius: 3px;
}

.category-dropdown::-webkit-scrollbar-thumb:hover {
  background: #0284c7;
}

.category-item {
  transition: background 0.2s ease;
}

.category-item:hover {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);
}

/* Modern Search Bar */
.search-container-modern {
  max-width: 500px;
  width: 100%;
}

.search-box-modern {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  height: 48px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-box-modern:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.search-box-modern:focus-within {
  border-color: #0ea5e9;
  background: white;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.search-icon-modern {
  color: #64748b;
  margin-right: 12px;
  flex-shrink: 0;
}

.search-input-modern {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1e293b;
  background: transparent;
  font-weight: 500;
  min-width: 0;
}

.search-input-modern::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.clear-btn-modern {
  flex-shrink: 0;
  margin-left: 8px;
}

/* Drawer Styles */
.modern-drawer {
  border-right: 1px solid #e0e0e0;
  z-index: 1002 !important;
}

.drawer-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
}

.mobile-search >>> .v-input__slot {
  border-radius: 8px !important;
}

.mobile-search >>> fieldset {
  border-color: #e0e0e0 !important;
}

.mobile-search >>> .v-input__slot:hover fieldset {
  border-color: #0ea5e9 !important;
}

.nav-item:hover {
  background-color: rgba(14, 165, 233, 0.08);
}

/* Responsive Design */
@media (max-width: 1264px) {
  .search-container-modern {
    max-width: 400px;
  }
  
  .logo-title {
    font-size: 1.3rem;
  }
  
  .logo-subtitle {
    font-size: 0.65rem;
  }
}

@media (max-width: 960px) {
  .navbar-modern {
    height: 70px !important;
  }
  
  .search-container-modern {
    max-width: 300px;
  }
  
  .logo-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .logo-title {
    font-size: 1.2rem;
  }
  
  .logo-subtitle {
    display: none !important;
  }
}

@media (max-width: 600px) {
  .navbar-modern {
    height: 64px !important;
  }
  
  .logo-icon-wrapper {
    width: 36px;
    height: 36px;
  }
  
  .logo-icon-wrapper v-icon {
    font-size: 24px !important;
  }
  
  .logo-title {
    font-size: 1.1rem;
  }
  
  .logo-subtitle {
    display: none !important;
  }
}
</style>
```