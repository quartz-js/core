<template>
  <div v-if="show" class="mt-4">
    <datetime v-model="rawValue" type="datetime" :minute-step="5" ref="dateTimePicker" input-style="display:none" @input="onChange" v-if="loaded">
      <template slot="after">
        <q-text-field 
          :value="getDateFormat(rawValue)" 
          :label="attribute.label" 
          :hint="getAttributeDescription(attribute)"
          @click="$refs.dateTimePicker.isOpen = true"
          persistent-hint
        ></q-text-field>
      </template>
    </datetime>
  </div>
</template>
<script>

import { BaseAttribute } from '../../app/Attributes/BaseAttribute'
import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'

import moment from 'moment'


export default {
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
      rawValue: null,
      loaded: false
    }
  },
  mounted () {

    if (!this.canMount()) {
      return;
    }
    
    this.reloadRawValue().then(i => {
      this.loaded = true
    })
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
    getDateFormat(date)
    {
      return date ? moment(date).format('MMMM Do YYYY, HH:mm') : null
    },
  	async reloadRawValue() {
      let val = await this.attribute.extractValue(this.value)
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