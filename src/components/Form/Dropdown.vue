<template>

  <div class="select">
    <div @click="visible = true"><slot name="activator"><i class="fa fa-list dropdown"/></slot></div>
    <div
      v-on-clickaway="fade"
      v-if="visible"
      class="paper window">
      <slot name="window"/>
    </div>

  </div>
</template>

<script>

import { mixin as clickaway } from 'vue-clickaway';
require('pretty-checkbox/dist/pretty-checkbox.min.css');

export default {

  mixins: [ clickaway ],
  props: [ 'options', 'value'],
  data: function () {
    return {
      visible: false
    }
  },

  methods: {
    fade: function () {
      this.visible = false;
    }
  }
}

</script>

<style scoped>

.select {
  position: relative;
  font-size: 14px;
}

.select .window {
  position: absolute;
  right: 0;
  margin-top: 5px;
  text-align: left;
  z-index: 5;
}

.dropdown {
  cursor: pointer;
  font-size: 19px;
}
</style>
