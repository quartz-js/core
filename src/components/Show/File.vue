<template>
  <p v-if="show"  class="pa-3">
     <v-layout align-center >
      <div style='width: 80px; height: 80px' class="text-center">
        <a :href="resource.url" target='_blank' style='display:block' v-if="resource.media"><img style='max-width: 100%' :src="getPreview(resource)"></a>
        <v-chip color="error" v-if="!resource.media" small style='color: white' disabled>No file</v-chip>
      </div>
      <div class="pl-3">
        <p v-if="resource.media">
          {{ resource.media.mime_type }}
          {{ formatBytes(resource.media.size) }}
        </p>
        <p v-if="resource.url">
          <a :href='resource.url' target='_blank'>{{ resource.name }} </a>
          <span v-for="conversion in resource.conversions">
             | <a :href='conversion.url' target='_blank'>{{ conversion.name }}</a>
          </span>
        </p>
      </div>
    </v-layout>
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
  methods: {
    getPath(url) {
      url = new URL(url);
      return url.pathname.split('/').slice(-1)[0]
    },
    formatBytes(bytes) {
      if(bytes < 1024) return bytes + " Bytes";
      else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
      else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
      else return(bytes / 1073741824).toFixed(3) + " GB";
    },
    getPreview(resource) {
      var filename = resource.url;
      var extension = filename.split(/\#|\?/)[0].split('.').pop().trim();

      if (_.includes(['jpeg', 'jpg', 'png', 'gif'], extension)) {
        return resource.url
      }

      try {
        return require('../../assets/extension/' + extension + '.svg')
      } catch (e) {
        return require('../../assets/extension/txt.svg')
      }
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
