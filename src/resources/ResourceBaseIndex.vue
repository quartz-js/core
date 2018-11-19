<template>
  <div>
    <md-card v-if="data">
      <md-table v-model="data.data" @md-selected="onSelect" :md-sort.sync="sort.key" :md-sort-order.sync="sort.direction" :md-sort-fn="customSort">
        <md-table-toolbar>
          <h1 class="md-title">{{ config.title }} </h1>
          <div class="md-toolbar-section-end">

            <md-field md-clearable :class="getValidationClass(errors, 'search')" > 
              <label>{{ $t('query_label') }}</label>
              <md-input v-model="query"></md-input>
              <span class="md-error">There is an error</span>
            </md-field>

            &nbsp;

            <md-dialog :md-active.sync="settingsActive" md-title="Settings">

              <md-dialog-title>Settings</md-dialog-title>
              <div style='padding: 0 20px'>
                <md-field>
                  <label for="columns">Columns</label>
                  <md-select v-model="cols" name="columns" id="columns" multiple>
                    <md-option v-for="(attribute, index) in config.listable" :value="attribute" :key="index">{{ attribute }}</md-option>
                  </md-select>
                </md-field>
              </div>
            </md-dialog>


            <md-button class="md-primary" @click="settingsActive = true">Settings</md-button>

            &nbsp;

            <md-button v-if="config.create" class="md-primary" :to="{ name: config.route + '.create' }">Create</md-button>

          </div>
        </md-table-toolbar>

        <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
          <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" @click='showRemoveSelectedDialog = true'>
              <md-icon>delete</md-icon>
            </md-button>
          </div>
        </md-table-toolbar>

        <md-table-empty-state
          md-label="No results found"
          :md-description="`No result found for this '${query}' query. Try a different search term or create a new resource.`">
          <md-button class="md-primary md-raised" :to="{ name: config.route + '.create' }">Create New</md-button>
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="multiple" md-auto-select>
          <md-table-cell :md-label="attribute.name" :md-sort-by="attribute.name" v-for="(attribute, index) in attributes" v-if="showAttribute(attribute)" :key="index">
            {{ attribute.extractReadableValue(item) }}
          </md-table-cell>
          <md-table-cell md-numeric>
            <md-button class="md-primary md-mini md-plain" @click="goToShow(item)">
              <md-icon>edit</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>

      </md-table>

      <resource-index-pagination
        v-if="data"
        :pagination="pagination"
        @change="onChangePagination"/>
    </md-card>

    <md-dialog :md-active.sync="showRemoveSelectedDialog">
      <md-dialog-title>{{ $t('irreversible_operation.title') }}</md-dialog-title>
        <p class="content">{{ $t('irreversible_operation.message') }}<br><br>{{ $t('irreversible_operation.question') }}</p>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showRemoveSelectedDialog = false">No</md-button>
        <md-button class="md-primary" @click="showRemoveSelectedDialog = false; removeSelected();">Yes</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>

import { ResourceIndex } from '../mixins/ResourceIndex'
import ResourceIndexPagination from './ResourceIndexPagination'

require('pretty-checkbox/dist/pretty-checkbox.min.css');
export default {
  components: {
    ResourceIndexPagination,
  },
  mixins: [ResourceIndex],
  props: ['config'],

 
  created () {
    this.initConfig();
    this.manager = this.config.manager;
    this.attributes = this.config.attributes;
    this.listable = this.config.listable;

    for (var i in this.attributes) {
      var attribute = this.attributes[i];

      this.isAttributeListable(attribute) && this.cols.push({ value: attribute.name, label: attribute.label, enabled: true});
    }
  },
  methods: {
    getValidationClass (errors, name) {

      var error = Array.isArray(errors) ? errors.find((error) => {
        return error.label === this.name;
      }) : false;

      if (error) {
        return {
          'md-invalid': error
        }
      }
    },
    customSort (value) {
      this.updateUrl();
    },
    onSelect (item) {
      console.log(item);
      this.selected = item
    },
    getAlternateLabel (count) {
        let plural = ''

        if (count > 1) {
          plural = 's'
        }

        return `${count} resource${plural} selected`
      }
  }
}
</script>
<style scoped>
  .md-dialog {
    max-width: 468px;
    width: 100%;
  }

  .md-card {
    margin-top: 16px;
  }
</style>