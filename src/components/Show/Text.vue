<template>
  <p v-if="show">
    <label class="label-show">{{ getAttributeLabel(attribute) }}</label>
    <span v-if="attribute.relationManager && attribute.extractValue(resource)">
      <router-link :to="attribute.relationManager().getRouteShow(attribute.extractValue(resource))" v-html="html" class="show-value">Show</router-link>
    </span>
    <span  v-else>
      <span>
        <span v-if="html !== null" class="show-value" v-html="html"/>
      </span>
      <span v-if="html === null" class="show-value font-italic " v-html="$t('$quartz.core.no-information')"/>
    </span>
  </p>
</template>
<script>

import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'

export default {
  mixins: [
    AttributePreMount,
    ResourceLocalization
  ],
  props: ['resource', 'value', 'attribute', 'errors'],
  mounted() {

    if (!this.canMount()) {
      return;
    }
  },
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
