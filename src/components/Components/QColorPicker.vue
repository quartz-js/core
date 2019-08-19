<template>
  <v-row align="center">
    <v-menu :offset-x="false" offset-overflow :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-btn :disabled="$attrs.disabled" v-on="on" v-bind:style="{background: $attrs.value}" style='border: 1px solid #cacaca' text class="ma-0" small width='28' height='28' min-width='0'></v-btn>
      </template>
      <v-color-picker v-model="attributes.value" mode="hexa" :show-swatches="true" :hide-mode-switch="true" @input="$emit('input', attributes.value)"></v-color-picker>
    </v-menu>
    <v-subheader>{{ $attrs.label }}</v-subheader>
  </v-row>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement],
  mounted() {

    // set btn same 
    this.$el
  }
}
</script>