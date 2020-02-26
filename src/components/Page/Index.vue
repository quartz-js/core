<template>
  <div class="px-2">
    <slot name="breadcrumb">
      <div class='mt-4' flat>
        <a @click="$router.go(-1)">{{ $t('$quartz.core.back') }}</a>
      </div>
    </slot>
    <q-card class="pa-3 my-4">
      <v-layout align-start>
        <q-view-icon :src="config.icon" width='110' />
        <div class='ml-3'>
          <h2 class='headline font-weight-thin'>
            {{ this.getResourceTitle(config) }}
          </h2>
          <p class='caption font-weight-thin'>
            {{ this.getResourceDescription(config) }}
          </p>
          <p class="mt-4 pr-2" style='margin-left: -8px'>
            <v-chip color="pink" label small text-color="white" class='mx-2'>System</v-chip>
            <v-chip color="purple" label small text-color="white" class='mx-2'>Schema</v-chip>
            <v-chip color="blue" label small text-color="white" class='mx-2'>Data</v-chip>
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