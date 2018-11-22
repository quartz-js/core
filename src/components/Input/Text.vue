<template>
  <div>
    <v-text-field v-model="rawValue" :label="attribute.label" @input="onChange()"></v-text-field>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

export default {
  props: ['value', 'error', 'attribute', 'errors'],
  data () {
    return {
      rawValue: null
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
    this.rawValue = this.attribute.extractValue(this.value);

    if (!this.attribute.label) {
      this.attribute.label = this.$t(this.attribute.name);
    }
  },
  methods: {
    onChange: function () {
      this.attribute.injectValue(this.value, this.rawValue);
      this.$emit('input', this.rawValue);
    }

  }
}

</script>
