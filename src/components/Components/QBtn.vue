<template>
  <v-btn v-bind='attributes' v-on="$listeners">
	<v-icon v-if="attributes.hasIcon && contentIcon">{{ contentIcon }}</v-icon>

	<span v-if="attributes.hasText && contentText" v-bind:class="{'ml-2': attributes.hasIcon && contentIcon}">{{ contentText }}</span>
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