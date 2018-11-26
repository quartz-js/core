<template>
  <div v-if="data">
    <div class='mb-3'>
      <router-link :to="config.getRouteIndex(data)">To index</router-link>
    </div>
    <v-card>
      <div>
        <slot :resource="data" name="body"></slot>
      </div>
    </v-card>
    <slot :resource="data" :config="config" name="extra"/>
  </div>
</template>

<script>

import { LoadResource } from '@railken/vue-admin-core/src/mixins/LoadResource'
import { utils } from '@railken/vue-admin-core/src/mixins/utils'
import Errors from '@railken/vue-admin-core/src/components/Errors'
import Remove from '@railken/vue-admin-core/src/components/Resource/Remove'

export default {
  components: {
    Errors,
    Remove
  },
  mixins: [ 
    LoadResource, 
    utils
  ],
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  mounted () {
    bus.$on(this.config.resourceEvent("removed"), data => {
      if (data.id === this.data.id) {
        this.$router.push(this.config.getRouteIndex(data));
      }
    });

    this.listenResourceEvents();
  },
  created() {
    this.loadDataByUrl();

  },
}
</script>