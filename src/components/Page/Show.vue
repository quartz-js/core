<template>
  <div v-if="data">
    <v-card class='content'>
      <router-link :to="config.getRouteIndex(data)">To index</router-link>
    </v-card>
    <v-card>
      <div>
        <slot :resource="data" name="body"></slot>
      </div>
    </v-card>
    <slot :resource="data" :config="config" name="extra"/>
  </div>
</template>

<script>

import { LoadResource } from '@/mixins/LoadResource'
import { utils } from '@/mixins/utils'
import Errors from '@/components/Errors'
import Remove from '@/components/Resource/Remove'

export default {
  components: {
    Errors,
    Remove
  },
  mixins: [ 
    LoadResource, 
    utils
  ],
  mounted () {
    bus.$on(this.config.resourceEvent("removed"), data => {
      if (data.id === this.data.id) {
        this.$router.push(this.config.getRouteIndex(data));
      }
    });


    this.config.onCreateSuccess = (vue, response) => {
        vue.$router.push(this.config.getRouteShow(response.body.data));
    };
  },
  created() {
    this.loadDataByUrl();
  },
}
</script>