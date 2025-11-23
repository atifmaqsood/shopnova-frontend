<template>
  <v-overlay :value="loading" z-index="9999">
    <v-progress-circular
      indeterminate
      size="64"
      color="primary"
    />
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppLoader',
  computed: {
    ...mapGetters({
      loading: 'ui/loading'
    })
  }
}
</script>