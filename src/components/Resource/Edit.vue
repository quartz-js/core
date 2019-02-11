<template>
  <div v-if="data !== 0 && data !== null && config.update === true" class='text-xs-left'>
    <div v-if="type === 'button-navigator'"  style='display:inline-block'>
      <slot name="activator" :drawer="drawer">
        <v-btn small flat icon color="primary" @click="drawer = true"><v-icon>edit</v-icon></v-btn>
      </slot>
      <slot :resource="data" name="main">
        <v-navigation-drawer v-model="drawer" fixed temporary app right width='800'>
          <div class="content"  v-if="drawer">
            <h3 class='title'>{{ $t('data.' + config.title + '.name') }} - #{{ data.id }}</h3>
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
    <div v-if="type === 'direct'">
      <div>
        <h3 class='title'>{{ $t('data.' + config.title + '.name') }} - #{{ data.id }}</h3>
        <p class='mt-3'>{{ config.description }}</p>
        <v-divider class='mb-5'></v-divider>
        <errors :errors="errors" />
        <slot :resource="data" :errors="errors" :config="config" name="edit"></slot>
      </div>
      <slot :resource="data" name="extra"/>
    </div>
  </div>
</template>

<script>

import { LoadResource } from '../../mixins/LoadResource'
import { utils } from '../../mixins/utils'
import { hooks } from '../../mixins/hooks'
import Errors from '../../components/Errors'


export default {
  components: {
    Errors
  },
  mixins: [ 
    LoadResource, 
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
    type: {
      type: String,
      default: 'button-navigator'
    },
    hooks: {
      type: Object
    }
  },
  created() {
    this.config.ini();
    this.loadDataByProps();

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

      this.executeHooks('BeforeCreate', {id: this.data.id, resource: this.data}).then((data) => {
        return this.config.updateResource(data.id, data.resource);
      }).then(response => {
        this.errors = [];
        this.drawer = false;
      }).catch(response => {
        console.log(response);
        this.errors = response.body.errors || response.body.message
      }).finally(response => {
        this.loading = false;
      });
    },
  }
}

</script>