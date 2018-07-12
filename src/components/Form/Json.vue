<template>

  <div
    id="json"
    ref="json"/>
</template>

<script>

import JSONFormatter from 'json-formatter-js'

export default {

  props: ['json'],
  data: function () {
    return {
    }
  },
  mounted: function () {
    const formatter = new JSONFormatter(this.json);
    this.$refs.json.appendChild(formatter.render());
  },

  methods: {
  }
}

</script>
