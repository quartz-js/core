<template>
  <div>
      <v-switch v-model="rawValue" :label='attribute.getLabel()' @change="onChange"></v-switch>
  </div>
</template>
<script>

import Switches from 'vue-switches';
import { BaseAttribute } from '@railken/quartz-core/src/attributes/BaseAttribute'
import { AttributePreMount } from '@railken/quartz-core/src/mixins/AttributePreMount'

export default {
  components: {
    Switches
  },
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

      this.rawValue = option ? option.value : null;
    },
    onChange: function () {
      var index = this.rawValue ? 1 : 0;

      this.attribute.injectValue(this.value, index);

      this.$emit('input', this.value);
      this.$forceUpdate();
    }
  }
}

</script>