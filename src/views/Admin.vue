<template>
  <v-container fluid>
    <v-row>
      <!-- Admin Sidebar -->
      <v-col cols="12" md="2">
        <v-card>
          <v-list>
            <v-list-item
              v-for="item in adminMenuItems"
              :key="item.name"
              :to="item.to"
              exact
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Admin Content -->
      <v-col cols="12" md="10">
        <h1 class="display-1 mb-6">Admin Dashboard</h1>
        <v-row class="mb-4">
          <v-col cols="12">
            <v-btn color="primary" large @click="$router.push('/admin/products')">
              <v-icon left>mdi-package-variant</v-icon>
              Manage Products
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card color="primary" dark>
              <v-card-text>
                <div class="text-h4">150</div>
                <div>Total Products</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card color="success" dark>
              <v-card-text>
                <div class="text-h4">45</div>
                <div>Total Orders</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card color="info" dark>
              <v-card-text>
                <div class="text-h4">320</div>
                <div>Total Users</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card color="warning" dark>
              <v-card-text>
                <div class="text-h4">$12,450</div>
                <div>Total Revenue</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
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
  }
}
</script>