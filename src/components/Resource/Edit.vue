<template>
  <div v-if="data !== 0 && data !== null && config.update === true" class="edit">
    <slot name="activator" v-if="activator">
      <v-btn  small flat icon  color="primary" @click="drawer = true"><v-icon>edit</v-icon></v-btn>
    </slot>
    <slot :resource="data" name="main">
      <v-navigation-drawer v-model="drawable" fixed temporary app right width='800'>
        <div class="content">
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

import { LoadResource } from '@railken/vue-admin-core/src/mixins/LoadResource'
import { utils } from '@railken/vue-admin-core/src/mixins/utils'
import Errors from '@railken/vue-admin-core/src/components/Errors'


export default {
  components: {
    Errors
  },
  mixins: [ 
    LoadResource, 
    utils
  ],
  computed: {
    drawable: {
      get: function() {
        if (!this.activator) {
          return true;
        }

        return this.drawer;
      },
      set: function(val) {
        this.drawer = val;
      }
    }
  },
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
    config: {
      type: Object,
      required: true,
    },
    resource: {
      type: Object
    },
    id: {
      type: Number
    }
  },
  created() {
    this.loadDataByProps();
  },
  watch: {
    drawer: function (val) {
      if (!val) {
        this.resetData();
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