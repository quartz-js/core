<template>
  <v-snackbar v-bind='attributes' v-on='$listeners'><slot></slot></v-snackbar>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>