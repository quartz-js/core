<template>
  <div v-if="show && attribute">
    <div>
      {{ value }}
      <v-layout row align-center class="mt-4 mx-0">
        <v-spacer>
          <q-autocomplete 
            :loading="loading"
            :items="items"
            item-text="label"
            :label="attribute.label"
            v-model="rawValue"
            @input="onChange"
            :hint="attribute.hint"
            :search-input="search"
            :search-input.sync="search"
            return-object
            editable
            clearable
            v-bind="globalAttributeProps()"
          ></q-autocomplete>
        </v-spacer>
        <div>
          <component 
            v-for="component in attribute.actions"
            v-bind:is="component"
            :resource="rawValue"
            :onManagerLoad="onRelationableManagerLoad"
            activatorType="q-btn-input"
          ></component>
        </div>
      </v-layout>
    </div>
  </div>
</template>
<script>

import { BaseAttribute } from '../../app/Attributes/BaseAttribute'
import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
import { Helper } from '../../app/Helper'

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
      type: BaseAttribute,
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

    if (!this.canMount()) {
      return;
    }

    this.attribute.executeHooks('watchToReload', []).then((arr) => {
      return arr.map(field => {
        this.$watch("value." + field, (newValue, oldValue) => {
          this.unload(null)
        })
      })
    })
    
    
    this.attribute.extractValue(this.value).then(value => {
      if (value) {
        this.loadByVal(value)
      } else {
        this.querySelections();
      }
    })
  },
  watch: {
    value: {
      handler: function (val) {
        this.loadByVal(this.attribute.extractValue(this.value));
      },
      deep: true
    },
    search (newVal) {
      (!this.rawValue || (this.rawValue && newVal !== this.rawValue.label)) && this.querySelections(newVal)
    },
  },
  methods: {
    onRelationableManagerLoad(t) {

      let relationable = this.attribute.select.manager(this.value)
      // relationable.onLoad(t);

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
        val.label = this.attribute.getSelectByResource(val);

        if (val.label) {
          this.items.push(val);
        }
      }

      this.rawValue = val;
    },
    querySelections (v) {
      this.loading = true;

      this.lastRawValue = this.rawValue;

      let manager = this.attribute.select.manager(this.value)

      let params = {
        query: this.attribute.filterQuery(this.value)
      }

      manager.index(params).then(response => {
        this.items = response.body.data.map((item) => {
          item.label = this.attribute.getSelectByResource(item);
          return item;
        });

      })
      .catch((response) => {
        Helper.handleResponse(response);
        // this.items = [];
        // this.loadByVal();

      }).finally(() => { this.loading = false});
    },
    onChange: function (val) {

      this.query = this.attribute.mutator(this.rawValue);

      let currVal = this.attribute.injectValue(this.value, this.rawValue);
  
      this.$emit('input', currVal);

    },

  }
}

</script>
<style scoped>
.layout > * {
  margin: 0;
}
</style>