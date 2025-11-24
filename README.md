# ShopNova Frontend

A modern Vue.js 2 e-commerce frontend application built with Vuetify, featuring a complete shopping experience with user authentication, Google OAuth, Stripe payment integration, shopping cart, and admin panel.

## 🚀 Features

### Customer Features
- **Modern Homepage** - Hero section, categories, featured products with animations
- **Product Catalog** - Search, filters, pagination, beautiful product cards
- **Product Details** - Image gallery, stock status, add to cart, product variants
- **Shopping Cart** - Item management, quantity updates, order summary, real-time totals
- **Advanced Checkout Process** 
  - Multi-step wizard (Shipping → Payment → Review)
  - Address selection with management
  - **Stripe card payment integration** with secure Elements
  - Cash on Delivery option
  - Payment method display in order review
  - Order confirmation with payment tracking
- **User Authentication** 
  - Traditional login/register with email verification
  - **Google OAuth 2.0 social login**
  - Password reset flow
  - OTP verification
  - Session management
- **User Account** 
  - Profile management with image upload
  - Order history with status tracking
  - Real-time notifications
  - Multiple address management
  - Password change functionality
- **Real-time Notifications** - In-app notifications with unread count and badges

### Admin Features
- **Admin Dashboard** 
  - Statistics overview with animated counters
  - Revenue charts with Chart.js
  - Recent activity timeline
  - Top products analytics
  - Real-time metrics
- **Product Management** - CRUD operations for products and categories with image upload
- **Order Management** - View and update order statuses, payment tracking
- **User Management** - View users, manage roles, account oversight
- **Protected Routes** - Role-based access control with navigation guards

## 🛠️ Tech Stack

### Core Framework
- **Vue.js 2.6** - Progressive JavaScript framework
- **Vuetify 2.6** - Material Design component framework
- **Vue Router 3.6** - Official router for Vue.js
- **Vuex 3.6** - State management pattern + library

### HTTP & API
- **Axios 1.6** - Promise-based HTTP client
- **Axios Interceptors** - Automatic token attachment and error handling

### Payment Integration
- **@stripe/stripe-js** - Official Stripe.js library
- **Stripe Elements** - Secure card input components
- Payment Intent API integration

### Form & Validation
- **Vee-Validate 3.4** - Form validation library
- **ValidationObserver/Provider** - Declarative validation components

### Real-time & Communication
- **Socket.io-client 4.7** - Real-time communication (future use)

### Data Visualization
- **Chart.js** - Beautiful charts for admin dashboard
- **chart.js/auto** - Auto-registration of Chart.js components

### Utilities
- **js-cookie 3.0** - Cookie handling utility
- **Google Fonts (Inter)** - Modern typography

## 📁 Project Structure

