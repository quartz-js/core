<template>
  <div>
    <q-card class="pa-3 mb-4" v-if="loading || (pagination && pagination.totalItems !== 0) || query">
      <v-layout align-start>
        <v-text-field v-model="query" class="search" :placeholder="$t('$quartz.core.search-placeholder')" :error="errors.search" single-line hide-details name='search'></v-text-field>
        <q-btn
          :loading="loading"
          :disabled="loading"
          color="primary" 
          @click="load()"
          content-icon='search'
          :content-text="$t('$quartz.core.search')"
        />

        <div class="text-right"><slot name="top" :config="config"></slot></div>
      </v-layout>
    </q-card>

    <q-card>
      <div v-if="showContent">
        <div v-if="loading || (pagination && pagination.totalItems !== 0) || query">
        
        <v-data-table
          v-model="selected"
          :headers="getHeaders()"
          :items="data"
          :show-select="true"
          item-key="id"
          v-if="response"
          :page.sync="pagination.page"
          :server-items-length="pagination.totalItems"
          :loading="loading"
          :headers-length="countColumns()"
          :sort-by="pagination.sortBy"
          :sort-desc="pagination.descending"
          :footer-props="{
            'items-per-page-options': rowsPerPageItems
          }"
          flat
        >
          <v-progress-linear slot="progress" color="blue" indeterminate style='margin-top: -1px; height: 3px'></v-progress-linear>

          <template v-slot:item.data-table-select="{ isSelected, select }">
            <v-simple-checkbox color="primary" :value="isSelected" @input="select($event)"></v-simple-checkbox>
          </template>

          <template v-slot:header="{ headers }">
            <thead>
              <tr>
                <th
                  v-for="header in headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)"
                >
                  {{ header.attribute.label }}
                  <v-icon small>arrow_upward</v-icon>
                </th>
              </tr>
            </thead>
          </template>


          <template v-slot:body="{ items,select }" >
            <tbody>
              <tr v-for="item in items" :key="item.id" :class="{'disable': !config.showRow(item)}">
                <td><v-checkbox color="primary"></v-checkbox></td>
                <td 
                  v-for="(attribute, index) in attributesShowable()" 
                  v-if="showAttribute(attribute)" 
                  :key="index" 
                  class="cell" 
                  :width="getAttributeWidth(attribute)" 
                  style='cursor: pointer' 
                  @click="switchRow(item);"
                >
                  <q-show-text :resource="item" :attribute="attribute" :showLabel="false" class="ma-0"/>
                </td>
                <td>
                  <div class="justify-end align-center layout px-2 text-right" :class="{'hide': !config.showRow(item)}">
                    <slot name="actions" :resource="item" :config="config"></slot>
                    <q-btn-table
                      color="primary" 
                      @click="goToShow(item)"
                      content-icon='visibility'
                      :content-text="$t('$quartz.core.show')"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
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
    </q-card>
  </div>
</template>

<script>

import { utils } from '../../../mixins/utils'
import Remove from '../../Resource/Remove'
import QText from '../../Show/Text'
import { ResourceLocalization } from '../../../mixins/ResourceLocalization'
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
      selected: [],
      showRemoveSelectedDialog: false,
      manager: null,
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
    }
  },
  mounted: function () {

    this.query = this.$route.query.query;

    this.load();

  },
  created () {
    this.reload();
    this.defineDefaultValue();
    this.manager = this.config.manager;
    this.attributes = this.config.attributes;

    if (this.config.hasAttribute('updated_at')) {
      this.pagination.sort = "-updated_at";
    }

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
    defineDefaultValue() {
    },
    countColumns () {
      return this.attributes.filter((attribute) => {
        return this.showAttribute(attribute)
      }).length+2;
    },
    showAttribute: function (attribute) {
      return attribute.show === true && attribute.fixed(null) == undefined && attribute.fixed(null) !== null
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
      let headers = this.attributes.filter((attribute) => {
        return this.showAttribute(attribute);
      }).map((attribute) => {
        return {
          attribute: attribute,
          value: attribute.name,
          text: attribute.label,
          align: 'left',
          sortable: true
        };
      });

      headers.push({ text: '', value: 'action', sortable: false,align:'right' })

      return headers;
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