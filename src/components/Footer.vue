<template>
  <footer class="modern-footer">
    <div class="footer-content">
      <v-container>
        <v-row>
          <!-- Brand Section -->
          <v-col cols="12" md="4" class="mb-6">
            <div class="brand-section">
              <h2 class="brand-title">ShopNova</h2>
              <p class="brand-description">
                Your premier destination for quality products and exceptional shopping experience.
              </p>
              <div class="social-links">
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
                <li><router-link to="/categories">Categories</router-link></li>
                <li><router-link to="/deals">Special Deals</router-link></li>
                <li><router-link to="/new-arrivals">New Arrivals</router-link></li>
              </ul>
            </div>
          </v-col>

          <!-- Customer Service -->
          <v-col cols="6" md="2" class="mb-6">
            <div class="footer-section">
              <h3 class="section-title">Support</h3>
              <ul class="footer-links">
                <li><router-link to="/contact">Contact Us</router-link></li>
                <li><router-link to="/faq">FAQ</router-link></li>
                <li><router-link to="/shipping">Shipping Info</router-link></li>
                <li><router-link to="/returns">Returns</router-link></li>
              </ul>
            </div>
          </v-col>

          <!-- Company -->
          <v-col cols="6" md="2" class="mb-6">
            <div class="footer-section">
              <h3 class="section-title">Company</h3>
              <ul class="footer-links">
                <li><router-link to="/about">About Us</router-link></li>
                <li><router-link to="/careers">Careers</router-link></li>
                <li><router-link to="/press">Press</router-link></li>
                <li><router-link to="/blog">Blog</router-link></li>
              </ul>
            </div>
          </v-col>

          <!-- Newsletter -->
          <v-col cols="12" md="2" class="mb-6">
            <div class="footer-section">
              <h3 class="section-title">Newsletter</h3>
              <p class="newsletter-text">Get updates on new products and exclusive offers</p>
              <div class="newsletter-form">
                <v-text-field
                  v-model="email"
                  placeholder="Enter email"
                  dense
                  outlined
                  hide-details
                  class="newsletter-input"
                />
                <v-btn
                  color="primary"
                  small
                  class="newsletter-btn mt-2"
                  @click="subscribe"
                >
                  Subscribe
                </v-btn>
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
          <v-col cols="12" md="6">
            <p class="copyright">
              © {{ currentYear }} ShopNova. All rights reserved.
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <div class="footer-bottom-links">
              <router-link to="/privacy">Privacy Policy</router-link>
              <router-link to="/terms">Terms of Service</router-link>
              <router-link to="/cookies">Cookie Policy</router-link>
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
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffffff;
  margin-top: auto;
}

.footer-content {
  padding: 60px 0 40px;
}

.brand-section {
  max-width: 300px;
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 16px;
}

.brand-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 8px;
}

.social-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: #1976d2 !important;
  transform: translateY(-2px);
}

.footer-section {
  height: 100%;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #ffffff;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #b0b0b0;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: #1976d2;
}

.newsletter-text {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.5;
}

.newsletter-input {
  margin-bottom: 8px;
}

.newsletter-btn {
  width: 100%;
  text-transform: none;
  font-weight: 500;
}

.footer-bottom {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright {
  color: #b0b0b0;
  margin: 0;
  font-size: 0.9rem;
}

.footer-bottom-links {
  display: flex;
  gap: 24px;
  justify-content: flex-end;
}

.footer-bottom-links a {
  color: #b0b0b0;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: #1976d2;
}

@media (max-width: 960px) {
  .footer-content {
    padding: 40px 0 30px;
  }
  
  .brand-title {
    font-size: 1.75rem;
  }
  
  .footer-bottom-links {
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .footer-bottom-links {
    flex-direction: column;
    gap: 8px;
  }
}
</style>