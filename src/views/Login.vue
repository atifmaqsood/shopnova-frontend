<template>
  <div class="auth-container">
    <div class="auth-background"></div>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="10" md="8" lg="5" xl="4">
          <div class="auth-card">
            <!-- Logo/Brand Section -->
            <div class="brand-section">
              <v-icon size="64" class="brand-icon">mdi-shopping</v-icon>
              <h1 class="brand-title">ShopNova</h1>
              <p class="brand-subtitle">Welcome back! Please login to your account</p>
            </div>

            <!-- Login Form -->
            <ValidationObserver ref="observer" v-slot="{ invalid }">
              <v-form @submit.prevent="login" class="auth-form">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="email"
                  rules="required|email"
                >
                  <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <v-text-field
                      v-model="form.email"
                      placeholder="Enter your email"
                      type="email"
                      outlined
                      dense
                      :error-messages="errors"
                      class="modern-input"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon color="#667eea">mdi-email-outline</v-icon>
                      </template>
                    </v-text-field>
                  </div>
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors }"
                  name="password"
                  rules="required|min:6"
                >
                  <div class="form-group">
                    <label class="form-label">Password</label>
                    <v-text-field
                      v-model="form.password"
                      placeholder="Enter your password"
                      :type="showPassword ? 'text' : 'password'"
                      outlined
                      dense
                      :error-messages="errors"
                      class="modern-input"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon color="#667eea">mdi-lock-outline</v-icon>
                      </template>
                      <template v-slot:append>
                        <v-icon @click="showPassword = !showPassword" class="password-toggle">
                          {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                        </v-icon>
                      </template>
                    </v-text-field>
                  </div>
                </ValidationProvider>

                <div class="forgot-password-link">
                  <a @click="$router.push('/forgot-password')" class="link-text">
                    Forgot Password?
                  </a>
                </div>

                <v-btn
                  :disabled="invalid"
                  :loading="loading"
                  type="submit"
                  class="login-btn"
                  large
                  block
                >
                  <v-icon left>mdi-login</v-icon>
                  Login to Account
                </v-btn>
              </v-form>
            </ValidationObserver>

            <!-- Divider -->
            <div class="divider-section">
              <div class="divider-line"></div>
              <span class="divider-text">or continue with</span>
              <div class="divider-line"></div>
            </div>

            <!-- Google Login -->
            <v-btn
              class="google-btn mb-6"
              large
              block
              @click="loginWithGoogle"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="google-icon mr-3" />
              Sign in with Google
            </v-btn>

            <!-- Register Link -->
            <div class="register-section">
              <span class="register-text">Don't have an account?</span>
              <a @click="$router.push('/register')" class="register-link">
                Create Account
              </a>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false,
      loading: false
    }
  },
  mounted() {
    const token = this.$route.query.token
    if (token) {
      this.handleGoogleCallback(token)
    }
  },
  methods: {
    loginWithGoogle() {
      window.location.href = `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}/auth/google`
    },
    async handleGoogleCallback(token) {
      this.loading = true
      try {
        this.$store.commit('auth/SET_TOKEN', token)
        await this.$store.dispatch('auth/fetchProfile')
        
        // Initialize other data
        await this.$store.dispatch('cart/fetchCart')
        await this.$store.dispatch('notifications/fetchUnreadCount')
        
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Login successful!',
          color: 'success'
        })
        
        // Remove token from URL
        const isAdmin = this.$store.getters['auth/isAdmin']
        const target = isAdmin ? '/admin' : '/'
        this.$router.replace(target).catch(() => {})
      } catch (error) {
        console.error('Google login error:', error)
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Google login failed',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async login() {
      this.loading = true
      try {
        await this.$store.dispatch('auth/login', this.form)
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Login successful!',
          color: 'success'
        })
        
        const isAdmin = this.$store.getters['auth/isAdmin']
        const target = isAdmin ? '/admin' : '/'
        this.$router.push(target).catch(() => {})
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: error.response?.data?.message || 'Login failed',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.auth-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.auth-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  z-index: 0;
}

