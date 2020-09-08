/**
 * Provide a query parameters utils to better search for a resource
 */
export var QueryHandler = {
  data: function() {
    return {
      queryParams: {
        query: '',
        sort: [],
        rowsPerPage: 5,
        totalPages: 0,
        page: 1
      }
    }
  },
  created() {
    this.updateParamsFromQueryUrl();
    this.updateInitialSortValue();
  },
  methods: {

    /**
     * Push initial sorting value if missing
     */
    updateInitialSortValue() {
      if (this.queryParams.sort.length === 0) {
        if (this.config.getAttribute('created_at').canShow()) {
          this.queryParams.sort.push({
            attribute: 'created_at',
            descending: true
          })
        } else if (this.config.getAttribute('id').canShow()) {
          this.queryParams.sort.push({
            attribute: 'id',
            descending: true
          })
        }
      }
    },

    /**
     * Convert query url (json-encoded) to params usable by a component
     */
    queryUrlToParams(query) {

      try {
        query = JSON.parse(query);
      } catch (e) {
        return {
          query: '',
          pagination: {}
        }
      }

      return {
        query: query.q || '', 
        page: query.p || 1,
        rowsPerPage: query.r || 5,
        sort: query.s ? query.s.map(i => {
          return {
            descending: i[0] === '-' ? true : false,
            attribute: i[0] === '-' ? i.substr(1) : i
          }
        }) : []
      };
    },

    /**
     * Convert params used by the component to query url (json-encoded)
     */
    paramsToQueryUrl() {
      return JSON.stringify({
        q: this.queryParams.query, 
        p: this.queryParams.page,
        r: this.queryParams.rowsPerPage,
        s: this.queryParams.sort.map(i => (i.descending ? '-' : '') + i.attribute)
      });
    },

    /**
     * Convert current params used by the component for an api request
     */
    paramsToApi() {
      return {
        include: '',
        query: this.config.getFinalQuery(this.queryParams.query, this.manager.vars),
        show: this.queryParams.rowsPerPage,
        page: this.queryParams.page,
        sort: this.queryParams.sort.map(i => (i.descending ? '-' : '') + i.attribute).join(','),
      };
    },

    /**
     * Update current pagination using the response given by the api
     */
    updateParamsFromResponseApi(response) {
      this.queryParams.totalPages = response.body.meta.pagination.total_pages;
      this.queryParams.page = response.body.meta.pagination.current_page;
      this.queryParams.totalItems = response.body.meta.pagination.total;
      this.queryParams.rowsPerPage = response.body.meta.pagination.per_page;
    },

    /**
     * Update the current parameters in case of an error
     */
    updateParamsOnError() {
      this.queryParams.totalPages = 0;
      this.queryParams.page = 1;
    },

    /**
     * Retrieve the key used to identify this object
     */
    getQueryParameterKey() {
      return this.config.name;
    },

    /**
     * Assign initial value from the current route
     */
    updateParamsFromQueryUrl() { 
      var route = this.queryUrlToParams(this.$route.query[this.getQueryParameterKey()]);

      this.queryParams = _.assign(this.queryParams, route);
    },

    /**
     * Update the url after a succesuful api request with the current parameters
     */
    pushHistory() {
      var push = Object.assign({}, this.$route.query);

      push[this.getQueryParameterKey()] = this.paramsToQueryUrl();

      window.history.pushState(null, '', window.location.href.split("?")[0] + "?" + _.map(push, (val, key) => { return key+"="+val; }).join("&"));
    }
  }
}