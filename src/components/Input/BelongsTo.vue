<template>
  <div v-if="show && attribute && attribute.getRelationManager(this.value)">
    <div v-if="!attribute.style.form">
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
            v-for="component in attribute.getRelationableActions(value)"
            v-bind:is="component"
            :resource="rawValue"
            :config="attribute.getRelationManager(value).clone()" 
            :onManagerLoad="onRelationableManagerLoad"
            activatorType="icon"
          ></component>
        </div>
      </v-layout>
    </div>
    <div v-if="attribute.style.form && attribute.style.form.name === 'checker'" style='margin-bottom:-25px'>
      <v-checkbox v-model="checked" :label="getAttributeLabel(attribute)" @change="onChange()"></v-checkbox>
    </div>
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
      checked: false,
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

    this.attribute.executeHooks('watchToReload', []).then((arr) => {
      return arr.map(field => {
        this.$watch("value." + field, (newValue, oldValue) => {
          this.unload(null)
        })
      })
    })
    
    var val = this.attribute.extractValue(this.value);
    
    if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {
      this.querySelections(''); 
    } 

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
        this.loadByVal(this.attribute.extractValue(this.value));

        if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {
          this.querySelections(''); 
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

      let relationable = this.attribute.getRelationable(this.value);
      relationable.onLoad(t);

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

        this.checked = (this.items.length > 1 && val.id === this.items[1].id)
      }

      this.rawValue = val;

    },
    querySelections (v) {
      this.loading = true;

      if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {
        v = null;
      }

      this.lastRawValue = this.rawValue;

      let manager = this.attribute.getRelationManager(this.value);

      let params = this.attribute.filterIndexerParams({
        query: v, 
        value: this.value
      });

      params.query = manager.getFinalQuery(params.query);

      this.attribute.executeHooks('include', []).then(includes => {
        params.include = includes.join(",");
        return manager.manager.index(params)
      }).then(response => {
        this.items = response.body.data.map((item) => {
          item.label = this.attribute.getLabelByResource(item);
          return item;
        });


        if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {
          this.loadByVal(this.rawValue)
        }

      })
      .finally(() => { this.loading = false});
    },
    onChange: function (val) {

      if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {
        this.rawValue = this.items.filter((item, key)=> {
          return (this.checked === false && key === 0) || (this.checked === true && key === 1);
        })[0]

        console.log(this.rawValue.id);
      }

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