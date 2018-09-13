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
    var res = this.attribute.options.findIndex((option) => {
      return option.value === this.value;
    });

    this.rawValue = res === 1;
  },
  methods: {
    onChange: function () {
      var index = this.rawValue ? 1 : 0;
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
