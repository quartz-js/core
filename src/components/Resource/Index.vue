<template>
  <div>
    <v-dialog v-model="settingsActive" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ $t('$quartz.core.settings') }}
        </v-card-title>
        <v-card-text>
          <v-select :items="listable" v-model="cols" :menu-props="{ maxHeight: '400' }" :label="$t('$quartz.core.columns')" multiple persistent-hint item-text="label"
          ></v-select>
        </v-card-text>
      </v-card>
    </v-dialog> 

    <v-card class="resource-card pa-3 mb-4" v-if="loading || (pagination && pagination.totalItems !== 0) || query">
      <v-layout align-start>
        <v-text-field v-model="query" class="search" :placeholder="$t('$quartz.core.search-placeholder')" :error="errors.search" single-line hide-details></v-text-field>
        <v-btn color="primary" @click="load()">{{ $t('$quartz.core.search') }}</v-btn>

        <div class="text-xs-right"><slot name="top" :config="config"></slot></div>
      </v-layout>
    </v-card>

    <v-card class="resource-card">
      <div v-if="showContent">
        <div v-if="loading || (pagination && pagination.totalItems !== 0) || query">
        
        <v-data-table
          v-model="selected"
          :headers="getHeaders()"
          :items="data"
          select-all
          item-key="id"
          v-if="response"
          :pagination.sync="pagination"
          :total-items="pagination.totalItems"
          :loading="loading"
          :headers-length="countColumns()"
          :rowsPerPageItems="rowsPerPageItems"
          flat
        >
          <v-progress-linear slot="progress" color="blue" indeterminate style='margin-top: -1px; height: 3px'></v-progress-linear>
          <template slot="headers" slot-scope="props">
            <slot name="head" :config="config">
              <tr>
                <th width='80'>
                  <v-checkbox
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    primary
                    hide-details
                    @click.native="toggleAll"
                  ></v-checkbox>
                </th>
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                   class="text-xs-left cell"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)"
                >
                  {{ getAttributeLabel(header.attribute) }}
                  <v-icon small>arrow_upward</v-icon>
                </th>
                <th class="column sortable text-xs-right pr-4">
                  <span class='pr-3'>
                    {{ $t('$quartz.core.actions') }} 
                  </span>
                </th>
              </tr>
            </slot>
          </template>
          <template slot="items" slot-scope="props" >
            <tr :active="props.selected" :class="{'disable': !config.showRow(props.item)}">
              <td>
                <v-checkbox @change="props.selected = !props.selected"
                  :input-value="props.selected"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <slot name="row" :resource="props.item" :config="config">
                <td 
                  v-for="(attribute, index) in attributes" 
                  v-if="showAttribute(attribute)" 
                  :key="index" 
                  class="cell" 
                  :width="getAttributeWidth(attribute)" 
                  style='cursor: pointer' 
                  @click="switchRow(props.item);"
                >
                <q-text :resource="props.item" :attribute="attribute" :showLabel="false"/>
                </td>
              </slot>
              <td>
                <div  class="justify-end align-center layout px-2 text-xs-right" :class="{'hide': !config.showRow(props.item)}">
                  <slot name="actions" :resource="props.item" :config="config"></slot>
                  <v-btn class='ma-0 mx-1' icon small color="primary" flat @click="goToShow(props.item)"><v-icon>visibility</v-icon></v-btn>
                </div>
              </td>
            </tr>
            <tr v-if="currentRowOpened === props.item.id">
              <td :colspan="attributesShowable().length + 2">
                <div class="mt-3"></div>
                <div v-for="(attribute, index) in attributesShowable()">
                  <q-text :resource="props.item" :attribute="attribute"></q-text>  
                  
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>


      </div>
      <div v-else>
         <div class='content text-md-center'>
            <img :src='config.icon' width='218' class='my-3'>
            <h3 class='title my-3'>{{ $t('$quartz.core.no-results.message') }}</h3>
            <p class='my-4' style='max-width: 800px; margin: 0 auto'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lobortis in arcu at pellentesque. Sed at porta odio. Vivamus sollicitudin euismod justo id ornare. Suspendisse a metus orci. Cras tempor finibus metus, nec dictum enim sollicitudin sit amet. Vestibulum et suscipit lacus. Nam vestibulum tempus dolor.
              <!--{{ getResourceDescription(config) }}-->
            </p>
            <slot name="top" :config="config" :big="true"></slot>
          </div>
        </div>
      </div>
    </v-card>
    <div class='py-4 px-3 text-md-right' v-if="settingsEnabled">
      <a href="javascript:;" @click="settingsActive = true" class='ma-0'>{{ $t('$quartz.core.settings') }}</a>
    </div>
  </div>
