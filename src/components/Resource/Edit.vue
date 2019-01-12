<template>
  <div v-if="data !== 0 && data !== null && config.update === true" class="edit">
    <slot name="activator" :drawer="drawer">
      <v-btn small flat icon color="primary" @click="drawer = true"><v-icon>edit</v-icon></v-btn>
    </slot>
    <slot :resource="data" name="main">
      <v-navigation-drawer v-model="drawer" fixed temporary app right width='800'>
        <div class="content"  v-if="drawer">
          <h3 class='title'>{{ string(config.title+ " - #"+data.id).humanize().toString() }}</h3>
          <p class='mt-3'>{{ config.description }}</p>
          <v-divider class='mb-5'></v-divider>
          <errors :errors="errors" />
          <slot :resource="data" :errors="errors" :config="config" name="edit"></slot>
        </div>
        <div class='content text-xs-right mt-5'>
          <v-btn @click="drawer = false">Cancel</v-btn>
          <v-btn @click="save()" color="primary" :loading="loading" :disabled="loading">Save</v-btn>
        </div>
    </v-navigation-drawer>
    </slot>
    <slot :resource="data" name="extra"/>
  </div>
</template>

<script>

import { LoadResource } from '@/mixins/LoadResource'
import { utils } from '@/mixins/utils'
import Errors from '@/components/Errors'


export default {
  components: {
    Errors
  },
  mixins: [ 
    LoadResource, 
    utils
  ],
  data() {
    return {
      drawer: false,
      loading: false,
      data: {},
      errors: [],
    }
  },
  props: {
    activator: {
      type: Boolean,
      default: true
    },
  },
  created() {
    this.config.ini();
    this.loadDataByProps();

    if (!this.activator) {
      this.drawer = true;
    }
  },
  watch: {
    drawer: function (val) {
      if (!val) {
        
        var dt = JSON.stringify(this.data);

        this.resetData();

        //if (dt !== JSON.stringify(this.data)) {

          this.$emit('update', this.data);
          bus.$emit(this.config.resourceEvent("updated"), this.data);
        
        // }
      }
    }
  },
  methods: {

    save () {

      if (this.loading) {
        return true;
      }

      this.loading = true;

      this.config.manager.update(this.data.id, this.data).then(response => {

        this.errors = [];
        this.config.onUpdateSuccess(this, response);
        bus.$emit(this.config.resourceEvent("updated"), this.data);
        // this.$emit('update:resource', response.body.data);
        this.drawer = false;

      }).catch(response => {
        this.errors = response.body.errors || response.body.message
      }).finally(response => {
        this.loading = false;
      });
    },
  }
}

</script>
<style scoped>
  .edit {
    display: inline-block;
  }
</style>