<template>
  <div>
    <!-- Top Bar -->
    <v-app-bar 
      app 
      color="rgba(255, 255, 255, 0.8)" 
      flat 
      height="80" 
      class="navbar-premium" 
    >
      <v-container class="d-flex align-center py-0 px-6" fluid>
        <!-- Mobile Menu -->
        <v-app-bar-nav-icon 
          @click="$store.dispatch('ui/toggleDrawer')" 
          class="d-lg-none mr-2"
          color="primary"
        />
        
        <!-- Logo -->
        <router-link to="/" class="text-decoration-none d-flex align-center logo-premium mr-auto mr-lg-8">
          <div class="logo-orb">
            <v-icon color="white" size="28">mdi-shopping</v-icon>
          </div>
          <div class="logo-text-group ml-3 d-none d-sm-flex">
            <span class="logo-main">Shop<span class="brand-accent">Nova</span></span>
            <span class="logo-tag">PREMIUM SaaS</span>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="d-none d-lg-flex align-center nav-items-group">
          <v-btn text class="nav-link-btn" @click="$router.push('/')">Home</v-btn>
          <v-btn text class="nav-link-btn" @click="$router.push('/products')">Store</v-btn>
          
          <v-menu offset-y open-on-hover transition="slide-y-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text class="nav-link-btn" v-bind="attrs" v-on="on">
                Categories
                <v-icon right small>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list class="glass-dropdown mt-2 pa-2">
              <v-list-item
                v-for="category in (categories || [])"
                :key="category.id"
                @click="filterByCategory(category.id)"
                class="dropdown-item-modern"
              >
                <v-list-item-icon class="mr-4">
                  <v-icon small color="primary">{{ category.icon || 'mdi-tag' }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ category.name }}</v-list-item-title>
              </v-list-item>
              <v-divider class="my-2" />
              <v-list-item @click="$router.push('/categories')" class="dropdown-item-modern">
                <v-list-item-title class="primary--text font-weight-bold">Browse All</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-spacer class="d-none d-lg-flex" />

        <!-- Search Box -->
        <div class="search-wrapper-premium mx-4 d-none d-md-flex">
          <v-icon class="search-icon">mdi-magnify</v-icon>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search collections..."
            class="search-input-field"
            @keyup.enter="search"
          />
        </div>

        <!-- Action Icons -->
        <div class="d-flex align-center action-icons-group">
          <!-- Cart -->
          <v-btn icon class="action-btn-circle mx-1" @click="$store.dispatch('ui/toggleCartDrawer')">
            <v-badge :content="cartItemCount" :value="cartItemCount > 0" color="#0ea5e9" overlap class="custom-badge">
              <v-icon>mdi-cart-outline</v-icon>
            </v-badge>
          </v-btn>

          <!-- Auth Logic -->
          <template v-if="isAuthenticated">
            <v-btn icon class="action-btn-circle mx-1" @click="viewNotifications">
              <v-badge :content="unreadCount" :value="unreadCount > 0" color="error" overlap>
                <v-icon>mdi-bell-outline</v-icon>
              </v-badge>
            </v-btn>

            <v-menu offset-y transition="scale-transition" origin="top right">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon class="profile-avatar-btn ml-2" v-bind="attrs" v-on="on">
                  <v-avatar size="40" class="avatar-shimmer">
                    <v-img :src="getUserImage()" />
                  </v-avatar>
                </v-btn>
              </template>
              <v-card class="glass-dropdown profile-menu mt-2">
                <div class="pa-4 d-flex align-center profile-header">
                  <v-avatar size="48" class="mr-3">
                    <v-img :src="getUserImage()" />
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ user ? user.name : 'User' }}</div>
                    <div class="text-caption grey--text">{{ user ? user.email : '' }}</div>
                  </div>
                </div>
                <v-divider />
                <v-list dense class="pa-2">
                  <v-list-item @click="$router.push('/account')" class="dropdown-item-modern">
                    <v-list-item-icon><v-icon small>mdi-account-circle-outline</v-icon></v-list-item-icon>
                    <v-list-item-title>Profile</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$router.push('/orders')" class="dropdown-item-modern">
                    <v-list-item-icon><v-icon small>mdi-package-variant</v-icon></v-list-item-icon>
                    <v-list-item-title>My Orders</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$router.push('/admin')" v-if="isAdmin" class="admin-link dropdown-item-modern">
                    <v-list-item-icon><v-icon small color="amber darken-2">mdi-shield-crown</v-icon></v-list-item-icon>
                    <v-list-item-title>Admin Portal</v-list-item-title>
                  </v-list-item>
                  <v-divider class="my-2" />
                  <v-list-item @click="logout" class="dropdown-item-modern logout-item">
                    <v-list-item-icon><v-icon small color="error">mdi-logout-variant</v-icon></v-list-item-icon>
                    <v-list-item-title class="error--text">Sign Out</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>

          <template v-else>
            <div class="auth-buttons d-none d-sm-flex ml-2">
              <v-btn text class="nav-link-btn" @click="$router.push('/login')">Login</v-btn>
              <v-btn depressed color="primary" class="signup-btn ml-2" @click="$router.push('/register')">Join Now</v-btn>
            </div>
          </template>
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

    <!-- Cart Drawer -->
    <CartDrawer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CartDrawer from '../cart/CartDrawer.vue'

export default {
  name: 'AppNavigation',
  components: {
    CartDrawer
  },
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
/* Premium Navbar */
.navbar-premium {
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.7) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Logo Premium */
.logo-premium {
  transition: transform 0.3s ease;
}

.logo-orb {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(14, 165, 233, 0.25);
}

.logo-main {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
  line-height: 1;
}

.brand-accent {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-tag {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: block;
}

/* Navigation Links */
.nav-link-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  color: #475569 !important;
  border-radius: 8px !important;
}

.nav-link-btn:hover {
  color: #0ea5e9 !important;
  background: rgba(14, 165, 233, 0.05) !important;
}

/* Search Box Premium */
.search-wrapper-premium {
  background: #f1f5f9;
  border-radius: 12px;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  max-width: 320px;
  transition: all 0.3s ease;
}

.search-wrapper-premium:focus-within {
  background: white;
  border: 1px solid #0ea5e9;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

.search-icon {
  color: #94a3b8;
  font-size: 20px !important;
  margin-right: 10px;
}

.search-input-field {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 0.9rem;
  color: #1e293b;
}

/* Action Buttons */
.action-btn-circle {
  background: #f8fafc !important;
  border-radius: 10px !important;
}

.action-btn-circle:hover {
  background: #f1f5f9 !important;
  transform: translateY(-2px);
}

.signup-btn {
  border-radius: 10px !important;
  text-transform: none !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25) !important;
}

/* Glass Dropdowns */
.glass-dropdown {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
}

.dropdown-item-modern {
  border-radius: 8px !important;
  margin: 2px 0;
}

.dropdown-item-modern:hover {
  background-color: rgba(14, 165, 233, 0.08) !important;
  color: #0ea5e9 !important;
}

@media (max-width: 960px) {
  .logo-tag, .logo-text-group {
    display: none !important;
  }
}
</style>
```