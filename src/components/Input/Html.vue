<template>
  <div class="text-xs-left my-3">
    <label class="label-show">{{ attribute.getLabel() }}</label>
    <form-html v-model="rawValue" @input="onChange()" />
  </div>
</template>
<script>

import Text from './Text';
import FormHtml from '@railken/quartz-core/src/components/Form/FormHtml'

export default {
  extends: Text,
  components: {
    FormHtml
  }
}

</script>