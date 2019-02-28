<template>
  <div class="mt-4">
    <v-autocomplete
        :items="attribute.options"
        item-text="label"
        :label="getAttributeLabel(attribute)"
        v-model="rawValue"
        @change="onChange()"
      :hint="getAttributeDescription(attribute)"
      persistent-hint
      ></v-autocomplete>
    <div
      v-if="error"
      class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import { ResourceLocalization } from '../../mixins/ResourceLocalization'

export default {
  mixins: [
    ResourceLocalization
  ],
  props: ['value', 'attribute', 'error', 'errors'],
  data: function () {
    return {
      rawValue: null
    }
  },
  created () {

    var option = this.attribute.extractValue(this.value);

    this.rawValue = null;

    if (option) {
      this.query = option.label;
      this.rawValue = option.value;
    }
  },
  methods: {
    onChange: function (oldVal, newVal) {

      var option = this.attribute.getOptionByValue(this.rawValue);

      this.attribute.injectValue(this.value, option.value);

      this.$emit('input', this.value);

    },

  }
}

</script>