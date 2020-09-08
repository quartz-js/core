/**
 * Provide a query parameters utils to better search for a resource
 */
export var QueryHandler = {
  data: function() {
    return {
      query: '',
      rowsPerPageItems: [
        5, 10, 25, 50, 100, 250, 500
      ],
      pagination: {
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
      if (this.pagination.sort.length === 0) {
        if (this.config.getAttribute('created_at').canShow()) {
          this.pagination.sort.push({
            attribute: 'created_at',
            descending: true
          })
        } else if (this.config.getAttribute('id').canShow()) {
          this.pagination.sort.push({
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
        pagination: {
          page: query.p || 1,
          rowsPerPage: query.r || 5,
          sort: query.s ? query.s.map(i => {
            return {
              descending: i[0] === '-' ? true : false,
              attribute: i[0] === '-' ? i.substr(1) : i
            }
          }) : []
        }
      };
    },

    /**
     * Convert params used by the component to query url (json-encoded)
     */
    paramsToQueryUrl() {
      return JSON.stringify({
        q: this.query, 
        p: this.pagination.page,
        r: this.pagination.rowsPerPage,
        s: this.pagination.sort.map(i => (i.descending ? '-' : '') + i.attribute)
      });
    },

    /**
     * Convert current params used by the component for an api request
     */
    paramsToApi() {
      return {
        include: '',
        query: this.config.getFinalQuery(this.query, this.manager.vars),
        show: this.pagination.rowsPerPage,
        page: this.pagination.page,
        sort: this.pagination.sort.map(i => (i.descending ? '-' : '') + i.attribute).join(','),
      };
    },

    /**
     * Update current pagination using the response given by the api
     */
    updateParamsFromResponseApi(response) {
      this.pagination.totalPages = response.body.meta.pagination.total_pages;
      this.pagination.page = response.body.meta.pagination.current_page;
      this.pagination.totalItems = response.body.meta.pagination.total;
      this.pagination.rowsPerPage = response.body.meta.pagination.per_page;
    },

    /**
     * Update the current parameters in case of an error
     */
    updateParamsOnError() {
      this.pagination.totalPages = 0;
      this.pagination.page = 1;
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

      this.query = route.query;
      this.pagination = _.assign(this.pagination, route.pagination);
    },

    /**
     * Update the url after a succesuful api request with the current parameters
     */
    pushHistory() {
      var push = Object.assign({}, this.$route.query);

      push[this.getQueryParameterKey()] = this.paramsToQueryUrl();

      window.history.replaceState(null, '', window.location.href.split("?")[0] + "?" + _.map(push, (val, key) => { return key+"="+val; }).join("&"));
    }
  }
}