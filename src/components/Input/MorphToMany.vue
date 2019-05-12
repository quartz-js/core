<template>
  <div v-if="show && attribute">
    <v-layout row wrap align-center>
      <v-autocomplete
          :loading="loading"
          :items="items"
          item-text="label"
          :label="label !== undefined ? label : getAttributeLabel(attribute)"
          :hint="hint !== undefined ? hint : getAttributeDescription(attribute)"
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
  </div>
</template>
<script>

import _ from 'lodash'
import { MorphToMany } from '../../relations/MorphToMany'
import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'

export default {
  mixins: [
    AttributePreMount,
    ResourceLocalization
  ],
  props: {
    value: {
      required: true,
    },
    attribute: {
      type: MorphToMany,
      required: true
    },
    errors: {
      required: true
    },
    label: {
      default: undefined
    },
    hint: {
      default: undefined
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
      var t = this.attribute.getRelationManager(this.value).clone();
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

      this.lastRawValue = this.rawValue

      this.attribute.indexerApi.index(this.attribute.filterIndexerParams({query: v, value: this.value}))
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

      console.log('injectnig');
      console.log(this.rawValue);

      this.attribute.injectValue(this.value, this.rawValue);

      this.$emit('input', this.value);

    },

  }
}

</script>
<style scoped>
.layout > * {
  margin: 0;
}
</style>