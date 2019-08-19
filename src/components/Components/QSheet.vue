<template>
  <v-sheet v-bind='attributes' v-on='$listeners'><slot></slot></v-sheet>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>