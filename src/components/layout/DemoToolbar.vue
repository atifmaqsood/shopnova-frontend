<template>
  <div class="demo-toolbar" :class="{ 'toolbar-collapsed': collapsed }">
    <!-- Main FAB -->
    <v-btn
      color="primary"
      fab
      large
      dark
      class="fab-main elevation-8"
      @click="collapsed = !collapsed"
    >
      <v-icon>{{ collapsed ? 'mdi-auto-fix' : 'mdi-close' }}</v-icon>
    </v-btn>

    <!-- Expanded Menu -->
    <v-card v-if="!collapsed" class="demo-card glass-panel elevation-12">
      <div class="pa-4 pb-2 d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-cog-outline</v-icon>
        <span class="text-button font-weight-black">Demo Controls</span>
        <v-spacer />
        <v-chip x-small color="primary" dark outlined>SaaS v1.0</v-chip>
      </div>
      
      <v-divider />
      
      <v-list dense bg-transparent>
        <v-list-item @click="toggleRole">
          <v-list-item-icon class="mr-3">
            <v-icon :color="isAdmin ? 'amber darken-2' : 'grey'">
              {{ isAdmin ? 'mdi-shield-crown' : 'mdi-account-outline' }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              {{ isAdmin ? 'Switch to Customer View' : 'Switch to Admin View' }}
            </v-list-item-title>
            <v-list-item-subtitle>Toggles dashboard access</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="resetDemo">
          <v-list-item-icon class="mr-3">
            <v-icon color="error">mdi-refresh</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="error--text font-weight-bold">Reset Demo Data</v-list-item-title>
            <v-list-item-subtitle>Wipes localStorage</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <div class="pa-4 pt-0">
        <p class="text-caption grey--text mb-0 mt-2 text-center">
          <v-icon x-small class="mr-1">mdi-information-outline</v-icon>
          Designed for Portfolio Presentation
        </p>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'DemoToolbar',
  data() {
    return {
      collapsed: true
    };
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isAdmin', 'isAuthenticated'])
  },
  methods: {
    async toggleRole() {
      if (!this.isAuthenticated) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Please login first to switch roles!',
          color: 'warning'
        });
        this.$router.push('/login');
        this.collapsed = true;
        return;
      }

      const newUser = { ...this.user };
      newUser.role = this.isAdmin ? 'USER' : 'ADMIN';
      
      // Update LocalStorage
      localStorage.setItem('shopnova_current_user', JSON.stringify(newUser));
      
      // Update Store
      this.$store.commit('auth/SET_USER', newUser);
      
      this.$store.dispatch('ui/showSnackbar', {
        message: `System Role updated to: ${newUser.role}`,
        color: 'success'
      });

      // Redirect if needed
      if (newUser.role === 'ADMIN') {
        this.$router.push('/admin');
      } else {
        this.$router.push('/');
      }
      
      this.collapsed = true;
    },
    resetDemo() {
      if (confirm('Are you sure? This will wipe all orders, products, and cart data to original state.')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  }
};
</script>

<style scoped>
.demo-toolbar {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.fab-main {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
}

.fab-main:hover {
  transform: scale(1.1) rotate(15deg);
}

.demo-card {
  width: 280px;
  margin-bottom: 20px;
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.9) !important;
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.glass-panel {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.bg-transparent {
  background-color: transparent !important;
}
</style>
