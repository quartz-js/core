<template>
  <v-text-field v-bind='attributes' v-on='$listeners'><slot></slot></v-text-field>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>