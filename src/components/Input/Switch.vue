<template>
  <div class="mt-4 ml-3" v-if="show">
    <v-switch v-model="rawValue" inset :height='24' :width="50" :sync="true" color="#1976d2" :label="attribute.label" @change="onChange()"></v-switch>
    
  </div>
</template>
<script>

import { ToggleButton } from 'vue-js-toggle-button'
import Text from './Text';

export default {
  extends: Text,
  components: {
    ToggleButton
  }
}

</script>
<style scoped>
  span {
    display: block;
    color: rgba(0,0,0,0.54);
    font-size: 12px;
    margin-top: -3px;
    margin-right: 5px;
    margin-bottom: 8px;
  }
</style>