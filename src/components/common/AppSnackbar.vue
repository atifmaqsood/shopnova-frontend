<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    bottom
    right
  >
    {{ snackbar.message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="$store.dispatch('ui/hideSnackbar')"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppSnackbar',
  computed: {
    ...mapGetters({
      snackbar: 'ui/snackbar'
    })
  }
}
</script>