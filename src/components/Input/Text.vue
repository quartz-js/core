<template>
  <v-flex v-if="show" class="mt-4" >
    <q-text-field 
      v-model="rawValue" 
      :label="label !== undefined ? label : attribute.label"
      @input="onChange()"
      :hint="hint !== undefined ? hint : getAttributeDescription(attribute)"
      v-bind="globalAttributeProps()"
    ></q-text-field>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </v-flex>
</template>
<script>

import { BaseAttribute } from '../../app/Attributes/BaseAttribute'
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
    },
    height: {
      type: Number,
      default: 90
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
  	value: {
      handler: function (){
      	this.reloadRawValue();
    	},
      deep: true
    }
  },
  methods: {
  	async reloadRawValue() {
    	this.rawValue = await this.attribute.extractValue(this.value);
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
