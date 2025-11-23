import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, email, min, confirmed } from 'vee-validate/dist/rules'

// Install rules
extend('required', {
  ...required,
  message: 'This field is required',
})

extend('email', {
  ...email,
  message: 'Please enter a valid email address',
})

extend('min', {
  ...min,
  message: 'This field must be at least {length} characters',
})

extend('confirmed', {
  ...confirmed,
  message: 'Passwords do not match',
})

extend('phone', {
  validate: (value) => {
    if (!value) return true
    return /^\+[1-9]\d{1,14}$/.test(value)
  },
  message: 'Please enter a valid phone number with country code',
})

extend('strong_password', {
  validate: (value) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
  },
  message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
})

// Register components globally
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)