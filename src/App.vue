<template>
  <v-app :dark="$store.getters['ui/darkMode']">
    <template v-if="!isAdminRoute && !isAuthRoute">
      <AppNavigation />
      <v-main class="main-content">
        <router-view />
      </v-main>
      <Footer />
    </template>
    <template v-else-if="isAuthRoute">
      <router-view />
    </template>
    <template v-else>
      <router-view />
    </template>
    <AppSnackbar />
    <AppLoader />
  </v-app>
</template>

<script>
import AppNavigation from './components/layout/AppNavigation.vue'
import Footer from './components/Footer.vue'
import AppSnackbar from './components/common/AppSnackbar.vue'
import AppLoader from './components/common/AppLoader.vue'

export default {
  name: 'App',
  components: {
    AppNavigation,
    Footer,
    AppSnackbar,
    AppLoader
  },
  computed: {
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    },
    isAuthRoute() {
      const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']
      return authRoutes.some(route => this.$route.path.startsWith(route))
    }
  },
  async created() {
    try {
      await this.$store.dispatch('auth/initializeAuth')
      await this.$store.dispatch('categories/fetchCategories')
    } catch (error) {
      console.warn('App initialization error:', error.message)
      this.$store.dispatch('ui/showSnackbar', {
        message: 'Unable to connect to server. Please check if the backend is running.',
        color: 'warning',
        timeout: 8000
      })
    }
  }
}
</script>

<style>
.main-content {
  padding-top: 70px !important;
}

.main-content .v-main__wrap {
  padding-top: 0 !important;
}

/* Ensure navbar stays on top */
.v-app-bar {
  z-index: 1001 !important;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease;
}
</style>
