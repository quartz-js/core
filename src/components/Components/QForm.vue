<template>
  <div>
    <component :is="attributes.type ? attributes.type : 'q-navigation-drawer'" v-bind='attributes' v-on='$listeners'><slot></slot></component>
  </div>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement]
}
</script>