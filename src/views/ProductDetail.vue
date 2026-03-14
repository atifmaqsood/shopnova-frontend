<template>
  <div class="product-detail-page">
    <v-container v-if="loading" class="py-16">
      <v-row>
        <v-col cols="12" md="6">
          <v-skeleton-loader type="image" height="500" />
        </v-col>
        <v-col cols="12" md="6">
          <v-skeleton-loader type="article, actions" />
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else-if="product" class="py-12">
      <v-row>
        <!-- Gallery -->
        <v-col cols="12" md="6">
          <div class="product-gallery">
            <v-card class="main-image-card glass-panel mb-4 overflow-hidden" elevation="4">
              <v-img :src="mainImage" height="500" contain class="zoom-image" />
            </v-card>
            <div class="thumbnail-row d-flex gap-2 overflow-x-auto pb-2">
              <v-card
                v-for="(img, i) in product.images"
                :key="i"
                class="thumb-card"
                :class="{ active: currentImg === i }"
                @click="currentImg = i"
                flat
              >
                <v-img :src="img" height="80" width="80" cover />
              </v-card>
            </div>
          </div>
        </v-col>

        <!-- Info -->
        <v-col cols="12" md="6">
          <div class="product-info-premium pl-md-8">
            <v-chip color="primary" small outlined label class="mb-4">
              {{ getCategoryName(product.categoryId) }}
            </v-chip>
            <h1 class="text-h2 font-weight-black mb-2">{{ product.name }}</h1>
            <div class="d-flex align-center mb-6">
              <v-rating
                :value="product.rating"
                color="amber"
                dense
                half-increments
                readonly
                size="20"
              />
              <span class="ml-2 grey--text">({{ product.reviews }} reviews)</span>
            </div>

            <div class="price-box d-flex align-center mb-8">
              <span class="text-h3 font-weight-bold primary--text mr-4">${{ product.price }}</span>
              <v-chip v-if="product.discount" color="secondary" small label>
                SAVE {{ product.discount }}%
              </v-chip>
            </div>

            <p class="text-body-1 grey--text text--darken-2 mb-8 line-height-relaxed">
              {{ product.description }}
            </p>

            <div class="action-box glass-panel pa-6 mb-8">
              <div class="d-flex align-center mb-6">
                <span class="font-weight-bold mr-4">Quantity:</span>
                <v-btn icon small outlined @click="qty > 1 && qty--" :disabled="qty <= 1">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span class="mx-6 font-weight-bold text-h6">{{ qty }}</span>
                <v-btn icon small outlined @click="qty < product.stock && qty++" :disabled="qty >= product.stock">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-spacer />
                <span class="text-caption" :class="product.stock > 0 ? 'success--text' : 'error--text'">
                  {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                </span>
              </div>

              <v-btn
                x-large
                block
                color="primary"
                rounded
                elevation="8"
                class="mb-4"
                @click="addToCart"
                :loading="adding"
                :disabled="product.stock === 0"
              >
                <v-icon left>mdi-cart-plus</v-icon>
                Add to Cart
              </v-btn>
              
              <v-btn block text color="secondary" rounded @click="toggleWishlist">
                <v-icon left>mdi-heart-outline</v-icon>
                Add to Wishlist
              </v-btn>
            </div>

            <div class="trust-badges d-flex justify-space-around py-4 grey lighten-5 rounded-lg">
              <div class="text-center">
                <v-icon color="grey">mdi-truck-fast-outline</v-icon>
                <div class="text-caption">Fast Shipping</div>
              </div>
              <v-divider vertical />
              <div class="text-center">
                <v-icon color="grey">mdi-shield-check-outline</v-icon>
                <div class="text-caption">Secure Pay</div>
              </div>
              <v-divider vertical />
              <div class="text-center">
                <v-icon color="grey">mdi-cached</v-icon>
                <div class="text-caption">Easy Returns</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Tabs / Reviews -->
      <v-row class="mt-16">
        <v-col cols="12">
          <v-tabs v-model="activeTab" color="primary" centered class="premium-tabs">
            <v-tab>Details</v-tab>
            <v-tab>Reviews ({{ product.reviews }})</v-tab>
            <v-tab>Shipping</v-tab>
          </v-tabs>
          <v-tabs-items v-model="activeTab" class="py-8 bg-transparent">
            <v-tab-item>
              <div class="max-width-800 mx-auto">
                <h3 class="text-h5 font-weight-bold mb-4">Product Specifications</h3>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td class="font-weight-bold" width="200">Material</td>
                        <td>Premium Quality Synthetic</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">Dimensions</td>
                        <td>10 x 5 x 2 inches</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">Weight</td>
                        <td>0.5 lbs</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="max-width-800 mx-auto">
                <div class="d-flex align-center justify-space-between mb-8">
                  <h3 class="text-h5 font-weight-bold">Customer Feedback</h3>
                  <v-btn color="primary" outlined>Write a Review</v-btn>
                </div>
                <div v-for="i in 3" :key="i" class="review-item mb-8 pa-6 glass-card">
                  <div class="d-flex align-center mb-4">
                    <v-avatar color="primary lighten-4" size="48" class="mr-4">
                      <v-icon color="primary">mdi-account</v-icon>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold">Demo User {{ i }}</div>
                      <v-rating value="5" color="amber" dense readonly size="16" />
                    </div>
                    <v-spacer />
                    <span class="text-caption grey--text">2 days ago</span>
                  </div>
                  <p class="mb-0">This product is absolutely amazing! The quality exceeded my expectations and the delivery was very fast. Highly recommended to everyone looking for premium products.</p>
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProductDetail',
  props: ['id'],
  data() {
    return {
      product: null,
      loading: true,
      currentImg: 0,
      qty: 1,
      adding: false,
      activeTab: 0
    };
  },
  computed: {
    ...mapGetters({
      categories: 'categories/categories'
    }),
    mainImage() {
      return this.product?.images?.[this.currentImg] || '';
    }
  },
  async created() {
    await this.loadProduct();
  },
  methods: {
    async loadProduct() {
      this.loading = true;
      try {
        const { mockApiService } = await import('@/services/mockApiService');
        this.product = await mockApiService.getProduct(this.id);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    getCategoryName(id) {
      const cat = this.categories.find(c => c.id === id);
      return cat ? cat.name : 'Category';
    },
    async addToCart() {
      this.adding = true;
      try {
        await this.$store.dispatch('cart/addToCart', {
          productId: this.product.id,
          quantity: this.qty,
          name: this.product.name,
          price: this.product.price,
          image: this.product.images[0]
        });
        this.$store.dispatch('ui/showSnackbar', { message: 'Added to cart!', color: 'success' });
      } finally {
        this.adding = false;
      }
    },
    toggleWishlist() {
      this.$store.dispatch('ui/showSnackbar', { message: 'Wishlist coming soon!', color: 'info' });
    }
  }
};
</script>

<style scoped>
.product-detail-page {
  background: radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.05), transparent);
}

.thumb-card {
  cursor: pointer;
  border: 2px solid transparent !important;
  border-radius: 8px !important;
  transition: all 0.2s;
  flex-shrink: 0;
}

.thumb-card.active {
  border-color: var(--primary) !important;
}

.zoom-image {
  transition: transform 0.5s ease;
}

.zoom-image:hover {
  transform: scale(1.1);
}

.line-height-relaxed {
  line-height: 1.8;
}

.max-width-800 {
  max-width: 800px;
}

.premium-tabs >>> .v-tabs-bar {
  background-color: transparent !important;
}

.bg-transparent {
  background-color: transparent !important;
}

.gap-2 {
  gap: 8px;
}
</style>