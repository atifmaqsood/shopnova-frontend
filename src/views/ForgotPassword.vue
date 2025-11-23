<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Reset Password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div v-if="!otpSent">
              <p class="text-center mb-4">
                Enter your email address and we'll send you a reset code.
              </p>
              <ValidationObserver ref="observer" v-slot="{ invalid }">
                <v-form @submit.prevent="sendResetCode">
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

                  <v-btn
                    :disabled="invalid"
                    :loading="loading"
                    color="primary"
                    large
                    block
                    type="submit"
                    class="mt-4"
                  >
                    Send Reset Code
                  </v-btn>
                </v-form>
              </ValidationObserver>
            </div>

            <div v-else>
              <p class="text-center mb-4">
                Enter the reset code sent to <strong>{{ form.email }}</strong>
              </p>
              <ValidationObserver ref="resetObserver" v-slot="{ invalid }">
                <v-form @submit.prevent="resetPassword">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="otp"
                    rules="required"
                  >
                    <v-text-field
                      v-model="form.otp"
                      label="Reset Code"
                      name="otp"
                      prepend-icon="mdi-key"
                      :error-messages="errors"
                      maxlength="6"
                    />
                  </ValidationProvider>

                  <ValidationProvider
                    v-slot="{ errors }"
                    name="newPassword"
                    rules="required|strong_password"
                  >
                    <v-text-field
                      v-model="form.newPassword"
                      label="New Password"
                      name="newPassword"
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
                    Reset Password
                  </v-btn>
                </v-form>
              </ValidationObserver>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="$router.push('/login')">
              Back to Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      form: {
        email: '',
        otp: '',
        newPassword: ''
      },
      otpSent: false,
      showPassword: false,
      loading: false
    }
  },
  methods: {
    async sendResetCode() {
      this.loading = true
      try {
        await this.$store.dispatch('auth/forgotPassword', this.form.email)
        this.otpSent = true
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Reset code sent to your email!',
          color: 'success'
        })
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: error.response?.data?.message || 'Failed to send reset code',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async resetPassword() {
      this.loading = true
      try {
        await this.$store.dispatch('auth/resetPassword', {
          email: this.form.email,
          otp: this.form.otp,
          newPassword: this.form.newPassword
        })
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Password reset successfully!',
          color: 'success'
        })
        this.$router.push('/login')
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: error.response?.data?.message || 'Password reset failed',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>