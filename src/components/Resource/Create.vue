<template>
  <div v-if="internalConfig.create === true" class="create">
    <div v-if="type === 'button-navigator'">
      <slot name="activator" v-if="activator">
        <v-btn color="primary" @click="drawer = true">{{ $t('$quartz.core.create') }}</v-btn>
      </slot>
      <slot :resource="data" name="main">
        <v-navigation-drawer v-model="drawable" fixed temporary app right width='1200'>
          <div class="content text-xs-left" v-if="drawer">

            <h3 class='title'>{{ this.getResourceTitle(internalConfig) }}</h3>
            <p class='mt-3'>{{ this.getResourceDescription(internalConfig) }}</p>
            <v-divider class='mb-45'></v-divider>
            <errors :errors='errors' />
            <div>
              <slot :resource="data" :errors="errors" :config="internalConfig" name="create"/>
            </div>
            <div class='text-xs-right mt-5'>
              <v-btn @click="drawer = false">{{ $t('$quartz.core.cancel') }}</v-btn>
              <v-btn color="primary" @click="create()">{{ labelCreate ? labelCreate : $t('$quartz.core.create') }}</v-btn>
            </div>
          </div>
         </v-navigation-drawer>
      </slot>
    </div>
    <div v-if="type === 'direct'">
      <div class="text-xs-left">
        <h3 class='title'>{{ this.getResourceTitle(internalConfig) }}</h3>
        <p class='mt-3'>{{ this.getResourceDescription(internalConfig) }}</p>
        <v-divider class='mb-45'></v-divider>
        <errors :errors='errors' />
        <div>
          <slot :resource="data" :errors="errors" :config="internalConfig" name="create"/>
        </div>
      </div>
    </div>
    <div v-if="type === 'fly'">
      <div class="text-xs-left">
        <errors :errors='errors' />
        <div>
          <slot :resource="data" :errors="errors" :config="internalConfig" name="create"/>
        </div>
        <div class='text-xs-right'>
          <v-btn color="primary" @click="create()">{{ labelCreate ? labelCreate : $t('$quartz.core.create') }}</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { utils } from '../../mixins/utils'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
import { hooks } from '../../mixins/hooks'
import Errors from '../../components/Errors'
import Vue from 'vue'

export default {
  mixins: [ 
    utils,
    ResourceLocalization,
    hooks
  ],
  components: { 'errors': Errors },
  props: {
    labelCreate: {
      default: null
    },
    activator: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'button-navigator'
    },
    resource: {
      type: Object,
      default: null
    },
    config: {
      type: Object,
      required: true,
    },
    hooks: {
      type: Object
    }
  },
  watch: {
    resource: function (){
      this.data = JSON.parse(JSON.stringify(this.resource));
    },
    data: {
      handler: function (val) {

        if (this.type === 'direct') {

          let promise = this.getHooks('OnChange', {
            resource: this.data
          });

        }
      },
      deep: true
    },
    drawer: function (val) {
      if (!val) {
        this.load();
        this.errors = [];
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
      data: null,
      errors: [],
    }
  },
  methods: {
    create () {
      this.errors = [];

      var resource = this.data; // Remove all null values.
      this.executeHooks('BeforeCreate', {resource: resource}).then((data) => {
        return this.internalConfig.createResource(data.resource);
      }).then((response) => {
        this.errors = [];
        this.load();
        this.drawer = false;
      }).catch(response => {
        this.errors = response.body.errors
      });
    },

    load () {

      let data = {};
      this.internalConfig.injectDefault(data);

      this.data = data;

    }
  },
  created() {
    this.internalConfig = this.config.clone();
    this.internalConfig.ini();
    this.load();
  }
}

</script>
