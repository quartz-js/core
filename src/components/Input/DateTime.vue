<template>
  <div v-if="show">

    <v-menu
      :close-on-content-click="false"
      v-model="menu"
      full-width
      min-width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="rawValue" 
        :label="attribute.getLabel()"
        :hint="attribute.getDescription()"
        @input="onChange()"
        persistent-hint
        clearable
        readonly
      ></v-text-field>
      <v-date-picker
        v-model="rawValue"
        @change="menu = false; onChange()"
      ></v-date-picker>
    </v-menu>
  </div>
</template>
<script>

import { BaseAttribute } from '@/attributes/BaseAttribute'
import { AttributePreMount } from '@/mixins/AttributePreMount'

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
      menu: false
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
<style scoped>
  .v-messages__message {
    line-height: inherit !important;
  }
</style>
