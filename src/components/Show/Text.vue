<template>
  <p>
      <label class="label-show">{{ attribute.getLabel() }}</label>
      <span v-if="html" class="show-value" v-html="html"/>
      <span v-if="!html" class="show-value font-italic " v-html="'No information available'"/>
  </p>
</template>
<script>

export default {
  props: ['resource', 'value', 'error', 'attribute', 'errors'],
  data() {
    return {
      html: null,
    }
  },
  created () {
    this.html = this.attribute.extractReadableValue(this.resource);
  }
}

</script>
<style scoped>
  .show-value {
    font-size: 14px;
  }

  .label-show {
    font-size: 12px;
    opacity: 0.8;
  }

  p {
    text-align: left;
  }

</style>
