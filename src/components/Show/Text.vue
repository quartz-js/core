<template>
  <p v-if="show">
    <label class="label-show" v-if="showLabel">{{ attribute.label }}</label>
    <span v-if="attribute.toPage(resource)">
      <router-link :to="attribute.toPage(resource)" v-html="value" class="show-value" />
    </span>
    <span v-else-if="Array.isArray(value)" class="py-2 px-0" style='display:block'>
      <v-chip color="primary" v-for="item in value">{{ item.name }}</v-chip>
    </span>
    <span v-else>
      <span>
        <span v-if="value !== null" class="show-value" v-html="value"/>
      </span>
      <span v-if="value === null" class="show-value font-italic " style='opacity:0.5'v-html="$t('$quartz.core.no-information')"/>
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
  data() {
    return {
      value: null
    }
  },
  mounted() {

    if (!this.canMount()) {
      return;
    }
  },
  async created() {
    this.value = await this.attribute.extractReadableValue(this.resource)
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
