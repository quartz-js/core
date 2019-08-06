<template>
  <p v-if="show">
    <label class="label-show" v-if="showLabel">{{ attribute.label }}</label>
    <span v-if="attribute.getClassName() === 'BelongsToAttribute' && attribute.extractValue(resource) !== null">
      <router-link :to="attribute.getRelationManager(resource).getRouteShow(attribute.extractValue(resource))" v-html="html" class="show-value" />
    </span>
    <span v-else-if="(attribute.getClassName() === 'BelongsToMany' || attribute.getClassName() === 'MorphToMany') && attribute.extractValue(resource) !== null" class="py-2 px-0" style='display:block'>
      <v-chip color="primary" dark v-for="item in attribute.extractValue(resource)">{{ item.name }}</v-chip>
    </span>
    <span v-else>
      <span>
        <span v-if="html !== null" class="show-value" v-html="html"/>
      </span>
      <span v-if="html === null" class="show-value font-italic " v-html="$t('$quartz.core.no-information')"/>
    </span>
    <span v-if="showLabel" style='display:block; height: 10px'></span>
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
  props: {
    resource: {
      type: Object,
      default: null
    },
    attribute: {
      type: Object,
      default: null
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  mounted() {

    if (!this.canMount()) {
      return;
    }
  },
  computed: {
    html: function () {
      let val = this.attribute.extractReadableValue(this.resource);


      if (this.attribute.getClassName() === 'EnumAttribute') {
        let key = `$quartz.data.${this.attribute.manager().name}.attributes.${this.attribute.label}.options.${val}`;
        if (this.$te(key)) {
          val = this.$t(key);
        }
      }

      return val;
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
    margin-bottom: 0;
  }

</style>
