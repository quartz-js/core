<template>
  <div class="text-left my-3">
    <label class="label-show">{{ attribute.label }}</label>
    <form-html v-model="rawValue" @input="onChange()" />
  </div>
</template>
<script>

import Text from '../../components/Input/Text';
import FormHtml from '../../components/Form/FormHtml'

export default {
  extends: Text,
  components: {
    FormHtml
  }
}

</script>