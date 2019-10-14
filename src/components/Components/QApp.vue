<template>
  <div v-bind='attributes' v-on='$listeners'><slot></slot></div>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>