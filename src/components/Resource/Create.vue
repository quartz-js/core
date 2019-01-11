<template>
  <div v-if="config.create === true" class="create">
    <slot name="activator" v-if="activator">
      <v-btn color="primary" @click="drawer = true">create record</v-btn>
    </slot>
    <slot :resource="data" name="main">
      <v-navigation-drawer v-model="drawable" fixed temporary app right width='800'>
        <div class="content text-xs-left" v-if="drawer">
          <h3 class='title'>{{ string(config.title).humanize().toString() }}</h3>
          <p class='mt-3'>{{ config.description }}</p>
          <v-divider class='mb-45'></v-divider>
          <errors :errors='errors' />
          <div>
            <slot :resource="data" :errors="errors" :config="config" name="create"/>
          </div>
          <div class='text-xs-right mt-5'>
            <v-btn @click="drawer = false">Cancel</v-btn>
            <v-btn color="primary"  @click="create()">Create</v-btn>
          </div>
        </div>
       </v-navigation-drawer>
    </slot>
  </div>
</template>

<script>

import { utils } from '@railken/quartz-core/src/mixins/utils'
import Errors from '@railken/quartz-core/src/components/Errors'

export default {
  mixins: [ 
    utils
  ],
  components: { 'errors': Errors },
  props: {
    activator: {
      type: Boolean,
      default: true
    },
    config: {
      type: Object,
      required: true,
    },
  },
  watch: {
    drawer: function (val) {
      if (!val) {
        
        this.data = {};
        
      }
    }
  },
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
  methods: {
    create () {
      this.config.manager.create(this.data).then(response => {
        this.config.onCreateSuccess(this, response);
        this.drawer = false;
        
        bus.$emit(this.config.resourceEvent("created"), response.body.data);
      }).catch(response => {
        this.errors = response.body.errors
      });
    }
  },
  created() {
    var data = {};

    this.config.ini();
    this.config.attributes.map(attribute => {
      data[attribute.getName()] = attribute.getDefault();
    });
    this.data = data;
  }
}

</script>
