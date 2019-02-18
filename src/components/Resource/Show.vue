<template>
  <v-card v-if="data" class="resource-card"> 
    <v-container fluid style='background:#f5f5f5; height: 64px; padding: 0 10px' align-center>
      <v-btn flat icon @click="showContent = !showContent"><v-icon>menu</v-icon></v-btn>
      <div class='v-toolbar__title'>{{ this.getResourceTitle(config) }} - #{{ data.id }}</div>
      <v-spacer></v-spacer>
      <remove :resource="data" :config="config" />
      <slot :resource="data" :config="config" name="actions" />
      <v-menu>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <slot :resource="data" :config="config" name="actions-extra" />
        </v-list>
      </v-menu>
    </v-container>

    <div v-if="showContent" class="content">
      <p class='mt-3'>{{ this.getResourceTitle(config) }}</p>
      <div>
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
    this.config.ini();
    this.loadDataByProps();
    this.listenResourceEvents();
  },
}
</script>