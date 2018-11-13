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
                    <md-option v-for="attribute in config.listable" :value="attribute">{{ attribute }}</md-option>
                  </md-select>
                </md-field>
              </div>
            </md-dialog>


            <md-button class="md-primary md-raised" @click="settingsActive = true">Settings</md-button>

            &nbsp;

            <md-button v-if="config.create" class="md-raised md-primary" :to="{ name: config.route + '.create' }">Create</md-button>

          </div>
        </md-table-toolbar>

        <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
          <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" v-b-modal="'delete-'+config.route">
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
          <md-table-cell :md-label="attribute.name" :md-sort-by="attribute.name" v-for="attribute in attributes" v-if="showAttribute(attribute)">
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
    <b-modal :id="'delete-'+config.route" :ref="'delete-'+config.route" :title="$t('removing')" hide-footer>
      <div class="d-block text-center">
        <p>{{ $t('irreversible_operation') }} <br><br>{{ $t('are_you_sure') }}</p>
      </div>
      <b-btn class="mt-3" variant="danger" block @click="hideModal('delete-'+config.route); removeSelected();">{{ $t('yes') }}</b-btn>
      <b-btn class="mt-3" variant="primary" block @click="hideModal('delete-'+config.route); ">{{ $t('no') }}</b-btn>
    </b-modal>
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
    max-width: 768px;
    width: 100%;
  }
</style>