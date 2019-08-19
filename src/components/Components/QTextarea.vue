<template>
  <v-textarea v-bind='attributes' v-on='$listeners'><slot></slot></v-textarea>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>