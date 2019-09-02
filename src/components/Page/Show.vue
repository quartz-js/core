<template>
  <div>
    <div v-if="data" class="px-2">
      <slot :resource="data" name="breadcrumb">
        <div class='mt-4' flat>
          <a @click="$router.go(-1)">{{ $t('$quartz.core.back') }}</a>
        </div>
      </slot>
      <q-card class="pa-3 mt-4" >
        <v-layout align-start>
          <img :src="config.icon" width='110'>
          <v-spacer class='ml-3'>
            <v-layout align-center>

              <h2 class='headline font-weight-thin pa-1'>
                {{ this.getResourceTitle(config) }} - #{{ data.id }} {{ data.name }}
              </h2>
              <v-spacer></v-spacer>

              <slot :resource="data" :config="config" name="actions"/>
              <v-menu v-if="!!$scopedSlots['actions-extra']">
                <template v-slot:activator="{ on }">
                  <q-btn icon text small v-on="on"  class='ma-0'  color="grey">
                    <q-icon>more_vert</q-icon>
                  </q-btn>
                </template>
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

      </q-card>
        
      <slot name="body" :resource="data" :config="config" />
    </div>
    <div v-if="!data && !loading" class="px-2">
      <slot :resource="data" name="breadcrumb">
        <div class='mt-4' flat>
          <a @click="$router.go(-1)">{{ $t('$quartz.core.back') }}</a>
        </div>
      </slot>
      <q-card class="mt-5"> 
        <div class='content text-md-center'>
          <img :src='config.icon' width='218' class='my-3'>
          <h3 class='title my-3'>{{ $t('$quartz.core.no-results.message') }}</h3>
          <p class='my-4' style='max-width: 800px; margin: 0 auto'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lobortis in arcu at pellentesque. Sed at porta odio. Vivamus sollicitudin euismod justo id ornare. Suspendisse a metus orci. Cras tempor finibus metus, nec dictum enim sollicitudin sit amet. Vestibulum et suscipit lacus. Nam vestibulum tempus dolor.
            <!--{{ getResourceDescription(config) }}-->
          </p>
          <slot name="top" :config="config" :big="true"></slot>
        </div>
      </q-card>
    </div>
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
  data() {
    return {
      tabs: null,
      loading: true
    }
  },
  mixins: [ 
    LoadResource,
    ResourceLocalization,
    utils
  ],
  created() {
    this.loadDataByUrl().finally(i => {
      this.loading = false
    })
    this.createListeners();
  },
  beforeDestroy()
  {
    this.destroyListeners();
  }
}
</script>
<style>
  .show-tabs .v-tabs__wrapper {
    margin-bottom: -2px;
    z-index: 1;
    position: relative;
  }

  .v-tabs__bar {
    z-index: 1;
  }
</style>