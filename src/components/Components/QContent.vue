<template>
  <v-content v-bind='attributes' v-on='$listeners'><slot></slot></v-content>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>