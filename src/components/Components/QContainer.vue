<template>
  <div v-bind='attributes' v-on='$listeners' style='margin: 0 auto' :style="attributes.style"><slot></slot></div>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>