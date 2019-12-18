<template>
  <div v-if="show">
    <q-textarea 
      v-model="rawValue"
      :rows="(height-30)/18"
      :height="height"
      :label="label !== undefined ? label : attribute.label"
      @input="onChange()"
      :hint="hint !== undefined ? hint : getAttributeDescription(attribute)"
      :placeholder="placeholder"
      no-resize
      v-bind="globalAttributeProps()"
    ></q-textarea>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import Text from './Text';

export default {
  extends: Text
}

</script>
