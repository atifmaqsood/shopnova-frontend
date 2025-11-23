<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Register for ShopNova</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <ValidationObserver ref="observer" v-slot="{ invalid }">
              <v-form @submit.prevent="register">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="name"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.name"
                    label="Full Name"
                    name="name"
                    prepend-icon="mdi-account"
                    :error-messages="errors"
                  />
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors }"
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="form.email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-email"
                    type="email"
                    :error-messages="errors"
                  />
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors }"
                  name="phone"
                  rules="phone"
                >
                  <v-text-field
                    v-model="form.phone"
                    label="Phone (Optional)"
                    name="phone"
                    prepend-icon="mdi-phone"
                    placeholder="+1234567890"
                    :error-messages="errors"
                  />
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors }"
                  name="password"
                  rules="required|strong_password"
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

                <ValidationProvider
                  v-slot="{ errors }"
                  name="confirmPassword"
                  rules="required|confirmed:password"
                >
                  <v-text-field
                    v-model="form.confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    prepend-icon="mdi-lock-check"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showConfirmPassword = !showConfirmPassword"
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
                  Register
                </v-btn>
              </v-form>
            </ValidationObserver>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <span class="text-body-2">Already have an account?</span>
            <v-btn text color="primary" @click="$router.push('/login')">
              Login
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
      showPassword: false,
      showConfirmPassword: false,
      loading: false
    }
  },
  methods: {
    async register() {
      this.loading = true
      try {
        const { confirmPassword, ...userData } = this.form
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