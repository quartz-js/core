<template>
  <div>

    <div class="form-group" >
      <label>{{ attribute.label }}</label>
      <div class="container-switch">
        {{ option.label }}
      </div>
    </div>
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
    var self = this;

    if (this.errors) {
      this.error = this.errors.find(function (error) {
        return error.label === self.attribute.name;
      });
    }
  },
  created () {
    if (!this.attribute.label) {
      this.attribute.label = this.$t(this.attribute.name);
    }
    var self = this;

    var res = this.attribute.options.findIndex(function (option) {
      return option.value === self.value;
    });

    this.rawValue = res === 1;
  },
  methods: {
    onChange: function () {
      var index = this.rawValue ? 1 : 0;
      console.log(index);
      this.$emit('input', this.attribute.options[index].value);
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
