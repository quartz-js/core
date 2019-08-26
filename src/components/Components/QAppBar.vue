<template>
  <v-app-bar v-bind='attributes' v-on='$listeners' :clipped-left="$container.get('style.q-sidebar.clipped')"><slot></slot></v-app-bar>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>