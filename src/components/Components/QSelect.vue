<template>
  <v-select v-bind='attributes' v-on='$listeners'><slot></slot></v-select>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>