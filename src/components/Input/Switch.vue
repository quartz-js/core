<template>
  <div>
      <v-switch v-model="rawValue" :label='attribute.getLabel()'></v-switch>
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
    var option = this.attribute.extractValue(this.value);
    this.rawValue = option ? option.value : null;
  },
  methods: {
    onChange: function () {
      var index = this.rawValue ? 1 : 0;
      this.attribute.injectValue(this.value, index);

      this.$emit('input', this.value);
      this.$forceUpdate();
    }
  }
}

</script>