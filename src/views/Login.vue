<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login to ShopNova</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <ValidationObserver ref="observer" v-slot="{ invalid }">
              <v-form @submit.prevent="login">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="form.email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-account"
                    type="email"
                    :error-messages="errors"
                  />
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors }"
                  name="password"
                  rules="required|min:6"
                >
                  <v-text-field
                    v-model="form.password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    :error-messages="errors"
                  />
                </ValidationProvider>

                <v-btn
                  :disabled="invalid"
                  :loading="loading"
                  color="primary"
                  large
                  block
                  type="submit"
                  class="mt-4"
                >
                  Login
                </v-btn>
              </v-form>
            </ValidationObserver>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="$router.push('/forgot-password')">
              Forgot Password?
            </v-btn>
          </v-card-actions>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <span class="text-body-2">Don't have an account?</span>
            <v-btn text color="primary" @click="$router.push('/register')">
              Register
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
  methods: {
    async login() {
      this.loading = true
      try {
        await this.$store.dispatch('auth/login', this.form)
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Login successful!',
          color: 'success'
        })
        this.$router.push('/')
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