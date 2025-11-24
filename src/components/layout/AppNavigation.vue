<template>
  <div>
    <!-- Top Bar -->
    <v-app-bar 
      app 
      color="white" 
      flat 
      height="70" 
      class="navbar-shadow" 
      elevate-on-scroll
    >
      <v-container class="d-flex align-center py-2" fluid>
        <!-- Mobile Menu -->
        <v-app-bar-nav-icon 
          @click="$store.dispatch('ui/toggleDrawer')" 
          class="d-lg-none"
        />
        
        <!-- Logo -->
        <v-toolbar-title class="mr-4">
          <router-link to="/" class="text-decoration-none d-flex align-center">
            <v-icon color="primary" size="28" class="mr-2">mdi-shopping</v-icon>
            <span class="primary--text font-weight-bold text-h6">ShopNova</span>
          </router-link>
        </v-toolbar-title>

        <!-- Desktop Navigation -->
        <div class="d-none d-lg-flex align-center">
          <v-btn text class="mx-1" @click="$router.push('/')">
            <v-icon left small>mdi-home</v-icon>
            Home
          </v-btn>
          <v-btn text class="mx-1" @click="$router.push('/products')">
            <v-icon left small>mdi-shopping</v-icon>
            Products
          </v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn text class="mx-1" v-bind="attrs" v-on="on">
                <v-icon left small>mdi-tag-multiple</v-icon>
                Categories
                <v-icon right small>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="category in (categories || [])"
                :key="category.id"
                @click="filterByCategory(category.id)"
              >
                <v-list-item-icon>
                  <v-icon small>mdi-tag</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ category.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-spacer />

        <!-- Search Bar -->
        <v-form @submit.prevent="search" class="search-container mx-2">
          <div class="search-box">
            <v-icon class="search-icon" color="grey darken-1">mdi-magnify</v-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for products, brands and more..."
              class="search-input"
              @keyup.enter="search"
            />
            <v-btn
              v-if="searchQuery"
              icon
              small
              class="clear-btn"
              @click="searchQuery = ''"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              depressed
              class="search-submit-btn"
            >
              Search
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
      v-model="drawer"
      app
      temporary
      width="300"
      class="modern-drawer"
    >
      <div class="drawer-header pa-4">
        <h3 class="primary--text font-weight-bold">ShopNova</h3>
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
          v-for="category in (categories || [])"
          :key="category.id"
          @click="filterByCategory(category.id)"
          class="category-item"
        >
          <v-list-item-icon>
            <v-icon size="20" color="grey">mdi-tag</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ category.name }}</v-list-item-title>
        </v-list-item>
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
    })
  },
  methods: {
    search() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          name: 'Products',
          query: { search: this.searchQuery.trim() }
        })
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
.navbar-shadow {
  box-shadow: 0 2px 12px rgba(0,0,0,0.08) !important;
  border-bottom: 1px solid #e8eaed;
  z-index: 1001 !important;
}

/* Search Bar - Modern Design */
.search-container {
  max-width: 600px;
  width: 100%;
  margin: 0 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0;
  height: 44px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-box:hover {
  border-color: #bdbdbd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-box:focus-within {
  border-color: #1976d2;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.15);
}

.search-icon {
  margin-left: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #212121;
  background: transparent;
  padding: 12px 8px;
  min-width: 0;
}

.search-input::placeholder {
  color: #9e9e9e;
  font-size: 14px;
}

.clear-btn {
  flex-shrink: 0;
  margin: 0 4px;
}

.search-submit-btn {
  height: 36px !important;
  margin: 4px 4px 4px 8px;
  border-radius: 6px !important;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 0 24px !important;
  flex-shrink: 0;
}

.modern-drawer {
  border-right: 1px solid #e0e0e0;
}

.drawer-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
}

.nav-item:hover {
  background-color: rgba(25, 118, 210, 0.08);
}

.category-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

/* Responsive Design */
@media (max-width: 1264px) {
  .search-container {
    max-width: 450px;
  }
}

@media (max-width: 960px) {
  .search-container {
    max-width: 350px;
  }
  
  .search-input::placeholder {
    font-size: 13px;
  }
  
  .search-submit-btn {
    padding: 0 16px !important;
  }
}

@media (max-width: 600px) {
  .search-container {
    max-width: 250px;
    margin: 0 8px;
  }
  
  .search-box {
    height: 40px;
  }
  
  .search-icon {
    margin-left: 12px;
  }
  
  .search-input {
    font-size: 13px;
    padding: 10px 6px;
  }
  
  .search-input::placeholder {
    font-size: 12px;
  }
  
  .search-submit-btn {
    height: 32px !important;
    padding: 0 12px !important;
    font-size: 13px;
  }
}
</style>