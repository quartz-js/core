<template>
  <div v-if="show" class="mt-4">
    <v-text-field 
      type="password"
      v-model="rawValue" 
      :label="label !== undefined ? label : getAttributeLabel(attribute)"
      @input="onChange()"
      :hint="hint !== undefined ? hint : getAttributeDescription(attribute) "
      persistent-hint
    ></v-text-field>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import Text from './Text';

export default {
  extends: Text,
}

</script>
