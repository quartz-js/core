<template>
  <q-btn v-bind='attributes' v-on="$listeners"><slot></slot></q-btn>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>