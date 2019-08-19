<template>
  <v-autocomplete v-bind='attributes' v-on='$listeners'><slot></slot></v-autocomplete>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>