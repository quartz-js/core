<template>
  <div>
    <div v-if="data" class="px-2" >
      <slot name="body" :resource="data" :config="config" />
    </div>
    <div v-if="!data && !loading" class="px-2">
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