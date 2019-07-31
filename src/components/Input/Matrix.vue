<template>
  <div v-if="show && attribute" class="mt-4">
    <span>{{ getAttributeLabel(attribute) }}</span>
    <span>{{ getAttributeDescription(attribute) }}</span>
    <v-divider/>
    <v-layout row wrap align-center v-if="rawValue && items.length > 0" >
      <v-data-table :items="items" hide-headers :pagination.sync="pagination" style='width:100%'>
        <template slot="items" slot-scope="props">
          <td v-for="(field, fieldKey) in props.item" class="text-xs-left">
            <div v-if="!field.editable" style='white-space: nowrap'>
              {{ field.name }}
            </div>
            <div v-else>
              <v-text-field :label="fieldKey" v-model="rawValue[findIndexRawValueByRow(props.item)][fieldKey]"></v-text-field>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-layout>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import _ from 'lodash'
import { Matrix } from '../../app/Relations/Matrix'
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
      type: Matrix,
      required: true
    },
    errors: {
      required: true
    }
  },
  data: function () {
    return {
      pagination: null,
      rawValue: null,
      loading: false,
      items: [],
      components: {
        create: null,
        update: null
      }
    }
  },
  created () {

    if (!this.canMount()) {
      return;
    }

    this.loading = true;
    this.attribute.load([this.value]).then((data) => {
      this.loading = false;
      this.loadByVal(this.attribute.extractValue(this.value));
    }).then(() =>{
      let items = [];


      this.attribute.row(this.value).map((row, rowKey) => {
        
        items[rowKey] = {};

        _.mapValues(row, (field, fieldKey) => {
          items[rowKey][fieldKey] = field
        });
      })


      this.items = items;
    })

  },
  watch: {
    rawValue: function() {
      this.onChange();
    },
    value: function (){
      this.rawValue = this.attribute.extractValue(this.value);
    },
  },
  methods: {
    findIndexRawValueByRow (row) {
      var resource = this.attribute.combineRow(row);

      if (!this.rawValue) {
        return -1;
      }

      var index = this.rawValue.findIndex(valueToFind => {


        var result = _.isEqual(this.attribute.subsetByPrimaryKeys(valueToFind, this.rawValue), this.attribute.subsetByPrimaryKeys(resource, resource)) === true

        return result;
      })

      return index;
    },
    loadByVal (val) {
      this.rawValue = val;
    },
    unload(data) {
      this.loadByVal(data);
      this.onChange();
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
  span {
    color: rgba(0,0,0,0.54);
    font-size: 16px;
    margin-right: 5px;
    margin-bottom: 2px;
    text-align: left;
    display: block;
  }
</style>