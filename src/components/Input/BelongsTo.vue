<template>
  <div>
    <v-layout row wrap align-center>
      <v-autocomplete
          :loading="loading"
          :items="items"
          item-text="label"
          :label="attribute.getLabel()"
          v-model="rawValue"
          @input="onChange"
          :search-input="search"
          :search-input.sync="search"
          return-object
          editable
          clearable
        ></v-autocomplete>

      <component v-if="!rawValue && components.create.is" v-bind:is="components.create.is" :config="components.create.config" flat type='wrap'>
        
        <template slot="activator" slot-scope="scope">
          <v-btn flat small icon color="info" class="mx-1" @click="scope.drawer = true"><v-icon>new</v-icon></v-btn>
        </template>
      </component>


      <component v-if="rawValue && components.update.is" v-bind:is="components.update.is" :config="components.update.config" :resource="rawValue" flat type='wrap'>
        
        <template slot="activator" slot-scope="scope">
          <v-btn flat small icon color="info" class="mx-1" @click="scope.drawer = true"><v-icon>add</v-icon></v-btn>
        </template>
      </component>

    </v-layout>
        
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
      components: {
        create: {
          is: null,
          config: null,
        },
        update: {
          is: null,
          config: null,
        }
      }
    }
  },
  mounted () {

    var val = this.attribute.extractValue(this.value);

    if (val) {
      this.loadByVal(val);
    } else {
      this.querySelections();
    }

    if (this.attribute.getCreateComponent()) {
      this.components.create.is = this.attribute.getCreateComponent().component;
      this.components.create.config = this.attribute.getCreateComponent().config;
    }

    if (this.attribute.getUpdateComponent()) {
      this.components.update.is = this.attribute.getUpdateComponent().component;
      this.components.update.config = this.attribute.getUpdateComponent().config;
    }

  },
  watch: {
    value: function (){
      this.rawValue = this.attribute.extractValue(this.value);
    },
    search (newVal) {
      newVal !== this.rawValue && this.querySelections(newVal)
    },
  },
  methods: {
    unload(data) {
      this.loadByVal(data);
      this.onChange();
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

      this.lastRawValue = this.rawValue;

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
    onChange: function (val) {

      this.query = this.attribute.mutator(this.rawValue);

      this.attribute.injectValue(this.value, this.rawValue);
  
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