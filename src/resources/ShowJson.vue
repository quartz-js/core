<template>
  <div>
    <div class="form-group">
      <label class="label-show">{{ attribute.label }}</label>
      <div
        id="json"
        ref="json"/>
    </div>
  </div>
</template>
<script>

import JSONFormatter from 'json-formatter-js'

export default {
  props: ['value', 'error', 'attribute', 'errors'],
  created () {
    this.rawValue = this.value;

    if (!this.attribute.label) {
      this.attribute.label = this.$t(this.attribute.name);
    }
  },

  mounted: function () {
    const formatter = new JSONFormatter(this.rawValue);
    this.$refs.json.appendChild(formatter.render());
  },
  methods: {
    onChange: function () {
      this.$emit('input', this.rawValue);
    }

  }
}

</script>
