<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    temporary
    right
    width="400"
    class="cart-drawer"
  >
    <div class="d-flex flex-column h-100">
      <div class="pa-4 d-flex align-center justify-space-between border-bottom">
        <h2 class="text-h6 font-weight-bold">Shopping Cart ({{ itemCount }})</h2>
        <v-btn icon @click="drawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="flex-grow-1 overflow-y-auto pa-4">
        <div v-if="items.length === 0" class="text-center py-16">
          <v-icon size="80" color="grey lighten-2" class="mb-4">mdi-cart-outline</v-icon>
          <p class="grey--text">Your cart is empty</p>
          <v-btn color="primary" rounded @click="drawer = false">Start Shopping</v-btn>
        </div>
        
        <div v-else>
          <div v-for="item in items" :key="item.productId" class="cart-item-modern mb-4 glass-card pa-3">
            <div class="d-flex">
              <v-img :src="item.image" width="70" height="70" class="rounded-lg mr-3" cover />
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between mb-1">
                  <span class="font-weight-bold text-truncate" style="max-width: 180px;">{{ item.name }}</span>
                  <v-btn icon x-small color="error" @click="removeItem(item.productId)">
                    <v-icon small>mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
                <div class="primary--text font-weight-bold mb-2">${{ item.price }}</div>
                <div class="d-flex align-center">
                  <v-btn icon x-small outlined @click="updateQty(item.productId, item.quantity - 1)">
                    <v-icon small>mdi-minus</v-icon>
                  </v-btn>
                  <span class="mx-3 font-weight-bold">{{ item.quantity }}</span>
                  <v-btn icon x-small outlined @click="updateQty(item.productId, item.quantity + 1)">
                    <v-icon small>mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pa-6 border-top grey lighten-5">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-h6">Total</span>
          <span class="text-h6 font-weight-black primary--text">${{ total.toFixed(2) }}</span>
        </div>
        <v-btn
          block
          x-large
          color="primary"
          rounded
          elevation="4"
          :disabled="items.length === 0"
          @click="checkout"
        >
          Checkout Now
        </v-btn>
        <p class="text-center text-caption grey--text mt-3 mb-0">
          Free shipping on orders over $50
        </p>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CartDrawer',
  computed: {
    ...mapGetters({
      items: 'cart/items',
      total: 'cart/total',
      itemCount: 'cart/itemCount'
    }),
    drawer: {
      get() { return this.$store.getters['ui/cartDrawer']; },
      set(val) { this.$store.dispatch('ui/setCartDrawer', val); }
    }
  },
  methods: {
    removeItem(id) {
      this.$store.dispatch('cart/removeFromCart', id);
    },
    updateQty(id, qty) {
      if (qty <= 0) {
        this.removeItem(id);
      } else {
        this.$store.dispatch('cart/updateCartItem', { productId: id, quantity: qty });
      }
    },
    checkout() {
      this.drawer = false;
      this.$router.push('/checkout');
    }
  }
};
</script>

<style scoped>
.cart-drawer {
  z-index: 2000 !important;
}

.cart-item-modern {
  transition: all 0.2s;
}

.cart-item-modern:hover {
  border-color: var(--primary);
}

.h-100 {
  height: 100%;
}

.border-bottom {
  border-bottom: 1px solid #eee;
}

.border-top {
  border-top: 1px solid #eee;
}
</style>
