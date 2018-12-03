<template>
  <v-card >
    <v-layout align-center class='content'>
      <div>
        <h3 class='title'>{{ string(config.title).humanize().toString() }}</h3>
      </div>
      <v-spacer></v-spacer>
      <v-text-field v-model="query" append-icon="search" class="search" label="Search" single-line hide-details></v-text-field>
      <v-dialog v-model="settingsActive" width="500">

        <v-btn color="primary" flat icon @click="settingsActive = true" slot="activator"><v-icon>settings</v-icon></v-btn>
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Columns Settings
          </v-card-title>
          <v-card-text>
            <v-select :items="config.listable" v-model="cols" :menu-props="{ maxHeight: '400' }" label="Columns" multiple persistent-hint
            ></v-select>
          </v-card-text>
        </v-card>
      </v-dialog>

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
        :rowsPerPageItems="rowsPerPageItems"
        flat
      >
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
            {{ header.text }}
            <v-icon small>arrow_upward</v-icon>
          </th>
          <th class="column sortable">
            actions
          </th>
        </tr>
      </template>

        <template slot="items" slot-scope="props">
          <tr :active="props.selected">
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

            <td class="justify-center align-center layout px-0">
              <remove :resource="props.item" :config="config"/>
              <slot name="actions" :resource="props.item"></slot>
              <v-btn icon small color="primary" flat @click="goToShow(props.item)"><v-icon>visibility</v-icon></v-btn>
            </td>

          </tr>

        </template>
      </v-data-table>
  </v-card>
</template>

<script>

import { utils } from '../../mixins/utils'
import Remove from '@railken/vue-admin-core/src/components/Resource/Remove'
var qs = require('qs');

export default {
  mixins: [
    utils,
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
      response: null,
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
        this.reload();
        this.load(null);
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
      cols = this.config.listable;
    }

    this.cols = cols;
  },
  created () {
    this.config.ini();
    this.reload();
    this.manager = this.config.manager;
    this.attributes = this.config.attributes;
    this.listable = this.config.listable;

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

      var route = this.$route.query[this.config.title];

      if (!route) {
        route = JSON.stringify({
          query: null,
          pagination:  this.pagination
        })
      }
      route = JSON.parse(route);

      this.query = route.query;
      this.pagination = route.pagination;
    },
    updateUrl() {

      var route = this.$route.query[this.config.title];

      if (!route || route !== JSON.stringify({query: this.query, pagination: this.pagination})) {

        var push = {};

        push[this.config.title] = JSON.stringify({
            query: this.query,
            pagination: this.pagination
        });

        this.$router.push({query: push});

        this.$forceUpdate();
      }



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

        Promise.all(promises).then(() => {
          this.loading = false;
          this.response = response.body;
        }).catch(response => {
          this.$notify(response.message, 'error')
        })


      }).catch(response => {

        if (response.body && response.body.code === 'QUERY_SYNTAX_ERROR') {
          this.errors.search = response.body.message;
        }
        
        this.pagination.totalPages = 0;
        this.pagination.page = 0;
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