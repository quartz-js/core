<template>
  <v-card v-bind='attributes' v-on='$listeners' v-bind:style="{
    border: $container.get('style.q-card.outlined') ? $container.get('style.q-card.borderSize') + 'px solid ' + $container.get('style.q-card.borderColor') : null
  } "><slot></slot></v-card>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>