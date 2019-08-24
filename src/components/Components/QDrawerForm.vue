<template>
  <v-navigation-drawer v-bind='attributes' v-on='$listeners'><slot></slot></v-navigation-drawer>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>