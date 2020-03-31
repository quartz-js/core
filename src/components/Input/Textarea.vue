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
      :disabled="isDisabled()"
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
<style>
.v-textarea > .v-input__control > .v-input__slot > .v-text-field__slot {
  max-height: 100%;
}
</style>