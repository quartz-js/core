<template>
  <v-container v-bind='attributes' v-on='$listeners'><slot></slot></v-container>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>