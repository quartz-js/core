<template>
  <q-card v-if="data" class=""> 
    <div v-if="showContent">
      <v-layout align-center class="pa-3">
        <div><q-view-icon :src="config.icon" width='50' /></div>
        <div class='mx-5'>
          <h2 class='headline font-weight-thin'>
            {{ config.name }}
            <v-chip color="pink" label small text-color="white" class='mx-2'>System</v-chip>
            <v-chip color="purple" label small text-color="white" class='mx-2'>Schema</v-chip>
            <v-chip color="blue" label small text-color="white" class='mx-2'>Data</v-chip>
          </h2>
        </div>
        <v-spacer />
        <slot name="actions" :config="config"></slot>
      </v-layout>
      <v-divider></v-divider>
      <div class="content">
        <slot :resource="data" name="show" :config="config"></slot>
      </div>
    </div>
  </q-card>
</template>

<script>

import { LoadResource } from '../../mixins/LoadResource'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
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
    ResourceLocalization,
    utils
  ],
  data() {
    return {
      showContent: true
    }
  },
  created() {
    this.loadDataByProps();
    this.createListeners();
  },
  beforeDestroy()
  {
    this.destroyListeners();
  }
}
</script>