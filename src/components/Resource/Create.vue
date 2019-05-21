<template>
  <div v-if="internalConfig.create === true" class="create">
    <div v-if="type === 'button-navigator'">
      <slot name="activator" v-if="activator">
        <v-btn v-if="activatorType === 'btn'" color="primary" @click="drawer = true" v-bind="$attrs">{{ $t('$quartz.core.create') }}</v-btn>
        <v-btn v-if="activatorType === 'icon'" small flat icon color="primary" @click="drawer = true" class="ma-0 mx-1" v-bind="$attrs"><v-icon>add</v-icon></v-btn>
      </slot>
      <slot :resource="data" name="main">
        <v-navigation-drawer v-model="drawable" fixed temporary right width='1200' stateless>
          <div class="content text-xs-left" v-if="drawer" style='overflow-y:auto; max-height: 100%'>
            <h3 class='title'>{{ this.getResourceTitle(internalConfig) }}</h3>
            <p class='mt-3'>{{ this.getResourceDescription(internalConfig) }}</p>
            <v-divider class='mb-45'></v-divider>
            <errors :errors='errors' />
            <div>
              <slot :resource="data" :errors="errors" :config="internalConfig" name="create"/>
            </div>
            <div class='text-xs-right mt-5'>
              <v-btn @click="drawer = false">{{ $t('$quartz.core.cancel') }}</v-btn>
              <v-btn color="primary" @click="create()" :loading="loading">{{ labelCreate ? labelCreate : $t('$quartz.core.create') }}</v-btn>
            </div>
          </div>
         </v-navigation-drawer>
      </slot>
    </div>

    <v-card class="resource-card" v-if="type === 'box'">
      <div class='content text-md-center'>
        <img :src='internalConfig.icon' width='218' class='my-3'>
        <h3 class='title my-3'>{{ this.getResourceTitle(internalConfig) }}</h3>
        <p class='my-4' style='max-width: 800px; margin: 0 auto'>
          {{ this.getResourceDescription(internalConfig) }}
          <br><br>
          <slot name="activator" v-if="activator">
            <v-btn v-if="activatorType === 'btn'" color="primary" @click="drawer = true" v-bind="$attrs">{{ $t('$quartz.core.create') }}</v-btn>
            <v-btn v-if="activatorType === 'icon'" small flat icon color="primary" @click="drawer = true" class="ma-0 mx-1" v-bind="$attrs"><v-icon>add</v-icon></v-btn>
          </slot>
          <slot :resource="data" name="main">
            <v-navigation-drawer v-model="drawable" fixed temporary right width='1200' stateless>
              <div class="content text-xs-left" v-if="drawer" style='overflow-y:auto; max-height: 100%'>
                <h3 class='title'>{{ this.getResourceTitle(internalConfig) }}</h3>
                <p class='mt-3'>{{ this.getResourceDescription(internalConfig) }}</p>
                <v-divider class='mb-45'></v-divider>
                <errors :errors='errors' />
                <div>
                  <slot :resource="data" :errors="errors" :config="internalConfig" name="create"/>
                </div>
                <div class='text-xs-right mt-5'>
                  <v-btn @click="drawer = false">{{ $t('$quartz.core.cancel') }}</v-btn>
                  <v-btn color="primary" @click="create()" :loading="loading">{{ labelCreate ? labelCreate : $t('$quartz.core.create') }}</v-btn>
                </div>
              </div>
             </v-navigation-drawer>
          </slot>
        </p>
      </div>
    </v-card>
    <div v-if="type === 'direct'">
      <div class="text-xs-left">
        <div v-if="details">
          <h3 class='title'>{{ this.getResourceTitle(internalConfig) }}</h3>
          <p class='mt-3'>{{ this.getResourceDescription(internalConfig) }}</p>
          <v-divider class='mb-45'></v-divider>
        </div>
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
          <v-btn color="primary" @click="create()" :loading="loading">{{ labelCreate ? labelCreate : $t('$quartz.core.create') }}</v-btn>
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
    details: {
      type: Boolean,
      default: true
    },
    activatorType: {
      type: String,
      default: "btn"
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
      data: {},
      errors: [],
    }
  },
  methods: {
    create () {
      
      if (this.loading) {
        return true;
      }

      this.loading = true;
      this.errors = [];

      var resource = this.data; // Remove all null values.
      this.executeHooks('BeforeCreate', {resource: resource}).then((data) => {
        return this.internalConfig.createResource(data.resource);
      }).then((response) => {
        this.errors = [];
        this.drawer = false;
        this.load()
      }).catch(response => {
        this.errors = response.body.errors
      }).finally(response => {
        this.loading = false;
      });
    },

    load () {
      this.data = this.internalConfig.newEntity();
    }
  },
  created() {
    this.internalConfig = this.config.clone();
    this.load();
  }
}

</script>
