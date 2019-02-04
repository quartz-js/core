<template>
  <v-card v-if="data" class="content resource-card">
    <div>
      <v-layout row wrap>
        <v-flex align-items>
          <h3 class='title'>{{ string(config.title+ " - #" + data.id).humanize().toString() }}</h3>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex align-items class="text-xs-right" >
          <remove :resource="data" :config="config" />
          <slot :resource="data" :config="config" name="actions" />
        </v-flex>
      </v-layout>

      <p class='mt-3'>{{ config.description }}</p>
      <v-divider class='mb-5'></v-divider>
      <div>
        <slot :resource="data" name="show" :config="config"></slot>
      </div>
    </div>
  </v-card>
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
    this.config.ini();
    this.loadDataByProps();
    this.listenResourceEvents();
  },
}
</script>