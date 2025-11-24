<template>
  <footer class="modern-footer">
    <div class="footer-content">
      <v-container>
        <v-row>
          <!-- Brand Section -->
          <v-col cols="12" md="4" class="mb-6">
            <div class="brand-section">
              <div class="footer-logo mb-4">
                <v-icon size="40" color="white" class="mr-2">mdi-shopping</v-icon>
                <h2 class="brand-title d-inline">ShopNova</h2>
              </div>
              <p class="brand-description">
                Your premier destination for quality products and exceptional shopping experience.
              </p>
              <div class="social-links mt-6">
                <v-btn icon class="social-btn" href="#" aria-label="Facebook">
                  <v-icon>mdi-facebook</v-icon>
                </v-btn>
                <v-btn icon class="social-btn" href="#" aria-label="Twitter">
                  <v-icon>mdi-twitter</v-icon>
                </v-btn>
                <v-btn icon class="social-btn" href="#" aria-label="Instagram">
                  <v-icon>mdi-instagram</v-icon>
                </v-btn>
                <v-btn icon class="social-btn" href="#" aria-label="LinkedIn">
                  <v-icon>mdi-linkedin</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>

          <!-- Quick Links -->
          <v-col cols="6" md="2" class="mb-6">
            <div class="footer-section">
              <h3 class="section-title">Shop</h3>
              <ul class="footer-links">
                <li><router-link to="/products">All Products</router-link></li>
                <li><router-link to="/products">Categories</router-link></li>
                <li><router-link to="/products">New Arrivals</router-link></li>
                <li><router-link to="/products">Best Sellers</router-link></li>
              </ul>
            </div>
          </v-col>

          <!-- Customer Service -->
          <v-col cols="6" md="2" class="mb-6">
            <div class="footer-section">
              <h3 class="section-title">Support</h3>
              <ul class="footer-links">
                <li><router-link to="/account">My Account</router-link></li>
                <li><router-link to="/orders">Track Order</router-link></li>
                <li><router-link to="/cart">Shopping Cart</router-link></li>
                <li><router-link to="/">Help Center</router-link></li>
              </ul>
            </div>
          </v-col>

          <!-- Newsletter -->
          <v-col cols="12" md="4" class="mb-6">
            <div class="footer-section">
              <h3 class="section-title">Stay Connected</h3>
              <p class="newsletter-text">Subscribe to get special offers, free giveaways, and exclusive deals.</p>
              <div class="newsletter-form">
                <v-text-field
                  v-model="email"
                  placeholder="Your email address"
                  dense
                  outlined
                  hide-details
                  class="newsletter-input"
                  dark
                >
                  <template v-slot:append>
                    <v-btn
                      color="primary"
                      small
                      depressed
                      class="newsletter-btn-inline"
                      @click="subscribe"
                    >
                      <v-icon small>mdi-send</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6" class="text-center text-md-left">
            <p class="copyright mb-2">
              © {{ currentYear }} ShopNova. All rights reserved.
            </p>
            <p class="developer-credit">
              Developed with <v-icon small color="red" class="mx-1">mdi-heart</v-icon> by <strong>Atif Maqsood</strong>
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-center text-md-right">
            <div class="footer-bottom-links">
              <router-link to="/">Privacy Policy</router-link>
              <router-link to="/">Terms of Service</router-link>
              <router-link to="/">Cookies</router-link>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      email: ''
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  },
  methods: {
    subscribe() {
      if (this.email) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Thank you for subscribing!',
          color: 'success'
        })
        this.email = ''
      }
    }
  }
}
</script>

<style scoped>
.modern-footer {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: #ffffff;
  margin-top: auto;
  position: relative;
  overflow: hidden;
}

.modern-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.5), transparent);
}

.footer-content {
  padding: 60px 0 40px;
  position: relative;
}

.brand-section {
  max-width: 350px;
}

.footer-logo {
  display: flex;
  align-items: center;
}

.brand-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.brand-description {
  color: #cbd5e1;
  line-height: 1.7;
  margin-bottom: 0;
  font-size: 0.95rem;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-btn {
  background: rgba(14, 165, 233, 0.1) !important;
  color: #0ea5e9 !important;
  transition: all 0.3s ease;
  border: 1px solid rgba(14, 165, 233, 0.2);
}

.social-btn:hover {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%) !important;
  color: white !important;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.footer-section {
  height: 100%;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #ffffff;
  position: relative;
  padding-bottom: 12px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #0ea5e9, #06b6d4);
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 14px;
}

.footer-links a {
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: inline-block;
}

.footer-links a:hover {
  color: #0ea5e9;
  transform: translateX(5px);
}

.newsletter-text {
  color: #cbd5e1;
  font-size: 0.95rem;
  margin-bottom: 20px;
  line-height: 1.6;
}

.newsletter-input >>> .v-input__slot {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(14, 165, 233, 0.3) !important;
}

.newsletter-input >>> input {
  color: white !important;
}

.newsletter-input >>> input::placeholder {
  color: rgba(255, 255, 255, 0.5) !important;
}

.newsletter-btn-inline {
  margin-right: -8px;
  border-radius: 4px !important;
}

.footer-bottom {
  background: rgba(0, 0, 0, 0.3);
  padding: 24px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright {
  color: #94a3b8;
  margin: 0;
  font-size: 0.9rem;
}

.developer-credit {
  color: #94a3b8;
  margin: 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.developer-credit strong {
  color: #0ea5e9;
  margin-left: 4px;
}

@media (min-width: 960px) {
  .developer-credit {
    justify-content: flex-start;
  }
}

.footer-bottom-links {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (min-width: 960px) {
  .footer-bottom-links {
    justify-content: flex-end;
  }
}

.footer-bottom-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: #0ea5e9;
}

@media (max-width: 960px) {
  .footer-content {
    padding: 40px 0 30px;
  }
  
  .brand-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 600px) {
  .footer-bottom-links {
    gap: 16px;
  }
  
  .developer-credit {
    margin-top: 8px;
  }
}
</style>