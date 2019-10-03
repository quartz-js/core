<template>
  <div v-if="show" class="mt-4">
    <v-menu
      :close-on-content-click="false"
      v-model="menu"
      full-width
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-on="on"
          icon
          v-model="rawValue" 
          :label="attribute.label"
          :hint="attribute.getDescription()"
          @input="onChange()"
          persistent-hint
          clearable
          readonly
          v-bind="globalAttributeProps()"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="rawValue"
        @change="menu = false; onChange()"
      ></v-date-picker>
    </v-menu>
  </div>
</template>
<script>

import { BaseAttribute } from '../../app/Attributes/BaseAttribute'
import { AttributePreMount } from '../../mixins/AttributePreMount'

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
