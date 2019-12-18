<template>
  <div v-if="internalConfig.create === true" class="create">
    <div v-if="type === 'button-navigator'">
      <slot name="activator" v-if="activator">
        <component 
          :is="activatorType"
          color="primary" 
          @click="drawer = true" 
          v-bind="$attrs"
          content-icon='add'
          :content-text="$t('$quartz.core.create')"
          />
      </slot>
      <slot :resource="data" name="main">
        <q-form app v-model="drawable" fixed>
          <div class="content text-left" v-if="drawer" style='overflow-y:auto; max-height: 100%'>
            <h3 class='title'>{{ this.getResourceTitle(internalConfig) }}</h3>
            <p class='mt-3'>{{ this.getResourceDescription(internalConfig) }}</p>
            <v-divider class='mb-45'></v-divider>
            <errors :errors='errors' />
            <div>
              <slot :resource="data" :errors="errors" :config="internalConfig" name="create"/>
            </div>
            <div class='text-right mt-5'>
              
                <q-btn
                  @click="drawer = false" 
                  v-bind="$attrs"
                  content-icon='close'
                  :content-text="$t('$quartz.core.cancel')"
                />

                <q-btn
                  :loading="loading"
                  :disabled="loading"
                  color="primary" 
                  @click="create()"
                  v-bind="$attrs"
                  content-icon='add'
                  :content-text="labelCreate ? labelCreate : $t('$quartz.core.create')"
                />
            </div>
          </div>
         </q-form>
      </slot>
    </div>

    <q-card class="" v-if="type === 'box'">
      <div class='content text-md-center'>
        <img :src='internalConfig.icon' width='218' class='my-3'>
        <h3 class='title my-3'>{{ this.getResourceTitle(internalConfig) }}</h3>
        <p class='my-4' style='max-width: 800px; margin: 0 auto'>
          {{ this.getResourceDescription(internalConfig) }}
          <br><br>
          <slot name="activator" v-if="activator">
            <component 
              :is="activatorType"
              color="primary" 
              @click="drawer = true" 
              v-bind="$attrs"
              content-icon='add'
              :content-text="$t('$quartz.core.create')"
            />
          </slot>
          <slot :resource="data" name="main">
            <q-form v-model="drawable" fixed temporary right width='1200' stateless>
              <div class="content text-left" v-if="drawer" style='overflow-y:auto; max-height: 100%'>
                <h3 class='title'>{{ this.getResourceTitle(internalConfig) }}</h3>
                <p class='mt-3'>{{ this.getResourceDescription(internalConfig) }}</p>
                <v-divider class='mb-45'></v-divider>
                <errors :errors='errors' />
                <div>
                  <slot :resource="data" :errors="errors" :config="internalConfig" name="create"/>
                </div>
                <div class='text-right mt-5'>

                  <q-btn
                    @click="drawer = false" 
                    v-bind="$attrs"
                    content-icon='cancel'
                    :content-text="$t('$quartz.core.cancel')"
                  />

                  <q-btn
                    :loading="loading"
                    :disabled="loading"
                    color="primary" 
                    @click="create()"
                    v-bind="$attrs"
                    content-icon='add'
                    :content-text="labelCreate ? labelCreate : $t('$quartz.core.create')"
                  />

                </div>
              </div>
             </q-form>
          </slot>
        </p>
      </div>
    </q-card>
    <div v-if="type === 'direct'">
      <div class="text-left">
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
      <div class="text-left" v-if="data">
        <errors :errors='errors' />
        <div>
          <slot :resource="data" :errors="errors" :config="internalConfig" name="create"/>
        </div>
        <div class='text-right'>
          <q-btn
            :loading="loading"
            :disabled="loading"
            color="primary" 
            @click="create()"
            v-bind="$attrs"
            content-icon='add'
            :content-text="labelCreate ? labelCreate : $t('$quartz.core.create')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { utils } from '../../mixins/utils'
import { Helper } from '../../app/Helper'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
import Errors from '../../components/Errors'

export default {
  mixins: [ 
    utils,
    ResourceLocalization
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
      default: "q-btn"
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
    }
  },
  watch: {
    resource: function (){
      this.data = JSON.parse(JSON.stringify(this.resource));
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

      var resource = this.data;
      this.internalConfig.createResource(resource).then((response) => {
        this.errors = [];
        this.drawer = false;
        this.load()
      }).catch(response => {
        Helper.handleResponse(response);

        this.errors = response.body.errors
      }).finally(response => {
        this.loading = false;
      });
    },

    load () {
      this.data = this.internalConfig.newEntity(this.$route);
    }
  },
  created() {
    this.internalConfig = this.config.clone();
  },
  mounted() {
    this.load();
  }
}

</script>
