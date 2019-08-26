<template>
  <v-icon v-bind='attributes' v-on='$listeners'><slot></slot></v-icon>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>