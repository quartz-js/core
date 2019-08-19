<template>
  <div class="text-left my-3 mt-4">
    <label class="label-show">{{ attribute.label }}</label>
    <yaml v-model="rawValue" @input="onChange()" />
  </div>
</template>
<script>

import Text from './Text';
import Yaml from '../../components/Form/Yaml'

export default {
  extends: Text,
  components: {
    Yaml
  }
}

</script>