.auth-background::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.15), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(14, 165, 233, 0.15), transparent 40%),
    radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.1), transparent 50%);
  animation: float 25s ease-in-out infinite;
}

.auth-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(45deg, rgba(56, 189, 248, 0.03) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(56, 189, 248, 0.03) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(56, 189, 248, 0.03) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(56, 189, 248, 0.03) 75%);
  background-size: 60px 60px;
  background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
  animation: movePattern 20s linear infinite;
}

@keyframes float {
  0%, 100% { 
    transform: translate(0, 0) rotate(0deg) scale(1); 
  }
  33% { 
    transform: translate(50px, -30px) rotate(120deg) scale(1.1); 
  }
  66% { 
    transform: translate(-30px, 50px) rotate(240deg) scale(0.9); 
  }
}

@keyframes movePattern {
  0% { background-position: 0 0, 0 30px, 30px -30px, -30px 0px; }
  100% { background-position: 60px 60px, 60px 90px, 90px 30px, 30px 60px; }
}

.v-container {
  position: relative;
  z-index: 1;
}

.auth-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 48px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(56, 189, 248, 0.1);
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.brand-section {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeIn 1s ease-out 0.2s both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.brand-icon {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  animation: pulse 2s ease-in-out infinite, rotate 20s linear infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  letter-spacing: -1px;
  animation: fadeIn 1s ease-out 0.3s both;
}

.brand-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  animation: fadeIn 1s ease-out 0.4s both;
}

.auth-form {
  margin-bottom: 32px;
  animation: fadeIn 1s ease-out 0.5s both;
}

.form-group {
  margin-bottom: 24px;
  animation: slideInLeft 0.6s ease-out both;
}

.form-group:nth-child(1) { animation-delay: 0.6s; }
.form-group:nth-child(2) { animation-delay: 0.7s; }

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.modern-input >>> .v-input__control > .v-input__slot {
  border-color: rgba(14, 165, 233, 0.2) !important;
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.modern-input >>> .v-input__control > .v-input__slot:hover {
  border-color: rgba(14, 165, 233, 0.4) !important;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

.modern-input.v-input--is-focused >>> .v-input__control > .v-input__slot {
  border-color: rgba(14, 165, 233, 0.6) !important;
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.15);
}

.password-toggle {
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #0ea5e9;
}

.forgot-password-link {
  text-align: right;
  margin-bottom: 24px;
  animation: fadeIn 1s ease-out 0.8s both;
}

.link-text {
  color: #0ea5e9;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.link-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #0ea5e9, #06b6d4);
  transition: width 0.3s ease;
}

.link-text:hover::after {
  width: 100%;
}

.link-text:hover {
  color: #06b6d4;
}

.login-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
  color: white !important;
  text-transform: none;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);
  transition: all 0.3s ease;
  height: 56px !important;
  animation: fadeIn 1s ease-out 0.9s both;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.5);
  transform: translateY(-2px);
}

.divider-section {
  display: flex;
  align-items: center;
  margin: 32px 0;
  animation: fadeIn 1s ease-out 1s both;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.3), transparent);
}

.divider-text {
  padding: 0 16px;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.9rem;
}

.register-section {
  text-align: center;
  animation: fadeIn 1s ease-out 1.1s both;
}

.register-text {
  color: #64748b;
  font-weight: 500;
  margin-right: 8px;
}

.register-link {
  color: #0ea5e9;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #0ea5e9, #06b6d4);
  transition: width 0.3s ease;
}

.register-link:hover::after {
  width: 100%;
}

.register-link:hover {
  color: #06b6d4;
}

@media (max-width: 600px) {
  .auth-card {
    padding: 32px 24px;
    border-radius: 24px;
  }

  .brand-title {
    font-size: 2rem;
  }

  .brand-icon {
    font-size: 48px !important;
  }
}

.google-btn {
  background: white !important;
  color: #334155 !important;
  text-transform: none;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 56px !important;
  animation: fadeIn 1s ease-out 1s both;
}

.google-btn:hover {
  background: #f8fafc !important;
  border-color: #cbd5e1;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.google-icon {
  width: 24px;
  height: 24px;
}
</style>