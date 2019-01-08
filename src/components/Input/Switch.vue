<template>
  <div>
      <v-switch v-model="rawValue" :label='attribute.getLabel()' @change="onChange"></v-switch>
  </div>
</template>
<script>

import Switches from 'vue-switches';
import { AttributePreMount } from '@railken/quartz-core/src/mixins/AttributePreMount'

export default {
  components: {
    Switches
  },
  mixins: [
    AttributePreMount
  ],
  props: ['value', 'error', 'attribute', 'errors'],
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

      this.rawValue = option ? option : null;
    },
    onChange: function () {

      console.log(index);

      this.attribute.injectValue(this.value, index);

      this.$emit('input', this.value);
      this.$forceUpdate();
    }
  }
}

</script>