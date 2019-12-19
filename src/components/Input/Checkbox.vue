<template>
  <div v-if="show">
    <q-checkbox 
      v-model="rawValue" 
      :label="label !== undefined ? label : attribute.label"
      @change="onChange()"
      :hint="hint !== undefined ? hint : getAttributeDescription(attribute)"
      v-bind="globalAttributeProps()"
    ></q-checkbox>
  </div>
</template>
<script>

import Text from './Text';

export default {
  extends: Text
}

</script>