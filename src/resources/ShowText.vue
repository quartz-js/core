<template>
  <div>
    <div class="form-group">
      <label class="label-show">{{ attribute.label }}</label>
      <span
        class="show-value"
        v-html="attribute.extractReadableValue(resource)"/>
    </div>
  </div>
</template>
<script>

export default {
  props: ['resource', 'value', 'error', 'attribute', 'errors'],
  created () {
    var self = this;

    if (!this.attribute.label) {
      this.attribute.label = this.$t(this.attribute.name);
    }
  }
}

</script>