</template>

<script>

import { utils } from '../../mixins/utils'
import Remove from '../../components/Resource/Remove'
import QText from '../../components/Show/Text'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
var qs = require('qs');
import _ from 'lodash'

export default {
  mixins: [
    utils,
    ResourceLocalization,
  ],
  components: {
    QText,
    Remove,
  },
  props: {
    config: {
      type: Object,
      required: true,
    },
    url: {
      type: Boolean,
      default: true
    },
    settingsEnabled: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      currentRowOpened: 0,
      showContent: true,
      query: '',
      rowsPerPageItems: [
        10, 25, 50, 100, 250, 500
      ],
      pagination: {
        sortBy: "id",
        descending: true,
        rowsPerPage: 25,
        totalPages: 0,
        page: 1
      },
      listable: [],
      selected: [],
      showRemoveSelectedDialog: false,
      settingsActive: false,
      manager: null,
      cols: [],
      response: {},
      form: {},
      params: null,
      errors: {
        form: [],
        search: null
      },
      timeout: null,
      loading: false
    }
  },
  computed: {
    data: {
      get: function() {
        return this.response.data;
      }, 
      set: function(val) {
        this.response.data = val;
      }
    }
  },
  watch: {
    pagination: {
      handler () {
        this.load();
      },
      deep: true
    },
    cols: {
      handler: function (val, oldVal) {
        this.$localStorage.set(this.config.getIdentification() + '.cols', JSON.stringify(val))
      },
      deep: true
    }
  },
  mounted: function () {

    this.query = this.$route.query.query;

    this.load();
    
    var cols = [];

    try {
      cols = JSON.parse(this.$localStorage.get(this.config.getIdentification() + '.cols'));
      cols = cols.filter(name => {
        return this.config.getListableAttributes().find(item => {
          return item.name === name;
        });
      })
    } catch (e) {

    }

    if (!cols || cols.length === 0 || cols[0].label) {
      var cols = this.config.getListableAttributes().filter((attribute) => {
        return attribute.required && attribute.fillable;
      }).map((attribute) => {
        return attribute.name
      })
    }

    this.cols = cols;
  },
  created () {
    this.reload();
    this.defineDefaultValue();
    this.manager = this.config.manager;
    this.attributes = this.config.attributes;

    if (this.config.hasAttribute('updated_at')) {
      this.pagination.sort = "-updated_at";
    }

    this.listable = this.selectableListableAttributes(this.config.getListableAttributes());

    bus.$on(this.config.resourceEvent("updated"), data => {
      this.load(true);
    });

    bus.$on(this.config.resourceEvent("created"), data => {
      this.load(true);
    });

    bus.$on(this.config.resourceEvent("removed"), data => {
      this.load(true);
    });
  },
  beforeDestroy() {
    bus.$off(this.config.resourceEvent("updated"));
    bus.$off(this.config.resourceEvent("created"));
    bus.$off(this.config.resourceEvent("removed"));
  },
  methods: {
    switchRow (item) {
      if (window.getSelection().toString()) {
        return;
      }
      
      this.currentRowOpened = this.currentRowOpened != item.id ? item.id : 0
    },
    attributesShowable () {
      return this.attributes.filter((attr) => {
        return this.showAttribute(attr);
      });
    },
    selectableListableAttributes(arr) {
      return arr.map((attribute) => {
        return {
          value: attribute.name,
          label: this.getAttributeLabel(attribute)
        }
      })
    },
    defineDefaultValue() {
    },
    countColumns () {
      return this.attributes.filter((attribute) => {
        return this.showAttribute(attribute)
      }).length+2;
    },
    showAttribute: function (attribute) {
      return this.cols.find(col => { return col === attribute.name });
    },
    goToShow: function (resource) {
      if (window.getSelection().isCollapsed === false) {
        return;
      }
      this.$router.push(this.config.getRouteShow(resource));
    },
    reload(){ 
      var route = this.getEncodedParamsFromUrl();

      route = this.decodeParams(route);

      this.query = route.query;
      this.pagination = route.pagination;
    },
    encodeParams (params) {
      return btoa(JSON.stringify(params));
    },
    decodeParams (string) {
      return JSON.parse(atob(string))
    },
    getEncodedParamsFromUrl (def) {
      var string = this.$route.query[this.config.name];

      if (!string) {
        string = this.encodeParams(def ? def : this.paramsToUrl())
      }

      return string;

    },
    paramsToUrl() {
      return {query: this.query, pagination: this.filterPaginationUrl(this.pagination)};
    },
    updateUrl() {
      var push = Object.assign({}, this.$route.query);

      push[this.config.name] = this.encodeParams(this.paramsToUrl());

      // window.history.replaceState(null, '', window.location.href.split("?")[0] + "?" + _.map(push, (val, key) => { return key+"="+val; }).join("&"));

      //this.$router.replace({query: push});
    },
    filterPaginationUrl(pagination) {
      return _.pick(pagination, ['sortBy', 'descending', 'page', 'rowsPerPage']);
    },
    load: function (force) {


      if (this.loading) {
        return;
      }

      var manager = this.config.manager;

      let params = {
        include: '',
        query: this.config.getFinalQuery(this.query),
        show: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: (this.pagination.descending ? "-" : "") + this.pagination.sortBy,
      };

      if (!force && _.isEqual(this.params, params)) {
        return;
      }

      this.loading = true;

      this.params = params;

      this.selected = [];

      this.config.executeHooks('include', []).then(includes => {
        params.include = includes.join(",");
        return manager.index(params)
      }).then(response => {
        this.errors.search = null

        this.pagination.totalPages = response.body.meta.pagination.total_pages;
        this.pagination.page = response.body.meta.pagination.current_page;
        this.pagination.totalItems = response.body.meta.pagination.total;
        this.pagination.rowsPerPage = response.body.meta.pagination.per_page;

        var body = response.body;

        return this.config.loadResources(response.body.data).then((r) => {
          body.data = r;
          this.response = body;
          this.updateUrl();
        })

      }).catch(response => {
        console.error(response)

        if (response.body && response.body.code === 'QUERY_SYNTAX_ERROR') {
          this.errors.search = response.body.message;
        }
        
        this.pagination.totalPages = 0;
        this.pagination.page = 1;

        if (response.body) {
          this.response = response.body;
        }

        this.response.data = [];
      }).finally(response => {
        this.loading = false;
      })
    },

    removeSelected: function () {

      /*
      var promises = this.selected.map((value, key) => {
        return this.manager.remove(this.response.data[key].id);
      });

      Promise.all(promises).then(response => {
        this.$notify(response.message, 'success')
      }).then(response => {
        this.load(null);
      }).catch(response => {
        this.$notify(response.message, 'error')
      });*/
    },
    getAttributeWidth(attribute) {


      return undefined
    },
    toggleAll () {
      this.selected = this.selected.length ? [] : this.data.slice();
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    getHeaders () {
      return this.attributes.filter((attribute) => {
        return this.showAttribute(attribute);
      }).map((attribute) => {
        return {
          attribute: attribute,
          value: attribute.getName(),
          text: attribute.getLabel(),
          align: 'left',
          sortable: true
        };
      });
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
  .search {
    padding-top:0;
  }

  .cell {
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
    padding: 0 12px !important;
  }
</style>