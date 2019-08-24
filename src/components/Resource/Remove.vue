<template>
  <div class="remove" style='display:inline-block'>
    <component 
      :is="activatorType"
      color="error" 
      @click="showRemoveDialog = true"
      content-icon='delete'
      :content-text="$t('$quartz.core.remove')"
      />
    <v-dialog v-model="showRemoveDialog" width='500'>
      <q-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ $t('$quartz.core.irreversible_operation.title') }}
        </v-card-title>

        <v-card-text  class='pa-5'>
          {{ $t('$quartz.core.irreversible_operation.message') }}<br><br>{{ $t('$quartz.core.irreversible_operation.question') }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <q-btn @click="showRemoveDialog = false" :content-text="$t('$quartz.core.no')" content-icon='close' />
          <q-btn color="error" @click="showRemoveDialog = false; remove();" :content-text="$t('$quartz.core.yes')" content-icon='check' />
        </v-card-actions>
      </q-card>
    </v-dialog>
  </div>
</template>

<script>

import { LoadResource } from '../../mixins/LoadResource'

export default {
  mixins: [
    LoadResource
  ],
  props: { 
    activatorType: {
      type: String,
      default: "q-btn"
    },
  },
  data() {
    return {
      showRemoveDialog: false,
    }
  },
  methods: {
    remove: function () {
      this.config.removeResource(this.data).then((response) => {
        this.$emit('removed')
      })
    },
  },
  created () {
    this.loadDataByProps();
  },
}

</script>