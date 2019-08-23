<template>
  <v-tabs v-bind='attributes' v-on='$listeners'><slot></slot></v-tabs>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>