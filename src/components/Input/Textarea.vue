<template>
  <div v-if="show" class="mt-4">
    <q-textarea 
      v-model="rawValue" 
      :label="label !== undefined ? label : attribute.label"
      @input="onChange()"
      :hint="hint !== undefined ? hint : getAttributeDescription(attribute) "
      :placeholder="placeholder"
      v-bind="globalAttributeProps()"
    ></q-textarea>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import Text from './Text';

export default {
  extends: Text,
}

</script>
