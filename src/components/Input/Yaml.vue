<template>
  <div class="text-left my-3">
    <label class="label-form mb-2">{{ attribute.label }}</label>
    <yaml 
    	v-model="rawValue"
    	@input="onChange()" 
    	@focus="showHint = true"
    	@blur="showHint = false"
      	:height="height-54"
      />
    <div class="v-messages theme--light mt-1" :class="{'hide': !showHint}">{{ hint }}Hint</div>
  </div>
</template>
<script>

import Text from './Text';
import Yaml from '../../components/Form/Yaml'

export default {
  extends: Text,
  components: {
    Yaml
  },
  data() {
  	return {
  		showHint: false
  	}
  }
}

</script>