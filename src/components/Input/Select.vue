<template>
  <div v-if="show" class="mt-4">
    <q-autocomplete
        :items="attribute.options"
        item-text="label"
        :label="attribute.label"
        v-model="rawValue"
        @change="onChange()"
        clearable
        :hint="getAttributeDescription(attribute)"
        v-bind="globalAttributeProps()"
      ></q-autocomplete>
    <div
      v-if="error"
      class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import Text from './Text';

export default {
  extends: Text
}

</script>