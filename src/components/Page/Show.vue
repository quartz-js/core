<template>
  <div v-if="data" class="px-2">
    <slot :resource="data" name="breadcrumb">
      <div class='mt-4' flat>
        <router-link :to="config.getRouteIndex(data)">{{ $t('$quartz.core.back') }}</router-link>
      </div>
    </slot>
    <v-card class="resource-card pa-3 mt-4" >
      <v-layout align-start>
        <img :src="config.icon" width='110'>
        <v-spacer class='ml-3'>
          <v-layout align-center>

            <h2 class='headline font-weight-thin pa-1'>
              {{ this.getResourceTitle(config) }} - #{{ data.id }} {{ data.name }}
            </h2>
            <v-spacer></v-spacer>
            <!--<remove :resource="data" :config="config" button='normal' @removed="$router.push(config.getRouteIndex(data))"/>-->

            <slot :resource="data" :config="config" name="actions"/>
            <v-menu v-if="!!$scopedSlots['actions-extra']">
              <v-btn icon flat small slot="activator"  class='ma-0'  color="grey">
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <slot :resource="data" :config="config" name="actions-extra" />
              </v-list>
            </v-menu>
          </v-layout>

          <slot :resource="data" :config="config" name="subtitle"/>

          <p class='caption font-weight-thin pa-1'>
            <slot :resource="data" name="description" :config="config">{{ data.description }}</slot>
          </p>
        </v-spacer>
      </v-layout>

    </v-card>
    
    <v-tabs class='my-2'>
      <slot :resource="data" name="tabs" :config="config">
        <v-tab>{{ $t('$quartz.core.overview') }}</v-tab>
        <v-tab-item :transition="false" :reverse-transition="false">
          <slot :resource="data" name="body"></slot>
        </v-tab-item>
      </slot>
    </v-tabs>
  </div>
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
  created() {
    this.loadDataByUrl();
    this.listenResourceEvents();
  }
}
</script>