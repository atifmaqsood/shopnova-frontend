<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Verify Your Email</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div class="text-center mb-4">
              <v-icon size="64" color="primary">mdi-email-check</v-icon>
              <p class="mt-4">
                We've sent a verification code to <strong>{{ email }}</strong>
              </p>
            </div>
            
            <ValidationObserver ref="observer" v-slot="{ invalid }">
              <v-form @submit.prevent="verifyEmail">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="otp"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.otp"
                    label="Verification Code"
                    name="otp"
                    prepend-icon="mdi-key"
                    :error-messages="errors"
                    maxlength="6"
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
                  Verify Email
                </v-btn>
              </v-form>
            </ValidationObserver>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn 
              text 
              :loading="resending"
              @click="resendOtp"
            >
              Resend Code
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'VerifyEmail',
  data() {
    return {
      form: {
        otp: ''
      },
      loading: false,
      resending: false
    }
  },
  computed: {
    email() {
      return this.$route.query.email || ''
    }
  },
  methods: {
    async verifyEmail() {
      this.loading = true
      try {
        await this.$store.dispatch('auth/verifyEmail', {
          email: this.email,
          otp: this.form.otp
        })
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Email verified successfully!',
          color: 'success'
        })
        this.$router.push('/login')
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: error.response?.data?.message || 'Verification failed',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async resendOtp() {
      this.resending = true
      try {
        await this.$store.dispatch('auth/resendOtp', this.email)
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Verification code sent!',
          color: 'success'
        })
      } catch (error) {
        this.$store.dispatch('ui/showSnackbar', {
          message: 'Failed to resend code',
          color: 'error'
        })
      } finally {
        this.resending = false
      }
    }
  }
}
</script>