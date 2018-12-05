<template>
  <p>
      <label class="label-show">{{ attribute.getLabel() }}</label>


      <span v-if="attribute.resourceConfig">
        <router-link :to="attribute.resourceConfig().getRouteShow(attribute.extractValue(resource))" v-html="html" class="show-value">Show</router-link>
      </span>
      <span v-else>
        <span v-if="html !== null" class="show-value" v-html="html"/>
      </span>
      <span v-if="html === null" class="show-value font-italic " v-html="'No information available'"/>
  </p>
</template>
<script>

export default {
  props: ['resource', 'value', 'error', 'attribute', 'errors'],
  computed: {
    html: function () {
      return this.attribute.extractReadableValue(this.resource);
    }
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
