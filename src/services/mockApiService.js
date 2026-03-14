import { products as initialProducts } from '@/mockData/products';
import { categories as initialCategories } from '@/mockData/categories';
import { orders as initialOrders } from '@/mockData/orders';
import { customers as initialCustomers } from '@/mockData/customers';

const STORAGE_KEYS = {
  PRODUCTS: 'shopnova_products',
  CATEGORIES: 'shopnova_categories',
  ORDERS: 'shopnova_orders',
  CUSTOMERS: 'shopnova_customers',
  CART: 'shopnova_cart',
  REVIEWS: 'shopnova_reviews',
  ADDRESSES: 'shopnova_addresses'
};

const INITIAL_ADDRESSES = [
  {
    id: 1,
    street: '123 Tech Avenue',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    isDefault: true
  }
];

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  constructor() {
    this.initData();
  }

  initData(force = false) {
    if (force || !localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.ADDRESSES)) {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(INITIAL_ADDRESSES));
    }
  }

  resetData() {
    this.initData(true);
  }

  // --- Products ---
  async getProducts(filters = {}) {
    await delay();
    let products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS));
    
    // Default: Filter out products without images unless specified otherwise
    if (filters.includeNoImage !== true) {
      products = products.filter(p => p.images && p.images.length > 0 && p.images[0]);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    
    if (filters.categoryId) {
      products = products.filter(p => p.categoryId === parseInt(filters.categoryId));
    }
    
    if (filters.minPrice) products = products.filter(p => p.price >= filters.minPrice);
    if (filters.maxPrice) products = products.filter(p => p.price <= filters.maxPrice);
    
    if (filters.sortBy) {
      if (filters.sortBy === 'price_asc') products.sort((a,b) => a.price - b.price);
      if (filters.sortBy === 'price_desc') products.sort((a,b) => b.price - a.price);
      if (filters.sortBy === 'name_asc') products.sort((a,b) => a.name.localeCompare(b.name));
      if (filters.sortBy === 'newest') products.sort((a,b) => b.id - a.id);
    }
    
    return products;
  }

  async getProduct(id) {
    await delay();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS));
    return products.find(p => p.id === parseInt(id));
  }

  async createProduct(product) {
    await delay();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS));
    const newProduct = { 
      ...product, 
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  }

  async updateProduct(id, updates) {
    await delay();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS));
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return products[index];
    }
    throw new Error('Product not found');
  }

  async deleteProduct(id) {
    await delay();
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS));
    const newProducts = products.filter(p => p.id !== parseInt(id));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
    return true;
  }

  // --- Categories ---
  async getCategories() {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES));
  }
  
  async createCategory(category) {
    await delay();
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES));
    const newCategory = { 
      ...category, 
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1 
    };
    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return newCategory;
  }

  // --- Orders ---
  async getOrders() {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS));
  }

  async getOrder(id) {
    await delay();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS));
    return orders.find(o => o.id === id);
  }

  async createOrder(orderData) {
    await delay();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS));
    const newOrder = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Processing'
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    // Clear cart after order creation
    localStorage.removeItem(STORAGE_KEYS.CART);
    return newOrder;
  }

  async updateOrderStatus(id, status) {
    await delay();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS));
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return orders[index];
    }
    throw new Error('Order not found');
  }

  // --- Customers ---
  async getCustomers() {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS));
  }

  // --- Reviews ---
  async getReviews(productId) {
    await delay();
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS));
    return reviews.filter(r => r.productId === parseInt(productId));
  }

  async addReview(review) {
    await delay();
    const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS));
    const newReview = { ...review, id: Date.now(), date: new Date().toISOString() };
    reviews.push(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    return newReview;
  }

  // --- Cart ---
  async getCart() {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || { items: [], total: 0 };
  }

  async updateCart(cart) {
    await delay();
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  // --- Addresses ---
  async getAddresses() {
    await delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADDRESSES)) || [];
  }

  async createAddress(address) {
    await delay();
    const addresses = await this.getAddresses();
    const newAddress = { ...address, id: Date.now() };
    addresses.push(newAddress);
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
    return newAddress;
  }

  // --- Dashboard Stats ---
  async getDashboardStats() {
    await delay();
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS));
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS));
    const customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS));

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStock = products.filter(p => p.stock < 10).length;

    return {
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        lowStock
      },
      recentOrders: orders.slice(0, 5),
      topProducts: products.slice(0, 5).map(p => ({
        name: p.name,
        sales: Math.floor(Math.random() * 100) + 20,
        revenue: Math.floor(Math.random() * 5000) + 1000
      }))
    };
  }
}

export const mockApiService = new MockApiService();
export default mockApiService;
