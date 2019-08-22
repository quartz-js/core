<template>
  <div class="mt-4 ml-3" v-if="show">
    <v-switch v-model="rawValue" inset :height='24' :width="50" :sync="true" color="#1976d2" :label="attribute.label" @change="onChange()"></v-switch>
  </div>
</template>
<script>

import { BaseAttribute } from '../../app/Attributes/BaseAttribute'
import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'

import { ToggleButton } from 'vue-js-toggle-button'

export default {
  components: {
    ToggleButton
  },
  mixins: [
    ResourceLocalization,
    AttributePreMount
  ],
  props: {
    value: {
      required: true,
    },
    label: {
      default: undefined
    },
    hint: {
      default: undefined
    },
    attribute: {
      type: BaseAttribute,
      required: true
    },
    errors: {
      required: true
    }
  },
  data () {
    return {
      rawValue: false
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
      var option = this.attribute.extractValue(this.value);

      this.rawValue = option ? !!option.value : false;
    },
    onChange: function (e) {

      this.attribute.injectValue(this.value, this.rawValue);

      this.$emit('input', this.value);
      this.$forceUpdate();
    }
  }
}

</script>
<style scoped>
  span {
    display: block;
    color: rgba(0,0,0,0.54);
    font-size: 12px;
    margin-top: -3px;
    margin-right: 5px;
    margin-bottom: 8px;
  }
</style>