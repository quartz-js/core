import { ResourceBase } from './ResourceBase'

export var ResourceIndex = {
  components: {
  },
  mixins: [
    ResourceBase
  ],
  data: function () {
    return {
      showRemoveSelectedDialog: false,
      settingsActive: false,
      pagination: {
        show: 25,
        page: 1,
        max_pages: null
      },
      query: '',
      manager: null,
      cols: [],
      data: null,
      form: {},
      params: null,
      errors: {
        form: [],
        search: null
      },
      sort: {
        key: 'id',
        direction: 'desc'
      },
      timeout: null,
      selected: [],
      loading: false
    }
  },
  computed: {
    compoundProperty () {
      return [this.query].join()
    }
  },
  watch: {
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
  methods: {

    onChangePagination: function (pagination) {
      this.pagination = pagination;
      this.updateUrl();
    },
    onSort: function (key, direction) {
      this.sort.key = key;
      this.sort.direction = direction;

      this.updateUrl();
    },
    updateAllSelected ($event) {
      this.selected = [];
      this.data.data.map((value, key) => {
        this.selected[key] = $event.target.checked;
      });
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

      this.query = this.$route.query.query ? this.$route.query.query : '';
      this.pagination.show = this.$route.query.show ? parseInt(this.$route.query.show) : 10;
      this.pagination.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
      this.sort.direction = this.$route.query.sort_direction ? this.$route.query.sort_direction : 'desc';
      this.sort.key = this.$route.query.sort_field ? this.$route.query.sort_field : 'id';
    },
    updateUrl() {

      var currentQuery = this.$route.query.query;
      var currentPage = this.$route.query.page ? this.$route.query.page : 1;
      var currentShow = this.$route.query.show ? this.$route.query.show : 10;
      var currentSortDirection = this.$route.query.sort_direction ? this.$route.query.sort_direction : 'desc';
      var currentSortKey = this.$route.query.sort_field ? this.$route.query.sort_field : 'id';

      if (this.query === currentQuery && 
          this.pagination.page == currentPage && 
          this.pagination.show == currentShow && 
          this.pagination.show == currentShow &&
          this.sort.key == currentSortKey &&
          this.sort.direction == currentSortDirection
        ) {
        return;
      }

      this.$router.push({
        query: {
          query: this.query,
          page: this.pagination.page,
          show: this.pagination.show,
          sort_direction: this.sort.direction,
          sort_field: this.sort.key,
        }
      });

      this.$forceUpdate();

    },

    /**
    * Load data
    *
    * @return void
    */
    load: function (params) {
      var manager = this.config.manager;
      this.params = params;


      this.loading = true;

      this.selected = [];

      manager.index({
        query: this.config.getFinalQuery(this.query),
        show: this.pagination.show,
        page: this.pagination.page,
        sort: (this.sort.direction === 'desc' ? "-" : "") + this.sort.key,
      }).then(response => {
        this.errors.search = null
        this.pagination.pages = response.body.meta.pagination.total_pages;
        this.pagination.page = response.body.meta.pagination.current_page;
        // this.sort = response.body.sort[0];
        this.loading = false;


        var promises = this.attributes.map(attribute => {
          return attribute.load(response.body.data);
        });

        Promise.all(promises).then(() => {
          this.data = response.body;
        }).catch(response => {
          this.$notify(response.message, 'error')
        });

      }).catch(response => {

        if (response.body && response.body.code === 'QUERY_SYNTAX_ERROR') {
          this.errors.search = response.body.message;
        }

        this.data = null;
        this.loading = false;
      }).then(response => {

      });
    },

    removeSelected: function () {

      var promises = this.selected.map((value, key) => {
        return this.manager.remove(this.data.data[key].id);
      });

      Promise.all(promises).then(response => {
        this.$notify(response.message, 'success')
      }).then(response => {
        this.load(null);
      }).catch(response => {
        this.$notify(response.message, 'error')
      });
    },
  },
  created: function () {
    this.initConfig();
    this.reload();
  },
  mounted: function () {

    if (!this.config.manager) {
      return null;
    }

    this.load(null);
    
    var cols = [];

    try {
      cols = JSON.parse(this.$localStorage.get(this.config.getIdentification() + '.cols'));
    } catch (e) {

    }

    if (cols.length === 0 || cols[0].label) {
      cols = this.config.listable;
    }

    this.cols = cols;
  }
}
