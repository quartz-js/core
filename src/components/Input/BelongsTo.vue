<template>
  <div v-if="show && attribute && attribute.getRelationManager(this.value)">
    <v-layout row align-top class="mt-4">
      <v-spacer>
        <v-autocomplete 
          :loading="loading"
          :items="items"
          item-text="label"
          :label="label !== undefined ? label : getAttributeLabel(attribute)"
          v-model="rawValue"
          @input="onChange"
          :hint="hint !== undefined ? hint : getAttributeDescription(attribute)"
          persistent-hint
          :search-input="search"
          :search-input.sync="search"
          return-object
          editable
          clearable
        ></v-autocomplete>
      </v-spacer>
      <div class="pt-4">
        <component 
          v-for="component in attribute.getRelationableActions(this.value)"
          v-bind:is="component"
          :resource="rawValue"
          :config="attributeConfig()" 
          :onManagerLoad="onRelationableManagerLoad"
          activatorType="icon"
        ></component>
      </div>
    </v-layout>
  </div>
</template>
<script>

import { BelongsToAttribute } from '../../attributes/BelongsToAttribute'
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
    label: {
      default: undefined
    },
    hint: {
      default: undefined
    },
    attribute: {
      type: BelongsToAttribute,
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
      items: []
    }
  },
  created () {

  },
  mounted () {

    if (!this.canMount() || !this.attribute.getRelationManager(this.value)) {
      return;
    }

    this.attribute.executeRetriever('watchToReload', []).map(field => {
      this.$watch("value." + field, (newValue, oldValue) => {
        this.unload(null)
      })
    })
    
    var val = this.attribute.extractValue(this.value);
    
    if (val === null && this.value[this.name] !== null) {
      this.loading = true;
      this.attribute.load([JSON.parse(JSON.stringify(this.value))]).then((data) => {
        this.loading = false;
        this.rawValue = this.attribute.extractValue(data[0]);
        this.onChange();
      });
    } else if (val && val.id) {
      this.loadByVal(val);
    } else {
      this.querySelections();
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.rawValue = this.attribute.extractValue(this.value);
        if (this.rawValue) {
          this.rawValue.label = this.attribute.getLabelByResource(this.rawValue);
        }
      },
      deep: true
    },
    search (newVal) {
      (!this.rawValue || (this.rawValue && newVal !== this.rawValue.label)) && this.querySelections(newVal)
    },
  },
  methods: {
    onRelationableManagerLoad(t) {

      t.onUpdateSuccess = (vue, response) => {
        this.unload(response.body.data);
      }
      t.onCreateSuccess = (vue, response) => {
        this.unload(response.body.data);
      }
      return t;
    },

    attributeConfig() {
      return  this.attribute.getRelationManager(this.value).clone();
    },
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

      this.attribute.getRelationManager(this.value).manager.index(this.attribute.filterIndexerParams({query: v, value: this.value}))
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