<template>
  <p v-if="show">
    <label class="label-show">{{ getAttributeLabel(attribute) }}</label>
    <span v-if="attribute.getClassName() === 'BelongsToAttribute' && attribute.extractValue(resource) !== null">
      <router-link :to="attribute.getRelationManager(resource).getRouteShow(attribute.extractValue(resource))" v-html="html" class="show-value" />
    </span>
    <span v-if="(attribute.getClassName() === 'BelongsToMany' || attribute.getClassName() === 'MorphToMany') && attribute.extractValue(resource) !== null" class="py-2 px-0" style='display:block'>
      <v-chip color="primary" dark v-for="item in attribute.extractValue(resource)">{{ item.name }}</v-chip>
    </span>
    <span v-else>
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
