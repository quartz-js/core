<template>
  <v-btn v-bind='attributes' v-on="$listeners">
	<q-icon v-if="!attributes.hideIcon && contentIcon">{{ contentIcon }}</q-icon>

	<span v-if="!attributes.hideText && contentText" v-bind:class="{'ml-2': !attributes.hideIcon && contentIcon}">{{ contentText }}</span>
  	<slot></slot>
  </v-btn>
</template>
<script>

import QElement from './QElement'

export default {
  mixins: [QElement],
  props: ['contentText', 'contentIcon']
}
</script>