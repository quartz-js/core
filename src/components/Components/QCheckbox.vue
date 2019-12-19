<template>
  <v-checkbox v-bind='attributes' v-on='$listeners'><slot></slot></v-checkbox>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>