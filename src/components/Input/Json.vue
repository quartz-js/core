<template>
  <div class="text-xs-left my-3">
    <label class="label-show">{{ attribute.getLabel() }}</label>
    <form-json v-model="rawValue" />
  </div>
</template>
<script>

import Text from './Text';
import FormJson from '@/components/Form/FormJson'

export default {
  extends: Text,
  components: {
    FormJson
  }
}

</script>