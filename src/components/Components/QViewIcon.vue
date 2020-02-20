<template>
    <v-img v-bind='attributes' :src="src" v-on='$listeners' @error="viewDefault"/>
  </div>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement],
  data() {
    return {
      src: null
    }
  },
  methods: {
    viewDefault() {
      this.src = require('../../assets/view-default.svg')
    }
  },
  mounted() {
    this.src = this.$attrs.src;
  }
}
</script>