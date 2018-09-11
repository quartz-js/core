import { ResourceBase } from './ResourceBase'

export var ResourceIndex = {
  components: {
  },
  mixins: [
    ResourceBase
  ],
  data: function () {
    return {
      pagination: {
        show: 10,
        page: 1,
        max_pages: null
      },
      query: '',
      manager: null,
      cols: [],
      data: null,
      form: {},
      params: null,
      import: {},
      errors: {
        form: [],
        search: null
      },
      sort: {
        name: 'id',
        value: 'desc'
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

      var self = this
      clearTimeout(self.timeout)

      self.timeout = setTimeout(() => {
        this.updateUrl();
      }, 300)
    },

    '$route.query'() {
        this.reload();
        this.load(null);
        // this.$forceUpdate();

        // console.log(this.$route);
        // this.$router.push(this.$route.query.page);
    },
    cols: {
      handler: function (val, oldVal) {
        this.$localStorage.set(this.config.getIdentification() + '.cols', JSON.stringify(val))
      },
      deep: true
    }
  },
  methods: {

    /**
    * Get attribute by name
    *
    * @param {string} name
    *
    * @return {BaseAttribute}
    */
    getAttribute (name) {
      return this.attributes.find(function (attribute) {
        return attribute.name === name;
      });
    },
    getAttributes (names) {
      return this.attributes.filter(function (attribute) {
        return names.indexOf(attribute.name) !== -1;
      });
    },
    onChangePagination: function (pagination) {
      this.pagination = pagination;
      this.updateUrl();
    },
    onSort: function (key, direction) {
      this.sort.name = key;
      this.sort.value = direction;
      this.updateUrl();
    },
    updateAllSelected ($event) {
      var self = this;
      this.selected = [];
      this.data.data.map(function (value, key) {
        self.selected[key] = $event.target.checked;
      });
    },
    onChangeQuery: function (query) {
      if (this.query == query) {
        return
      }

      this.query = query;

      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        self.updateUrl()
      }, 900)
    },
    showCol: function (name) {

    },

    onSearch: function () {

    },
    isAttributeListable: function (attribute) {
      return this.listable.indexOf(attribute.name) !== -1;
    },
    showAttribute: function (attribute) {
      return this.isAttributeListable(attribute) && this.cols.find(col => { return col.value === attribute.name }).enabled;
    },
    goToShow: function (resource) {
      if (window.getSelection().isCollapsed === false) {
        return;
      }
      this.$router.push(this.config.getRouteShow(resource));
    },


    updateUrl() {

      var currentQuery = this.$route.query.query;
      var currentPage = this.$route.query.page ? this.$route.query.page : 1;
      var currentShow = this.$route.query.show ? this.$route.query.show : 10;

      if (this.query === currentQuery && this.pagination.page == currentPage && this.pagination.show == currentShow) {
        return;
      }

      this.$router.push({
        query: {
          query: this.query,
          page: this.pagination.page,
          show: this.pagination.show
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
        sort: (this.sort.value === 'desc' ? "-" : "") + this.sort.name,
      }).then(response => {
        var self = this;
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

        console.log(response);

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

    hideModal (ref) {
      this.$refs[ref].hide()
    },

    reload(){ 

      this.query = this.$route.query.query ? this.$route.query.query : '';
      this.pagination.show = this.$route.query.show ? parseInt(this.$route.query.show) : 10;
      this.pagination.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
    }
  },
  created: function () {
    var self = this;
    this.initConfig();
    this.reload();
  },
  mounted: function () {
    console.log('a');

    if (!this.config.manager) {
      return null;
    }

    this.load(null);

    try {
      var cols = JSON.parse(this.$localStorage.get(this.config.getIdentification() + '.cols'));

      for (var x in cols) {
        this.cols.find(c => { return c.value === cols[x].value; }).enabled = cols[x].enabled;
      }
    } catch (e) {

    }
  }
}
