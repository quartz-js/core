<template>
  <div>
      <md-switch v-model="rawValue" class="md-primary">{{ attribute.label }}</md-switch>
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
  mounted () {

    if (this.errors) {
      this.error = this.errors.find((error) => {
        return error.label === this.attribute.name;
      });
    }
  },
  created () {
    if (!this.attribute.label) {
      this.attribute.label = this.$t(this.attribute.name);
    }

    var option = this.attribute.extractValue(this.value);
    this.rawValue = option.value;
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
<style scoped>
.container-switch {
  padding-top: 10px;
  padding-left: 5px;
  position: relative;
}
</style>
