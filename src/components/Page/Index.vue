<template>
  <div class="px-2">
    <slot name="breadcrumb">
      <div class='mt-4' flat>
        <a @click="$router.go(-1)">{{ $t('$quartz.core.back') }}</a>
      </div>
    </slot>
    <q-card class="pa-3 my-4">
      <v-layout align-start>
        <img :src="config.icon" width='110'>
        <div class='ml-3'>
          <h2 class='headline font-weight-thin'>
            {{ this.getResourceTitle(config) }}
          </h2>
          <p class='caption font-weight-thin'>
            {{ this.getResourceDescription(config) }}
          </p>
        </div>
      </v-layout>

    </q-card>

    <slot :config="config" name="body"></slot>
  </div>
</template>

<script>
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
export default {
  mixins: [
  	ResourceLocalization
  ],
  props: {
    config: {
      type: Object,
      required: true,
    }
  }
}
</script>