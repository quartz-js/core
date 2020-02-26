<template>
  <div v-if="show">
    <q-checkbox 
      v-model="rawValue"
      @change="changes"
      :label="label !== undefined ? label : attribute.label"
      :hint="hint !== undefined ? hint : getAttributeDescription(attribute)"
      v-bind="globalAttributeProps()"
      :disabled="isDisabled()"
    ></q-checkbox>
  </div>
</template>
<script>

import Text from './Text';

export default {
  extends: Text,
  methods: {
    changes($e) {
      this.rawValue = $e
      this.onChange()
    }
  }
}

</script>