<template>
  <div class="content">
    <div>
      <div
        :class="{error: error}"
        class="form-group">
        <input
          v-model="queryRaw"
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
  data() {
    return {
      queryRaw: null
    }
  },
  watch: {
    'query'() {
      this.queryRaw = this.query;
    }
  },
  mounted () {
    this.queryRaw = this.query;
  },
  methods: {
    onChange: function () {
      this.$emit('on-change-query', this.queryRaw);
      // this.query = this.queryRaw;
    }

  }
}

</script>
