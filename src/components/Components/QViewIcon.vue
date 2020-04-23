<template>
  <v-img v-bind='attributes' v-on='$listeners'/>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>