```
src/
├── assets/              # Static assets (images, avatars)
├── components/          # Reusable Vue components
│   ├── common/         # Common UI components
│   ├── layout/         # Layout components (AppNavigation, Footer)
│   ├── product/        # Product-specific components (ProductCard)
│   └── AdminLayout.vue # Admin panel layout
├── plugins/            # Vue plugins configuration
│   ├── axios.js        # Axios configuration with interceptors
│   ├── vee-validate.js # Form validation setup
│   └── vuetify.js      # Vuetify configuration and theme
├── router/             # Vue Router configuration
│   └── index.js        # Routes and navigation guards
├── services/           # API service layer
│   ├── admin/          # Admin-specific services
│   ├── authService.js  # Authentication API calls
│   ├── cartService.js  # Shopping cart API calls
│   ├── orderService.js # Order management API calls
│   └── ...             # Other service files
├── store/              # Vuex store
│   ├── index.js        # Store configuration
│   └── modules/        # Vuex modules
│       ├── auth.js     # Authentication state
│       ├── cart.js     # Shopping cart state
│       ├── products.js # Product catalog state
│       ├── orders.js   # Order management state
│       ├── notifications.js # Notification state
│       ├── user.js     # User profile and addresses
│       └── ui.js       # Global UI state
├── views/              # Page components
│   ├── Home.vue        # Homepage
│   ├── Products.vue    # Product catalog
│   ├── ProductDetail.vue # Product details
│   ├── Cart.vue        # Shopping cart
│   ├── Checkout.vue    # Checkout process (with Stripe)
│   ├── Login.vue       # Login page (with Google OAuth)
│   ├── Register.vue    # Registration page
│   ├── Account.vue     # User account dashboard
│   ├── Addresses.vue   # Address management
│   ├── Admin.vue       # Admin dashboard
│   ├── AdminProducts.vue # Product management
│   ├── AdminOrders.vue # Order management
│   └── ...             # Other pages
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
   VUE_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
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

1. **Traditional Registration**
   - User fills registration form with validation
   - Backend sends OTP via email
   - User verifies email with OTP
   - Account is activated
   - Auto-login after verification

2. **Google OAuth Login**
   - User clicks "Sign in with Google" button
   - Redirected to Google OAuth consent screen
   - Google returns authorization code
   - Backend exchanges code for user profile
   - JWT token generated and returned via URL
   - Frontend stores token and fetches user profile
   - User redirected to appropriate dashboard (Admin/User)

3. **Traditional Login**
   - User enters credentials
   - JWT token received and stored in localStorage
   - User profile loaded into Vuex store
   - Cart and notifications initialized
   - Redirect based on role (Admin → /admin, User → /)

4. **Route Protection**
   - Navigation guards check authentication status
   - Admin routes require ADMIN role
   - Guest routes (login/register) redirect authenticated users
   - Token validation on protected route access
   - Automatic logout on 401 errors

## 💳 Payment Integration (Stripe)

1. **Checkout Initialization**
   - Stripe.js loaded with publishable key
   - Stripe instance created on component mount

2. **Payment Method Selection**
   - User selects "Credit/Debit Card" payment method
   - Stripe Card Element mounted to DOM
   - Secure iframe for card input
   - Real-time validation and error display

3. **Payment Processing**
   - User proceeds to order review
   - On "Place Order":
     - Backend creates Stripe Payment Intent
     - Frontend receives `clientSecret`
     - `stripe.confirmCardPayment()` called with card element
     - Stripe processes payment securely
     - Payment Intent ID returned on success

4. **Order Creation**
   - Order created with payment details
   - Payment Intent ID linked to order
   - Order confirmation email sent
   - Cart cleared
   - User redirected to account page

## 🛒 Shopping Flow

1. **Browse Products**
   - View homepage with featured products and categories
   - Browse product catalog with search and filters
   - Pagination for large product lists
   - Category-based filtering

2. **Product Details**
   - View product images in gallery
   - Check stock availability
   - Read product description
   - Add to cart with quantity selection
   - Real-time stock validation

3. **Shopping Cart**
   - View cart items with images and details
   - Update quantities with validation
   - Remove items from cart
   - View subtotal and total
   - Proceed to checkout

4. **Checkout Process (3 Steps)**
   - **Step 1: Shipping Address**
     - Select from saved addresses
     - Add new address if needed
     - Default address auto-selected
   
   - **Step 2: Payment Method**
     - Choose Cash on Delivery or Card
     - For card: Stripe Element appears
     - Enter card details securely
     - Real-time validation
   
   - **Step 3: Review Order**
     - Review selected payment method
     - Review order items and totals
     - Confirm and place order
     - Payment processed (if card)
     - Order confirmation

## 📱 Responsive Design

- **Mobile-first approach** with Vuetify's responsive grid system
- **Breakpoint-aware components** for optimal mobile experience
- **Touch-friendly interface** with appropriate button sizes and spacing
- **Collapsible navigation** drawer for mobile devices
- **Responsive images** with proper sizing
- **Adaptive layouts** for tablets and desktops

## 🎨 UI/UX Features

- **Modern Design System**
  - Material Design principles via Vuetify
  - Custom color palette with gradients
  - Inter font family for modern typography
  - Consistent spacing and elevation

- **Animations & Transitions**
  - Smooth page transitions
  - Hover effects on interactive elements
  - Loading skeletons for better perceived performance
  - Animated counters on admin dashboard
  - Fade-in animations for content

- **User Feedback**
  - Snackbar notifications for actions
  - Loading states with progress indicators
  - Form validation with real-time error messages
  - Success/error states with color coding
  - Badge indicators for notifications and cart

- **Accessibility**
  - Semantic HTML structure
  - ARIA labels where appropriate
  - Keyboard navigation support
  - Focus indicators
  - Color contrast compliance

## 🔄 State Management

### Vuex Modules:
- **auth** - User authentication, profile, Google OAuth state
- **cart** - Shopping cart items, totals, and operations
- **products** - Product catalog, filters, and search
- **categories** - Product categories and navigation
- **orders** - Order history, details, and creation
- **notifications** - In-app notifications and unread count
- **ui** - Global UI state (loading, snackbars, drawer, theme)
- **user** - User profile, addresses, and preferences

### State Persistence:
- **localStorage** - JWT token, user preferences
- **Vuex** - Runtime application state
- **Session** - Temporary UI state

## 🌐 API Integration

- **Axios interceptors** for automatic token attachment
- **Global error handling** with user-friendly messages
- **Loading states** managed automatically via interceptors
- **401 handling** with automatic logout and redirect
- **Service layer** abstraction for clean API calls
- **Request/Response transformation** for consistent data format
- **Retry logic** for failed requests (configurable)

## 🚀 Performance Optimizations

- **Lazy loading** for route components (dynamic imports)
- **Code splitting** with webpack chunks
- **Image optimization** with placeholder fallbacks
- **Efficient re-rendering** with proper `key` usage
- **Vuex getters** for computed state derivation
- **Debounced search** to reduce API calls
- **Pagination** for large data sets
- **Component caching** with `keep-alive`

## 🔧 Development Scripts

```bash
# Start development server with hot reload
npm run serve

# Build for production with minification
npm run build

# Lint and fix files
npm run lint

# Run unit tests (if configured)
npm run test:unit

# Run end-to-end tests (if configured)
npm run test:e2e
```

## 🌟 Key Components

### Layout Components
- **AppNavigation** - Main navigation with search, cart, notifications, and user menu
- **AdminLayout** - Admin panel layout with sidebar navigation
- **AppSnackbar** - Global notification system
- **AppLoader** - Global loading overlay

### Feature Components
- **ProductCard** - Reusable product display with hover effects
- **Checkout** - Multi-step checkout wizard with Stripe integration
- **OrderCard** - Order display with status tracking

## 📋 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VUE_APP_API_URL` | Backend API URL | Yes | `http://localhost:3000` |
| `VUE_APP_NAME` | Application name | No | `ShopNova` |
| `VUE_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for payments | Yes (for payments) | - |

## 🔒 Security Considerations

- **XSS Protection**: Vue.js automatic escaping
- **CSRF**: Token-based authentication (no cookies for auth)
- **Secure Payment**: Stripe Elements (PCI compliant)
- **Input Validation**: Client-side validation with Vee-Validate
- **Environment Variables**: Sensitive keys in `.env` (not committed)
- **HTTPS**: Required for production (especially for Stripe)
- **Token Storage**: JWT in localStorage (consider httpOnly cookies for production)

## 🎯 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (all user flows)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing framework
- **Vuetify Team** - For the beautiful component library
- **Stripe** - For secure payment processing
- **Google** - For OAuth authentication

---

**Built with ❤️ using Vue.js 2 and Vuetify**