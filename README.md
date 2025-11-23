# ShopNova Frontend

A modern Vue.js 2 e-commerce frontend application built with Vuetify, featuring a complete shopping experience with user authentication, product catalog, shopping cart, and admin panel.

## 🚀 Features

### Customer Features
- **Modern Homepage** - Hero section, categories, featured products
- **Product Catalog** - Search, filters, pagination, product cards
- **Product Details** - Image gallery, stock status, add to cart
- **Shopping Cart** - Item management, quantity updates, order summary
- **Checkout Process** - Address selection, payment method, order review
- **User Authentication** - Login, register, email verification, password reset
- **User Account** - Profile management, order history, notifications
- **Real-time Notifications** - In-app notifications with unread count

### Admin Features
- **Admin Dashboard** - Statistics overview, recent activity
- **Product Management** - CRUD operations for products and categories
- **Order Management** - View and update order statuses
- **User Management** - View users, manage roles
- **Protected Routes** - Role-based access control

## 🛠️ Tech Stack

- **Vue.js 2.6** - Progressive JavaScript framework
- **Vuetify 2.6** - Material Design component framework
- **Vue Router 3.6** - Official router for Vue.js
- **Vuex 3.6** - State management pattern + library
- **Axios 1.6** - Promise-based HTTP client
- **Vee-Validate 3.4** - Form validation library
- **Socket.io-client 4.7** - Real-time communication
- **js-cookie 3.0** - Cookie handling utility

## 📁 Project Structure

```
src/
├── assets/              # Static assets
├── components/          # Reusable Vue components
│   ├── common/         # Common UI components
│   ├── layout/         # Layout components
│   └── product/        # Product-specific components
├── plugins/            # Vue plugins configuration
│   ├── axios.js        # Axios configuration
│   ├── vee-validate.js # Form validation setup
│   └── vuetify.js      # Vuetify configuration
├── router/             # Vue Router configuration
├── services/           # API service layer
│   ├── admin/          # Admin-specific services
│   ├── authService.js  # Authentication API calls
│   ├── cartService.js  # Shopping cart API calls
│   └── ...             # Other service files
├── store/              # Vuex store
│   └── modules/        # Vuex modules
│       ├── auth.js     # Authentication state
│       ├── cart.js     # Shopping cart state
│       ├── products.js # Product catalog state
│       └── ...         # Other store modules
├── views/              # Page components
│   ├── auth/           # Authentication pages
│   ├── account/        # User account pages
│   └── admin/          # Admin panel pages
├── App.vue             # Root component
└── main.js             # Application entry point
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopnova-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VUE_APP_API_URL=http://localhost:3000
   VUE_APP_NAME=ShopNova
   ```

4. **Start development server**
   ```bash
   npm run serve
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Authentication Flow

1. **Registration**
   - User fills registration form
   - Backend sends OTP via email
   - User verifies email with OTP
   - Account is activated

2. **Login**
   - User enters credentials
   - JWT token received and stored
   - User profile loaded
   - Cart and notifications initialized

3. **Route Protection**
   - Navigation guards check authentication
   - Admin routes require ADMIN role
   - Guest routes redirect authenticated users

## 🛒 Shopping Flow

1. **Browse Products**
   - View homepage with featured products
   - Browse product catalog with filters
   - Search products by name/description

2. **Product Details**
   - View product images and details
   - Check stock availability
   - Add to cart with quantity selection

3. **Shopping Cart**
   - View cart items and totals
   - Update quantities or remove items
   - Proceed to checkout

4. **Checkout Process**
   - Select shipping address
   - Choose payment method
   - Review order details
   - Place order

## 📱 Responsive Design

- **Mobile-first approach** with Vuetify's responsive grid
- **Breakpoint-aware components** for optimal mobile experience
- **Touch-friendly interface** with appropriate button sizes
- **Collapsible navigation** for mobile devices

## 🎨 UI/UX Features

- **Material Design** principles via Vuetify
- **Dark mode support** with theme switching
- **Loading states** with skeletons and progress indicators
- **Snackbar notifications** for user feedback
- **Form validation** with real-time error messages
- **Smooth transitions** and hover effects

## 🔄 State Management

### Vuex Modules:
- **auth** - User authentication and profile
- **cart** - Shopping cart items and totals
- **products** - Product catalog and filters
- **categories** - Product categories
- **orders** - Order history and details
- **notifications** - In-app notifications
- **ui** - Global UI state (loading, snackbars, theme)
- **user** - User profile and addresses

## 🌐 API Integration

- **Axios interceptors** for automatic token attachment
- **Error handling** with global error messages
- **Loading states** managed automatically
- **401 handling** with automatic logout
- **Service layer** abstraction for clean API calls

## 🚀 Performance Optimizations

- **Lazy loading** for route components
- **Code splitting** with dynamic imports
- **Image optimization** with placeholder fallbacks
- **Efficient re-rendering** with proper key usage
- **Vuex getters** for computed state derivation

## 🔧 Development Scripts

```bash
# Start development server
npm run serve

# Build for production
npm run build

# Lint and fix files
npm run lint
```

## 🌟 Key Components

- **AppNavigation** - Main navigation with search and user menu
- **ProductCard** - Reusable product display component
- **AppSnackbar** - Global notification system
- **AppLoader** - Global loading overlay

## 📋 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VUE_APP_API_URL` | Backend API URL | `http://localhost:3000` |
| `VUE_APP_NAME` | Application name | `ShopNova` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Vue.js 2 and Vuetify**