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
        sort: [],
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
  created () {
    this.reload();
    this.defineDefaultValue();
    this.manager = this.config;
    this.attributes = this.config.attributes;

    console.log(this.pagination)
    if (this.showAttribute(this.config.getAttribute('updated_at'))) {
      this.pagination.sort.push({
        attribute: 'updated_at',
        descending: true
      })
    } else if (this.showAttribute(this.config.getAttribute('id'))) {
      this.pagination.sort.push({
        attribute: 'id',
        descending: true
      })
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
      return _.pick(pagination, ['sort', 'page', 'rowsPerPage']);
    },
    getQueryVars () {
      return {
        a:1
      }
    },
    getQuery () {
      return this.config.getFinalQuery(this.query, this.getQueryVars())
    },
    retrieved () {

    },
    load: function (force) {

      if (this.loading) {
        return;
      }

      var manager = this.config.manager;

      let params = {
        include: '',
        query: this.getQuery(),
        show: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.pagination.sort.map(i => (i.descending ? '-' : '') + i.attribute).join(','),
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
        this.retrieved()
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