<template>
  <v-card v-if="data" class="resource-card"> 
    <div v-if="showContent" class="content">
      <div>
        <v-layout align-center justify-end style='position: absolute; top: 10px; right: 10px;'>
          <slot :resource="data" :config="config" name="actions"/>
        </v-layout>

        <slot :resource="data" name="show" :config="config"></slot>
      </div>
    </div>
  </v-card>
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
    this.listenResourceEvents();
  },
}
</script>