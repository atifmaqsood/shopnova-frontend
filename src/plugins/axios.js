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
    if (url.includes('/orders')) {
      return mockApiService.getOrders().then(orders => ({ data: { orders } }));
    }
    if (url.includes('/admin/dashboard')) {
      return mockApiService.getDashboardStats().then(data => ({ data }));
    }
    if (url.includes('/admin/users')) {
      return mockApiService.getCustomers().then(users => ({ data: { users } }));
    }
    if (url.includes('/orders/')) {
      const id = url.split('/').pop();
      return mockApiService.getOrder(id).then(order => ({ data: order }));
    }
    return Promise.resolve({ data: {} });
  },
  post(url, data, config = {}) {
    console.log(`Mock POST: ${url}`, data);
    if (url.includes('/auth/login')) {
      const role = data.email.includes('admin') ? 'admin' : 'user';
      return Promise.resolve({
        data: {
          user: { id: 1, email: data.email, name: 'Demo User', role },
          token: 'mock-token'
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