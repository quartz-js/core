<template>
  <div>
    <v-autocomplete
        :loading="loading"
        :items="items"
        item-text="label"
        :label="attribute.getLabel()"
        v-model="rawValue"
        @change="onChange()"
        :search-input="search"
        return-object
      ></v-autocomplete>
    <div
      v-if="error"
      class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import { mixin as clickaway } from 'vue-clickaway';

export default {
  mixins: [ clickaway ],
  props: ['value', 'attribute', 'error', 'errors'],
  data: function () {
    return {
      rawValue: null,
      loading: false,
      search: '',
      items: [],
    }
  },
  created () {

    var val = this.attribute.extractValue(this.value);

    val.label = this.attribute.getLabelByResource(val);
    this.items = [val];
    this.rawValue = val;
    this.search = this.attribute.mutator(this.attribute.extractValue(this.value));
  },
  watch: {
    search (newVal) {
      newVal && newVal !== this.rawValue && this.querySelections(newVal)
    }
  },
  methods: {

    querySelections (v) {
      this.loading = true;

      v = v ? this.attribute.executeQuery(v) : '';

      this.attribute.api.index({show: 5, query: v})
        .then(response => {
          this.items = response.body.data.map((item) => {
            item.label = this.attribute.getLabelByResource(item);
            return item;
          });
        })
        .finally(() => { this.loading = false});
    },
    onChange: function (newVal, oldVal) {
      this.query = this.attribute.mutator(this.rawValue);
      this.attribute.injectValue(this.value, this.rawValue.id);

      this.$emit('input', this.rawValue);

    },

  }
}

</script>
