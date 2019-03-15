<template>
  <div v-if="show && attribute">
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
      <div class="pt-2">
        <component 
          v-if="(!rawValue || !rawValue.id) && components.create" 
          v-bind:is="components.create" 
          :config="attributeConfig()" 
          activatorType="btn"
        ></component>

        <component 
          v-if="rawValue && rawValue.id && components.update" 
          v-bind:is="components.update" 
          :config="attributeConfig()" 
          :resource="rawValue"
          activatorType="btn"
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
    if (this.attribute.getCreateComponent()) {
      this.components.create = this.attribute.getCreateComponent().component;

    }

    if (this.attribute.getUpdateComponent()) {
      this.components.update = this.attribute.getUpdateComponent().component;
    }

  },
  watch: {
    value: function (){
      this.rawValue = this.attribute.extractValue(this.value);
      if (this.rawValue) {
        this.rawValue.label = this.attribute.getLabelByResource(this.rawValue);
      }
    },
    search (newVal) {
      (!this.rawValue || (this.rawValue && newVal !== this.rawValue.label)) && this.querySelections(newVal)
    },
  },
  methods: {

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
        val.label = this.attribute.getLabelByResource(val);
        this.items.push(val);
      }

      this.rawValue = val;
    },
    querySelections (v) {
      this.loading = true;

      this.lastRawValue = this.rawValue;

      v = this.attribute.executeQuery(v ? v : '', this.value);

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