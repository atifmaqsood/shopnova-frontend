<template>
  <div class="auth-container">
    <div class="auth-background"></div>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" xl="5">
          <div class="auth-card">
            <!-- Logo/Brand Section -->
            <div class="brand-section">
              <v-icon size="56" class="brand-icon">mdi-shopping</v-icon>
              <h1 class="brand-title">Create Account</h1>
              <p class="brand-subtitle">Join ShopNova and start shopping today!</p>
            </div>

            <!-- Registration Form -->
            <ValidationObserver ref="observer" v-slot="{ invalid }">
              <v-form @submit.prevent="register" class="auth-form">
                
                <!-- Profile Image Upload -->
                <div class="profile-upload-section">
                  <div class="profile-preview">
                    <v-avatar size="100" class="profile-avatar">
                      <v-img v-if="profilePreview" :src="profilePreview"></v-img>
                      <v-img v-else src="@/assets/avatar2.jpg"></v-img>
                    </v-avatar>
                    <v-btn
                      icon
                      small
                      class="upload-btn"
                      color="primary"
                      @click="$refs.fileInput.click()"
                    >
                      <v-icon>mdi-camera</v-icon>
                    </v-btn>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="onFileSelected"
                  />
                  <p class="upload-hint">Upload profile picture (Optional)</p>
                </div>

                <v-row>
                  <v-col cols="12" md="6">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="name"
                      rules="required"
                    >
                      <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <v-text-field
                          v-model="form.name"
                          placeholder="Enter your full name"
                          outlined
                          dense
                          :error-messages="errors"
                          class="modern-input"
                        >
                          <template v-slot:prepend-inner>
                            <v-icon color="#667eea">mdi-account-outline</v-icon>
                          </template>
                        </v-text-field>
                      </div>
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12" md="6">
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
                  </v-col>

                  <v-col cols="12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="phone"
                      rules="phone"
                    >
                      <div class="form-group">
                        <label class="form-label">Phone Number (Optional)</label>
                        <v-text-field
                          v-model="form.phone"
                          placeholder="+1234567890"
                          outlined
                          dense
                          :error-messages="errors"
                          class="modern-input"
                        >
                          <template v-slot:prepend-inner>
                            <v-icon color="#667eea">mdi-phone-outline</v-icon>
                          </template>
                        </v-text-field>
                      </div>
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12" md="6">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="password"
                      rules="required|strong_password"
                    >
                      <div class="form-group">
                        <label class="form-label">Password</label>
                        <v-text-field
                          v-model="form.password"
                          placeholder="Create a strong password"
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
                  </v-col>

                  <v-col cols="12" md="6">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="confirmPassword"
                      rules="required|confirmed:password"
                    >
                      <div class="form-group">
                        <label class="form-label">Confirm Password</label>
                        <v-text-field
                          v-model="form.confirmPassword"
                          placeholder="Confirm your password"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          outlined
                          dense
                          :error-messages="errors"
                          class="modern-input"
                        >
                          <template v-slot:prepend-inner>
                            <v-icon color="#667eea">mdi-lock-check-outline</v-icon>
                          </template>
                          <template v-slot:append>
                            <v-icon @click="showConfirmPassword = !showConfirmPassword" class="password-toggle">
                              {{ showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                            </v-icon>
                          </template>
                        </v-text-field>
                      </div>
                    </ValidationProvider>
                  </v-col>
                </v-row>

                <v-btn
                  :disabled="invalid"
                  :loading="loading"
                  type="submit"
                  class="register-btn"
                  large
                  block
                >
                  <v-icon left>mdi-account-plus</v-icon>
                  Create Account
                </v-btn>
              </v-form>
            </ValidationObserver>

            <!-- Divider -->
            <div class="divider-section">
              <div class="divider-line"></div>
              <span class="divider-text">or sign up with</span>
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
              Sign up with Google
            </v-btn>

            <!-- Login Link -->
            <div class="login-section">
              <span class="login-text">Already have an account?</span>
              <a @click="$router.push('/login')" class="login-link">
                Sign In
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
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      },
      profileImage: null,
      profilePreview: null,
      showPassword: false,
      showConfirmPassword: false,
      loading: false
    }
  },
  methods: {
    onFileSelected(event) {
      const file = event.target.files[0]
      if (file) {
        this.profileImage = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.profilePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    loginWithGoogle() {
      window.location.href = `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}/auth/google`
    },
    async register() {
      this.loading = true
      try {
        const { confirmPassword, ...userData } = this.form
        
        // If profile image is selected, we'll need to handle it
        // For now, we'll just send the basic data as the backend doesn't support it yet
        // TODO: Update when backend supports profile image upload
        if (this.profileImage) {
          // Store in localStorage temporarily or handle with FormData when backend is ready
          console.log('Profile image selected:', this.profileImage.name)
        }
        
        await this.$store.dispatch('auth/register', userData)
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Registration successful! Please check your email for verification.',
          color: 'success'
        })
        this.$router.push({
          name: 'VerifyEmail',
          query: { email: this.form.email }
        })
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: error.response?.data?.message || 'Registration failed',
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
  padding: 40px 0;
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

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

.brand-section {
  text-align: center;
  margin-bottom: 32px;
  animation: fadeIn 1s ease-out 0.2s both;
}

.brand-icon {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.brand-title {
  font-size: 2.25rem;
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

.profile-upload-section {
  text-align: center;
  margin-bottom: 32px;
  animation: fadeIn 1s ease-out 0.5s both;
}

.profile-preview {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.profile-avatar {
  border: 4px solid rgba(14, 165, 233, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  border-color: rgba(14, 165, 233, 0.4);
  transform: scale(1.05);
}

.upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.upload-hint {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.auth-form {
  margin-bottom: 32px;
  animation: fadeIn 1s ease-out 0.6s both;
}

.form-group {
  margin-bottom: 0;
  animation: slideInLeft 0.5s ease-out both;
}

.form-group:nth-child(1) { animation-delay: 0.7s; }
.form-group:nth-child(2) { animation-delay: 0.75s; }
.form-group:nth-child(3) { animation-delay: 0.8s; }
.form-group:nth-child(4) { animation-delay: 0.85s; }
.form-group:nth-child(5) { animation-delay: 0.9s; }

.form-label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  font-size: 0.9rem;
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

.register-btn {
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
  margin-top: 8px;
  animation: fadeIn 1s ease-out 1s both;
  position: relative;
  overflow: hidden;
}

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.register-btn:hover::before {
  left: 100%;
}

.register-btn:hover {
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.5);
  transform: translateY(-2px);
}

.divider-section {
  display: flex;
  align-items: center;
  margin: 32px 0;
  animation: fadeIn 1s ease-out 1.1s both;
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

.login-section {
  text-align: center;
  animation: fadeIn 1s ease-out 1.2s both;
}

.login-text {
  color: #64748b;
  font-weight: 500;
  margin-right: 8px;
}

.login-link {
  color: #0ea5e9;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.login-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #0ea5e9, #06b6d4);
  transition: width 0.3s ease;
}

.login-link:hover::after {
  width: 100%;
}

.login-link:hover {
  color: #06b6d4;
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

@media (max-width: 600px) {
  .auth-card {
    padding: 32px 24px;
    border-radius: 24px;
  }

  .brand-title {
    font-size: 1.75rem;
  }

  .brand-icon {
    font-size: 48px !important;
  }
}
</style>