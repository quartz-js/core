<template>
  <v-dialog v-bind='attributes' v-on='$listeners' ><q-card><slot></slot></q-card></v-dialog>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>