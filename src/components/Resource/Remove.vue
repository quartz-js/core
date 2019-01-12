<template>
  <div class="remove">
    <v-btn v-if="config.remove === true" small flat icon @click="showRemoveDialog = true" color="error"><v-icon>delete</v-icon></v-btn>
    <v-dialog v-model="showRemoveDialog" width='400'>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ $t('irreversible_operation.title') }}
        </v-card-title>

        <v-card-text>
          {{ $t('irreversible_operation.message') }}<br><br>{{ $t('irreversible_operation.question') }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showRemoveDialog = false">No</v-btn>
          <v-btn color="error" @click="showRemoveDialog = false; remove();">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { LoadResource } from '@/mixins/LoadResource'

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
    /**
     * Remove resource
     *
     * @return void
     */
    remove: function () {
      this.config.manager.remove(this.data.id).then(response => {
        this.config.onRemoveSuccess(this, response);
        bus.$emit(this.config.resourceEvent("removed"), this.data);
      }).catch(response => {
        console.log(response);
      });
    },
  },
  created () {
    this.config.ini();
    this.loadDataByProps();
  },
}

</script>
<style scoped>
  .remove {
    display: inline-block;
  }
</style>