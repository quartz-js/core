<template>
  <v-app v-bind='attributes' v-on='$listeners'><slot></slot></v-app>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>