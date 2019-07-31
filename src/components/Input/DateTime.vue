<template>
  <div v-if="show" class="mt-4">
    <datetime v-model="rawValue" type="datetime" :minute-step="5" ref="dateTimePicker" input-style="display:none" @input="onChange">
      <template slot="after">
        <v-text-field 
          :value="getDateFormat(rawValue)" 
          :label="getAttributeLabel(attribute)" 
          :hint="getAttributeDescription(attribute)"
          @click="$refs.dateTimePicker.isOpen = true"
          persistent-hint
        ></v-text-field>
      </template>
    </datetime>
  </div>
</template>
<script>

import { BaseAttribute } from '../../app/Attributes/BaseAttribute'
import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'

import { Datetime } from 'vue-datetime';
import Vue from 'vue'
import moment from 'moment'

Vue.use(require('vue-datetime'))
require('vue-datetime/dist/vue-datetime.css')


export default {
  components: {
    Datetime
  },
  mixins: [
    AttributePreMount,
    ResourceLocalization
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
    	rawValue: null
    }
  },
  created () {

    if (!this.canMount()) {
      return;
    }
    
    this.reloadRawValue();
  },
  watch: {
  	value: function (){
    	this.reloadRawValue();
  	},
  },
  methods: {
    getDateFormat(date)
    {
      return date ? moment(date).format('MMMM Do YYYY, HH:mm') : null
    },
  	reloadRawValue() {
      let val = this.attribute.extractValue(this.value)
    	this.rawValue = val ? moment(val).format() : null
  	},
    onChange () {
      let val = this.rawValue ? moment(this.rawValue).format('YYYY-MM-DD HH:mm:ss') : null;

      this.attribute.injectValue(this.value, val);
      this.$emit('input', this.value);
    }

  }
}

</script>