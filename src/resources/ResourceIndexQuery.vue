<template>
  <div class="content">
    <div>
      <div
        :class="{error: error}"
        class="form-group">
        <input
          v-model="_query"
          type="text"
          class="form-control"
          placeholder=" "
          @input="onChange()">
        <span class="form-highlight"/>
        <label>{{ $t('query_label') }}</label>
      </div>

      <div class="error">{{ error }}&nbsp;</div>

    </div>
  </div>
</template>
<script>

export default {
  props: ['query', 'error'],
  created () {
    this._query = this.query;
  },
  methods: {
    onChange: function () {
      this.$emit('on-change-query', this._query);
    }

  }
}

</script>
