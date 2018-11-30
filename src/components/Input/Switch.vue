<template>
  <div>
      <v-switch v-model="rawValue" :label='attribute.getLabel()' @change="onChange"></v-switch>
  </div>
</template>
<script>

import Switches from 'vue-switches';

export default {
  components: {
    Switches
  },
  props: ['value', 'error', 'attribute', 'errors'],
  data () {
    return {
      rawValue: false
    }
  },
  created () {
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
      var index = this.rawValue ? 1 : 0;
      this.attribute.injectValue(this.value, index);

      this.$emit('input', this.value);
      this.$forceUpdate();
    }
  }
}

</script>