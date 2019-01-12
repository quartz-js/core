<template>
  <div class="text-xs-left my-3">
    <label class="label-show">{{ attribute.getLabel() }}</label>
    <yaml v-model="rawValue" @input="onChange()" />
  </div>
</template>
<script>

import Text from './Text';
import Yaml from '@/components/Form/Yaml'

export default {
  extends: Text,
  components: {
    Yaml
  }
}

</script>