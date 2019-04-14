<template>
  <div class="remove" style='display:inline-block'>
    <v-btn v-if="config.remove === true" small flat icon @click="showRemoveDialog = true" color="error" class="ma-0 mx-1"><v-icon>delete</v-icon></v-btn>
    <v-dialog v-model="showRemoveDialog" width='400'>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ $t('$quartz.core.irreversible_operation.title') }}
        </v-card-title>

        <v-card-text>
          {{ $t('$quartz.core.irreversible_operation.message') }}<br><br>{{ $t('$quartz.core.irreversible_operation.question') }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showRemoveDialog = false">{{ $t('$quartz.core.no') }}</v-btn>
          <v-btn color="error" @click="showRemoveDialog = false; remove();">{{ $t('$quartz.core.yes') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { LoadResource } from '../../mixins/LoadResource'

export default {
  mixins: [
    LoadResource
  ],
  data() {
    return {
      showRemoveDialog: false,
    }
  },
  methods: {
    remove: function () {
      this.config.removeResource(this.data.id).then((response) => {
        this.$emit('removed')
      })
    },
  },
  created () {
    this.loadDataByProps();
  },
}

</script>