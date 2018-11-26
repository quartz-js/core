<template>
  <div>
    <v-text-field v-model="rawValue" :label="attribute.getLabel()" @input="onChange()"></v-text-field>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import { BaseAttribute } from '@railken/vue-admin-core/src/attributes/BaseAttribute'

export default {
  props: {
    value: {
      required: true,
    },
    attribute: {
      type: BaseAttribute,
      required: true
    },
    errors: {
      required: true
    }
  },
  data() {
    return {
      error: null
    }
  },
  computed: {
    rawValue: {
      get: function () {
        return this.attribute.extractValue(this.value);
      },
      set: function(newValue) {
        this.attribute.injectValue(this.value, newValue);
      }
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
  },
  methods: {
    onChange: function () {
      var val = this.rawValue !== "" ? this.rawValue : null;

      this.attribute.injectValue(this.value, val);
      this.$emit('input', val);
    }

  }
}

</script>
