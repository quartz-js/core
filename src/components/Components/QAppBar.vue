<template>
  <v-app-bar v-bind='attributes' v-on='$listeners'><slot></slot></v-app-bar>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>