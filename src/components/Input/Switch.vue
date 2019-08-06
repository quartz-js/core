<template>
  <div class="mt-4" v-if="show">
    <span>{{ attribute.label }}</span>
    <toggle-button :value="rawValue" @change="onChange($event)" :height='24' :width="50" :sync="true" color="#1976d2"></toggle-button>
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
      var index = e.value ? 1 : 0;
      this.rawValue = e.value

      this.attribute.injectValue(this.value, index);

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