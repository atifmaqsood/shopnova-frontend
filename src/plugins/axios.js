import Vue from 'vue'
import { mockApiService } from '@/services/mockApiService'
import store from '../store'

// Mock Axios implementation
const mockClient = {
  get(url, config = {}) {
    console.log(`Mock GET: ${url}`, config);
    if (url.includes('/products')) {
      if (url.match(/\/products\/\d+/)) {
        const id = url.split('/').pop();
        return mockApiService.getProduct(id).then(data => ({ data }));
      }
      return mockApiService.getProducts(config.params).then(products => ({ data: { products } }));
    }
    if (url.includes('/categories')) {
      return mockApiService.getCategories().then(categories => ({ data: categories }));
    }
    if (url.includes('/orders/my-orders')) {
      return mockApiService.getOrders().then(orders => ({ data: { orders } }));
    }
    if (url.includes('/admin/dashboard')) {
      return mockApiService.getDashboardStats().then(data => ({ data }));
    }
    if (url.includes('/admin/users')) {
      return mockApiService.getCustomers().then(users => ({ data: { users } }));
    }
    if (url.includes('/orders/') || url.match(/\/orders\/\d+/)) {
      const id = url.split('/').pop();
      return mockApiService.getOrder(id).then(order => ({ data: order }));
    }
    if (url.includes('/orders')) {
      return mockApiService.getOrders().then(orders => ({ data: { orders } }));
    }
    if (url.includes('/addresses')) {
      return mockApiService.getAddresses().then(addresses => ({ data: addresses }));
    }
    if (url.includes('/notifications/unread-count')) {
      return Promise.resolve({ data: { unreadCount: 3 } });
    }
    if (url.includes('/notifications')) {
      return Promise.resolve({ data: { notifications: [], pagination: { total: 0 } } });
    }
    return Promise.resolve({ data: {} });
  },
  post(url, data, config = {}) {
    console.log(`Mock POST: ${url}`, data);
    if (url.includes('/auth/login')) {
      const role = data.email.includes('admin') ? 'ADMIN' : 'USER';
      return Promise.resolve({
        data: {
          user: { id: 1, email: data.email, name: 'Demo User', role },
          token: 'mock-token-' + Date.now()
        }
      });
    }
    if (url.includes('/orders')) {
      return mockApiService.createOrder(data).then(order => ({ data: order }));
    }
    if (url.includes('/payment/create-payment-intent')) {
      return Promise.resolve({
        data: { clientSecret: 'mock_secret_' + Date.now() }
      });
    }
    return Promise.resolve({ data: {} });
  },
  patch(url, data) {
    console.log(`Mock PATCH: ${url}`, data);
    if (url.includes('/orders/') && url.includes('/status')) {
      const parts = url.split('/');
      const id = parts[parts.length - 2];
      return mockApiService.updateOrderStatus(id, data.status).then(order => ({ data: order }));
    }
    if (url.match(/\/products\/\d+/)) {
      const id = url.split('/').pop();
      return mockApiService.updateProduct(id, data).then(product => ({ data: product }));
    }
    return Promise.resolve({ data: {} });
  },
  put(url, data) {
    if (url.match(/\/products\/\d+/)) {
      const id = url.split('/').pop();
      return mockApiService.updateProduct(id, data).then(product => ({ data: product }));
    }
    if (url.includes('/users/profile')) {
      return Promise.resolve({ data: { message: 'Profile updated' } });
    }
    return Promise.resolve({ data: {} });
  },
  delete(url) { return Promise.resolve({ data: {} }); },
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  }
};

Vue.prototype.$http = mockClient;
export default mockClient;