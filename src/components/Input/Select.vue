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

import { SelectAttribute } from '../../app/Attributes/SelectAttribute'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
import { AttributePreMount } from '../../mixins/AttributePreMount'

export default {
  mixins: [
    ResourceLocalization,
    AttributePreMount,
  ],
  props: {
    placeholder: {

    },
    label: {
      default: undefined
    },
    hint: {
      default: undefined
    },
    value: {
      required: true,
    },
    attribute: {
      type: SelectAttribute,
      required: true
    },
    errors: {
      required: true
    }
  },
  data: function () {
    return {
      rawValue: null
    }
  },
  watch: {
    value: function (){
      this.reloadRawValue();
    }
  },
  created () {
    if (!this.canMount()) {
      return;
    }
    
    this.reloadRawValue();

  },
  methods: {
    reloadRawValue() {
      var option = this.attribute.extractValue(this.value);

      this.rawValue = null;

      if (option) {
        this.query = option.label;
        this.rawValue = option.value;
      }

    },
    onChange: function (oldVal, newVal) {

      var option = this.attribute.getOptionByValue(this.rawValue);

      this.attribute.injectValue(this.value, option.value);

      this.$emit('input', this.value);

    },

  }
}

</script>