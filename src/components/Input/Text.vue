<template>
  <div v-if="show">
    <v-text-field v-model="rawValue" :label="attribute.getLabel()" @input="onChange()"></v-text-field>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import { BaseAttribute } from '@railken/vue-admin-core/src/attributes/BaseAttribute'
import { AttributePreMount } from '@railken/vue-admin-core/src/mixins/AttributePreMount'

export default {
  mixins: [
    AttributePreMount
  ],
  props: {
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
      this.$emit('input', val);
    }

  }
}

</script>
