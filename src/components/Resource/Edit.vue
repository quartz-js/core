<template>
  <div v-if="data !== 0 && data !== null && config.update === true">
    <div v-if="type === 'button-navigator'"  style='display:inline-block'>
      <slot name="activator" :drawer="drawer">
        <q-btn v-if="activatorType === 'btn'" color="primary" @click="drawer = true" v-bind="$attrs">{{ $t('$quartz.core.edit') }}</q-btn>
        <q-btn v-if="activatorType === 'icon'" small text icon color="primary" @click="drawer = true" class="ma-0 mx-1" v-bind="$attrs"><v-icon>edit</v-icon></q-btn>
      </slot>
      <slot :resource="data" name="main">
        <v-navigation-drawer v-model="drawer" fixed right width='1200' temporary stateless>
          <div style='overflow-y:auto; max-height: 100%'>
            <div class="content text-left" v-if="drawer">
              <h3 class='title'>{{ this.getResourceTitle(config) }} {{ data.id ? " - #" + data.id : null }}</h3>
              <p class='mt-3'>{{ this.getResourceDescription(config) }}</p>
              <v-divider class='mb-5'></v-divider>
              <errors :errors="errors" />
              <slot :resource="data" :errors="errors" :config="config" name="edit"></slot>
            </div>
            <div class='content text-right mt-5'>
              <q-btn @click="drawer = false">{{ $t('$quartz.core.cancel') }}</q-btn>
              <q-btn @click="save()" color="primary" :loading="loading" :disabled="loading">{{ $t('$quartz.core.save') }}</q-btn>
            </div>
          </div>
        </v-navigation-drawer>
      </slot>
      <slot :resource="data" name="extra"/>
    </div>
    <div v-if="type === 'direct'">
      <div>
        <div v-if="details">
          <h3 class='title'>{{ this.getResourceTitle(config) }} {{ data.id ? " - #" + data.id : null }}</h3>
          <p class='mt-3'>{{ this.getResourceDescription(config) }}</p>
          <v-divider class='mb-5'></v-divider>
        </div>
        <errors :errors="errors" />
        <slot :resource="data" :errors="errors" :config="config" name="edit"></slot>
      </div>
      <slot :resource="data" name="extra"/>
    </div>
  </div>
</template>

<script>

import { LoadResource } from '../../mixins/LoadResource'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
import { utils } from '../../mixins/utils'
import { hooks } from '../../mixins/hooks'
import Errors from '../../components/Errors'


export default {
  components: {
    Errors
  },
  mixins: [ 
    LoadResource,
    ResourceLocalization,
    utils,
    hooks
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
    details: {
      type: Boolean,
      default: true
    },
    activatorType: {
      type: String,
      default: "icon"
    },
    type: {
      type: String,
      default: 'button-navigator'
    },
    hooks: {
      type: Object
    }
  },
  created() {
    this.loadDataByProps().then((data) => {
      this.getHooks('OnChange', {
        resource: this.data
      });
    })

    if (!this.activator) {
      this.drawer = true;
    }
  },
  watch: {
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

        if (this.loading) {
          return;
        }

        this.resetData();

        this.$emit('update', this.data);
        bus.$emit(this.config.resourceEvent("updated"), this.data);
      }
    }
  },
  methods: {

    save () {

      if (this.loading) {
        return true;
      }

      this.loading = true;

      this.executeHooks('BeforeCreate', {id: this.data.id, resource: this.data}).then((data) => {
        return this.config.updateResource(data.id, data.resource);
      }).then(response => {
        this.errors = [];
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