<template>
  <div v-if="show">
    <v-text-field 
      class="mt-3"
      v-model="rawValue" 
      :label="label !== undefined ? label : getAttributeLabel(attribute)"
      @input="onChange()"
      :hint="hint !== undefined ? hint : getAttributeDescription(attribute)"
      persistent-hint
    ></v-text-field>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import { BaseAttribute } from '../../attributes/BaseAttribute'
import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'

export default {
  mixins: [
    AttributePreMount,
    ResourceLocalization
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
      type: BaseAttribute,
      required: true
    },
    errors: {
      required: true
    }
  },
  data() {
    return {
    	rawValue: null,
    }
  },
  mounted () {

    if (!this.canMount()) {
      return;
    }
    
    this.reloadRawValue();
  },
  watch: {
  	value: function (){
    	this.reloadRawValue();
  	}
  },
  methods: {
  	reloadRawValue() {
    	this.rawValue = this.attribute.extractValue(this.value);
  	},
    onChange () {
      var val = this.rawValue !== "" ? this.rawValue : null;

      this.attribute.injectValue(this.value, val);

      this.$emit('input', this.value);
    }

  }
}

</script>
<style scoped>
  .v-messages__message {
    line-height: inherit !important;
  }
</style>
