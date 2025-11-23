import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import user from './modules/user'
import products from './modules/products'
import categories from './modules/categories'
import cart from './modules/cart'
import orders from './modules/orders'
import notifications from './modules/notifications'
import ui from './modules/ui'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    user,
    products,
    categories,
    cart,
    orders,
    notifications,
    ui
  },
  strict: process.env.NODE_ENV !== 'production'
})