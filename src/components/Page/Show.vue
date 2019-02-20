<template>
  <div v-if="data">
    <slot :resource="data" name="breadcrumb">
      <v-card class='mt-4' flat>
        <router-link :to="config.getRouteIndex(data)">To index</router-link>
      </v-card>
    </slot>
    <div style='margin-top: -20px'>
      <slot :resource="data" name="body"></slot>
    </div>
    <slot :resource="data" :config="config" name="extra"/>
  </div>
</template>

<script>

import { LoadResource } from '../../mixins/LoadResource'
import { utils } from '../../mixins/utils'
import Errors from '../../components/Errors'
import Remove from '../../components/Resource/Remove'

export default {
  components: {
    Errors,
    Remove
  },
  mixins: [ 
    LoadResource, 
    utils
  ],
  created() {
    this.loadDataByUrl();
  },
}
</script>