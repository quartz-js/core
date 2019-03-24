<template>
  <div class="mt-4" v-if="show">
    <span>{{ getAttributeLabel(attribute) }}</span>
    <br>
    <toggle-button :value="rawValue" @change="onChange($event)" :height='28' :width="60" :sync="true" color="#1976d2"></toggle-button>
  </div>
</template>
<script>

import { BaseAttribute } from '../../attributes/BaseAttribute'
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
    color: rgba(0,0,0,0.54);
    font-size: 16px;
    margin-right: 5px;
  }
</style>