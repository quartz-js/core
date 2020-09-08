<script>

import { utils } from '../../../mixins/utils'
import { QueryHandler } from './QueryHandler'
import { Helper } from '../../../app/Helper'
import Remove from '../../Resource/Remove'
import QText from '../../Show/Text'
import { ResourceLocalization } from '../../../mixins/ResourceLocalization'
var qs = require('qs');
import _ from 'lodash'

export default {
  mixins: [
    utils,
    ResourceLocalization,
    QueryHandler
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
    vars: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data: function () {
    return {
      currentRowOpened: 0,
      showContent: true,
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
      loading: false,
      queryTimeout: null,
      headers: []
    }
  },
  computed: {
  },
  created () {
    this.defineDefaultValue();
    this.manager = this.config;
    this.attributes = this.config.attributes;
    this.manager.sortAttributes();
    this.setHeaders();

    bus.$on(this.config.resourceEvent("reload"), data => {
      this.setHeaders();
      this.load(true);
    });

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
  watch: {
    config: {
      handler: function () {
        // this.setHeaders()
        // this.load()
      },
      deep: true
    },
  },
  methods: {
    setHeaders() {
      let headers = this.manager.attributes.filter((attribute) => {
        return attribute.canShow();
      }).map((attribute) => {
        return {
          attribute: attribute,
          value: attribute.name,
          text: attribute.label,
          align: 'left',
          sortable: true
        };
      });

      headers.push({ 
        text: '', 
        value: 'action', 
        sortable: false, 
        align:'right' 
      })

      this.headers = headers;
    },
    switchRow (item) {
      if (window.getSelection().toString()) {
        return;
      }
      
      this.currentRowOpened = this.currentRowOpened != item.id ? item.id : 0
    },
    attributesShowable () {
      return this.attributes.filter((attr) => {
        return attr.canShow();
      });
    },
    defineDefaultValue() {
    },
    countColumns () {
      return this.attributes.filter((attribute) => {
        return attribute.canShow()
      }).length+2;
    },
    goToShow: function (resource) {
      if (window.getSelection().isCollapsed === false) {
        return;
      }
      this.$router.push(this.config.getRouteShow(resource));
    },
    retrieved () {

    },
    load (force) {

      clearTimeout(this.queryTimeout)

      if (this.loading) {
        return;
      }

      this.errors.search = '';

      var manager = this.config.manager;

      let params = this.paramsToApi();

      if (!force && _.isEqual(this.params, params)) {
        return;
      }

      this.loading = true;

      this.params = params;

      this.selected = [];

      this.config.index(params).then(response => {

        this.errors.search = null

        this.updateParamsFromResponseApi(response);

        var body = response.body;

        return this.config.loadResources(response.body.data).then((r) => {
          body.data = r;
          this.response = null;

          return new Promise((resolve) => {
            return setTimeout((i) => {
              this.response = response;
              this.pushHistory();
              resolve();
            }, 1)
          })
        })

      }).catch(response => {

        Helper.handleResponse(response)

        if (response.body && response.body.code === 'QUERY_SYNTAX_ERROR') {
          this.errors.search = response.body.message;
        }
        
        this.updateParamsOnError();

        if (response.body) {
          this.response = response.body;
        }

        this.response.data = [];
      }).finally(response => {
        this.loading = false;
        this.retrieved()

        this.$emit("onLoad")
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