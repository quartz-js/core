<template>
  <div>
    <v-layout row wrap align-center>
      <v-autocomplete
          :loading="loading"
          :items="items"
          item-text="label"
          :label="attribute.getLabel()"
          v-model="rawValue"
          @change="onChange()"
          :search-input="search"
          :search-input.sync="search"
          return-object
        ></v-autocomplete>

      <v-btn flat small icon color="info" class="mx-1" @click.stop="create()" v-if="!rawValue && attribute.getCreateComponent()"><v-icon>add</v-icon></v-btn>
      <v-btn flat small icon color="info" class="mx-1" @click.stop="update()" v-if="rawValue && attribute.getUpdateComponent()"><v-icon>edit</v-icon></v-btn>
      <v-btn flat small icon color="info" class="mx-1" @click.stop="rawValue = null;" v-if="rawValue"><v-icon>clear</v-icon></v-btn>
    </v-layout>

    <v-navigation-drawer v-model="extraDrawer" fixed temporary app right width='800'>
      <component v-if="extraComponent" v-bind:is="extraComponent" :config="extraConfig" flat type='wrap'></component>
    </v-navigation-drawer>
    
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import { mixin as clickaway } from 'vue-clickaway';

export default {
  mixins: [ clickaway ],
  props: ['value', 'attribute', 'error', 'errors'],
  data: function () {
    return {
      rawValue: null,
      loading: false,
      search: '',
      items: [],
      extraDrawer: false,
      extraComponent: null,
      extraConfig: {},
    }
  },
  created () {

    var val = this.attribute.extractValue(this.value);

    if (val) {
      this.loadByVal(val);
    } else {
      this.querySelections();
    }

  },
  watch: {
    search (newVal) {
      newVal && newVal !== this.rawValue && this.querySelections(newVal)
    }
  },
  methods: {
    unload(data) {
      this.loadByVal(data);
      this.extraDrawer = false;
      this.onChange();
      this.extraComponent = null;
    },
    create() {
      this.extraComponent = this.attribute.getCreateComponent().component;
      this.extraConfig = this.attribute.getCreateComponent().config;
      this.extraConfig.onCreateSuccess = (vue, response) => {
        this.unload(response.body.data);
      }
      this.extraDrawer = true;
    },
    update() {
      this.extraComponent = this.attribute.getUpdateComponent().component;
      this.extraConfig = this.attribute.getUpdateComponent().config;
      this.extraConfig.getId = (vue) => {
        return this.rawValue && this.rawValue.id;
      };
      this.extraConfig.onUpdateSuccess = ($router, response) => {
        this.unload(response.body.data);
      }
      this.extraConfig.onRemoveSuccess = ($router, response) => {
        this.unload(null);
      }
      this.extraDrawer = true;
    },
    loadByVal (val) {
      if (val) {
        val.label = this.attribute.getLabelByResource(val);
        this.items.push(val);
      }

      this.rawValue = val;
    },
    querySelections (v) {
      this.loading = true;

      v = v ? this.attribute.executeQuery(v, this.rawValue) : '';

      this.attribute.api.index({show: 5, query: v})
        .then(response => {
          this.items = response.body.data.map((item) => {
            item.label = this.attribute.getLabelByResource(item);
            return item;
          });
        })
        .finally(() => { this.loading = false});
    },
    onChange: function () {

      this.query = this.attribute.mutator(this.rawValue);

      this.attribute.injectValue(this.value, this.rawValue ? this.rawValue.id : null);
  
      this.$emit('input', this.rawValue);

    },

  }
}

</script>
<style scoped>
.layout > * {
  margin: 0;
}
</style>