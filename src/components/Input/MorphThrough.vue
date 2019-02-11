<template>
  <div v-if="show && attribute">
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
          multiple
          hide
          clearable
        >
        <template
            slot="selection"
            slot-scope="data"
          >
        </template>
      </v-autocomplete>
    </v-layout>
    <div >
      <v-chip  color="primary" text-color="white" v-for="item in rawValue" close @input="remove(item)"> {{ item.id }} {{ item.label }} </v-chip>
    </div>
        
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import _ from 'lodash'
import { MorphThrough } from '../../relations/MorphThrough'
import { AttributePreMount } from '../../mixins/AttributePreMount'

export default {
  mixins: [
    AttributePreMount
  ],
  props: {
    value: {
      required: true,
    },
    attribute: {
      type: MorphThrough,
      required: true
    },
    errors: {
      required: true
    }
  },
  data: function () {
    return {
      rawValue: null,
      loading: false,
      search: '',
      items: [],
      components: {
        create: null,
        update: null
      }
    }
  },
  mounted () {

    if (!this.canMount()) {
      return;
    }
    
    var val = this.attribute.extractValue(this.value);

    if (val === null && this.value[this.name] !== null) {
      this.loading = true;
      this.attribute.load([this.value]).then((data) => {
        this.loading = false;
        this.loadByVal(this.attribute.extractValue(this.value));
      });
    } else if (val) {
      this.loadByVal(val);
    } else {
      this.querySelections();
    }
  },
  watch: {
    value: function (){
      this.rawValue = this.attribute.extractValue(this.value);


      if (this.rawValue.length > 0) {
        this.rawValue.map(resource => {
          return resource.label = this.attribute.getLabelByResource(resource)
        });
      }
    },
    search (newVal) {
      (!this.rawValue || (this.rawValue && newVal !== this.rawValue.label)) && this.querySelections(newVal)
    },
  },
  methods: {
    remove (item) {
      const index = this.rawValue.findIndex(r => {
        return item.id = r.id;
      });

      if (index >= 0) {
        this.rawValue.splice(index, 1)
      }
    },
    attributeConfig() {
      var t = this.attribute.resourceConfig().clone();
      t.onUpdateSuccess = (vue, response) => {
        this.unload(response.body.data);
      }
      t.onCreateSuccess = (vue, response) => {
        this.unload(response.body.data);
      }
      return t;
    },
    unload(data) {
      this.loadByVal(data);
      this.onChange();
    },
    loadByVal (val) {
      if (val) {
        val.map(resource => {
          resource.label = this.attribute.getLabelByResource(resource)
          this.items.push(resource);
        })
      }

      this.rawValue = val;
    },
    querySelections (v) {
      this.loading = true;

      this.lastRawValue = this.rawValue;

      v = this.attribute.executeQuery(v ? v : '', this.value);

      this.attribute.indexerApi.index({show: 5, query: v})
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