const state = {
  loading: false,
  snackbar: {
    show: false,
    message: '',
    color: 'info',
    timeout: 4000
  },
  drawer: false,
  darkMode: localStorage.getItem('darkMode') === 'true'
}

const getters = {
  loading: state => state.loading,
  snackbar: state => state.snackbar,
  drawer: state => state.drawer,
  darkMode: state => state.darkMode
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_SNACKBAR(state, snackbar) {
    Object.assign(state.snackbar, snackbar)
  },
  SET_DRAWER(state, drawer) {
    state.drawer = drawer
  },
  SET_DARK_MODE(state, darkMode) {
    state.darkMode = darkMode
    localStorage.setItem('darkMode', darkMode.toString())
  }
}

const actions = {
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading)
  },
  showSnackbar({ commit }, { message, color = 'info', timeout = 4000 }) {
    commit('SET_SNACKBAR', { show: true, message, color, timeout })
  },
  hideSnackbar({ commit }) {
    commit('SET_SNACKBAR', { show: false })
  },
  toggleDrawer({ commit, state }) {
    commit('SET_DRAWER', !state.drawer)
  },
  toggleDarkMode({ commit, state }) {
    commit('SET_DARK_MODE', !state.darkMode)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}