<template>
  <AdminLayout>
    <div class="dashboard-content">
      <div class="page-header mb-6">
        <h1 class="page-title">Admin Dashboard</h1>
        <p class="page-subtitle">Welcome to your admin control panel</p>
      </div>
      
      <v-row class="mb-6">
        <v-col cols="12">
          <v-btn color="primary" large @click="$router.push('/admin/products')">
            <v-icon left>mdi-package-variant</v-icon>
            Manage Products
          </v-btn>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="stats-card" color="primary" dark>
            <v-card-text>
              <div class="stats-number">150</div>
              <div class="stats-label">Total Products</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="stats-card" color="success" dark>
            <v-card-text>
              <div class="stats-number">45</div>
              <div class="stats-label">Total Orders</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="stats-card" color="info" dark>
            <v-card-text>
              <div class="stats-number">320</div>
              <div class="stats-label">Total Users</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="stats-card" color="warning" dark>
            <v-card-text>
              <div class="stats-number">$12,450</div>
              <div class="stats-label">Total Revenue</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/AdminLayout.vue'

export default {
  name: 'Admin',
  components: {
    AdminLayout
  }
}
</script>

<style scoped>
.dashboard-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.stats-card {
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
}

.stats-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.stats-label {
  font-size: 1rem;
  opacity: 0.9;
}
</style>