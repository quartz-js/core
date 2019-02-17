<template>
  <div>
    <v-card class="resource-card">
      <v-dialog v-model="settingsActive" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            {{ $t('$quartz.core.settings') }}
          </v-card-title>
          <v-card-text>
            <v-select :items="listable" v-model="cols" :menu-props="{ maxHeight: '400' }" :label="$t('$quartz.core.columns')" multiple persistent-hint
            ></v-select>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-container fluid style='background:#f5f5f5; height: 64px; padding: 0 10px' align-center>
        <v-btn flat icon @click="showContent = !showContent"><v-icon>menu</v-icon></v-btn>
        <div class='v-toolbar__title'>{{ this.getResourceTitle(config) }}</div>
        <v-spacer></v-spacer>
        <div>
          <v-btn icon flat @click="settingsActive = true"><v-icon>settings</v-icon></v-btn>
        </div>
      </v-container>


      <div v-if="showContent">
        <div v-if="(pagination && pagination.totalItems !== 0) || query">

        <v-layout align-center class='content'>
          <v-text-field v-model="query" append-icon="search" class="search" :label="$t('$quartz.core.search')" :error="errors.search" single-line hide-details></v-text-field>
          <slot name="top" :config="config"></slot>
        </v-layout>

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
            <tr>
              <th>
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
                 class="text-xs-left"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                {{ getAttributeLabel(header.attribute) }}
                <v-icon small>arrow_upward</v-icon>
              </th>
              <th class="column sortable text-xs-right">
                {{ $t('$quartz.core.actions') }}
              </th>
            </tr>
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
              <td v-for="(attribute, index) in attributes" v-if="showAttribute(attribute)" :key="index">
                {{ attribute.extractReadableValue(props.item) }}
              </td>
              <td>
                <div  class="justify-end align-center layout px-2 text-xs-right" :class="{'hide': !config.showRow(props.item)}">
                  <remove :resource="props.item" :config="config"/>
                  <slot name="actions" :resource="props.item"></slot>
                  <v-btn icon small color="primary" flat @click="goToShow(props.item)"><v-icon>visibility</v-icon></v-btn>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <div v-else>
         <div class='content text-md-center'>
            <img :src='config.icon ? config.icon : "https://image.flaticon.com/icons/svg/1055/1055645.svg"' width='218' class='my-3'>
            <h3 class='title my-3'>{{ $t('$quartz.core.no-results.message') }}</h3>
            <p class='my-4'>{{ getResourceDescription(config) }}</p>
            <slot name="top" :config="config" :big="true"></slot>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>

import { utils } from '../../mixins/utils'
import Remove from '../../components/Resource/Remove'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
var qs = require('qs');
import _ from 'lodash'

export default {
  mixins: [
    utils,
    ResourceLocalization,
  ],
  components: {
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
    }
  },
  data: function () {
    return {
      showContent: true,
      query: '',
      rowsPerPageItems: [
        10, 25, 50, 100, 250, 500
      ],
      pagination: {
        sortBy: "updated_at",
        descending: true,
        rowsPerPage: 25,
        totalPages: 0,
        page: 1
      },
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
      loading: true
    }
  },
  computed: {
    compoundProperty () {
      return [this.query].join()
    },
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
        this.updateUrl();
      },
      deep: true
    },
    compoundProperty: function (val, oldVal) {
      if (val == oldVal) {
        return
      }

      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        this.updateUrl();
      }, 300)
    },

    '$route.query'() {
        if (this.hasChanged()) {
          this.load(null);
        }
    },
    cols: {
      handler: function (val, oldVal) {
        this.$localStorage.set(this.config.getIdentification() + '.cols', JSON.stringify(val))
      },
      deep: true
    }
  },
  mounted: function () {

    this.load(null);
    
    var cols = [];

    try {
      cols = JSON.parse(this.$localStorage.get(this.config.getIdentification() + '.cols'));
    } catch (e) {

    }

    if (!cols || cols.length === 0 || cols[0].label) {
      cols = this.listable;
    }

    this.cols = cols;
  },
  created () {
    this.config.ini();
    this.reload();
    this.manager = this.config.manager;
    this.attributes = this.config.attributes;
    this.listable = this.config.getListableAttributes();


    bus.$on(this.config.resourceEvent("updated"), data => {
      this.load();
    });

    bus.$on(this.config.resourceEvent("created"), data => {
      this.load();
    });

    bus.$on(this.config.resourceEvent("removed"), data => {
      this.load();
    });
  },
  methods: {
    countColumns () {

      return this.attributes.filter((attribute) => {
        return this.showAttribute(attribute)
      }).length+2;
    },
    onChangeQuery: function (query) {
      if (this.query == query) {
        return
      }

      this.query = query;

      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        this.updateUrl()
      }, 900)
    },
    isAttributeListable: function (attribute) {
      return this.listable.indexOf(attribute.name) !== -1;
    },
    showAttribute: function (attribute) {
      return this.isAttributeListable(attribute) && this.cols.find(col => { return col === attribute.name });
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
    hasChanged () {

      var route = this.getEncodedParamsFromUrl({
        query: '',
        pagination: {
          sortBy: "updated_at",
          descending: true,
          rowsPerPage: 10,
          page: 1
      }});

      return route !== this.encodeParams(this.paramsToUrl())
    },
    updateUrl() {

      if (this.hasChanged()) {
        var push = Object.assign({}, this.$route.query);

        push[this.config.name] = this.encodeParams(this.paramsToUrl());

        this.$router.push({query: push});

        this.load(null)
      }
    },
    filterPaginationUrl(pagination) {
      return _.pick(pagination, ['sortBy', 'descending', 'page', 'rowsPerPage']);
    },
    load: function (params) {
      var manager = this.config.manager;
      this.params = params;

      this.loading = true;

      this.selected = [];

      manager.index({
        query: this.config.getFinalQuery(this.query),
        show: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: (this.pagination.descending ? "-" : "") + this.pagination.sortBy ,
      }).then(response => {
        this.errors.search = null
        this.pagination.totalPages = response.body.meta.pagination.total_pages;
        this.pagination.page = response.body.meta.pagination.current_page;
        this.pagination.totalItems = response.body.meta.pagination.total;
        this.pagination.rowsPerPage = response.body.meta.pagination.per_page;

        var promises = this.attributes.map(attribute => {
          return attribute.load(response.body.data);
        });

        return Promise.all(promises).then(() => {
          this.loading = false;
          this.response = response.body;
        })

      }).catch(response => {
        if (response.body && response.body.code === 'QUERY_SYNTAX_ERROR') {
          this.errors.search = response.body.message;
        }
        

        this.pagination.totalPages = 0;
        this.pagination.page = 1;
        this.response = response.body;
        this.response.data = [];
        this.loading = false;
        
      });
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
    margin-right: 40px;
  }
</style>