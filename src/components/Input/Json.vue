<template>
  <div class="text-left my-3">
    <label class="label-form mb-2">{{ attribute.label }}</label>
    <form-json 
    	v-model="rawValue"
    	@input="onChange()"
      	:height="height-50"
    />
  </div>
</template>
<script>

import Text from './Text';
import FormJson from '../../components/Form/FormJson'

export default {
  extends: Text,
  components: {
    FormJson
  }
}

</script>