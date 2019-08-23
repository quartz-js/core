<template>
  <v-btn v-bind='attributes' v-on="$listeners"><slot></slot></v-btn>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>