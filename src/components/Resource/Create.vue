<template>
  <div v-if="config.create === true" class="create">
    <slot name="activator" v-if="activator">
      <v-btn small flat icon  color="primary" @click="drawer = true"><v-icon>add</v-icon></v-btn>
    </slot>
    <slot :resource="data" name="main">
      <v-navigation-drawer v-model="drawable" fixed temporary app right width='800'>
        <div class="content">
          <h3 class='title'>{{ string(config.title).humanize().toString() }}</h3>
          <p class='mt-3'>{{ config.description }}</p>
          <v-divider class='mb-45'></v-divider>
          <errors :errors='errors' />
          <div>
            <slot :resource="data" :errors="errors" :config="config" name="create"/>
          </div>
          <div class='text-xs-right mt-5'>
            <v-btn color="primary"  @click="create()">Create</v-btn>
          </div>
        </div>
       </v-navigation-drawer>
    </slot>
  </div>
</template>

<script>

import { utils } from '@railken/vue-admin-core/src/mixins/utils'
import Errors from '@railken/vue-admin-core/src/components/Errors'

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
    /**
     * Save data
     *
     * @return void
     */
    create () {
      this.config.manager.create(this.data).then(response => {
        this.config.onCreateSuccess(this, response);
      }).catch(response => {
        this.errors = response.body.errors
      });
    }
  },
  created() {
    var data = {};
    this.config.attributes.map(attribute => {
      data[attribute.getName()] = attribute.getDefault();
    });
    this.data = data;
  }
}

</script>
