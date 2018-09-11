import _ from 'lodash';

export var ResourceBase = {

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

    /**
     * Get attributes by names
     *
     * @param {string} name
     *
     * @return {BaseAttribute}
     */
    getAttributes (names) {
      return this.attributes.filter(function (attribute) {
        return names.indexOf(attribute.name) !== -1;
      });
    },

    /**
     * Parse API body
     * 
     * @param mixed $object
     *
     * @return {object}
     */
    parseApiBody (body) {

      if (Array.isArray(body.data)) {
        for (var i in body.data) {
          body.data[i] = _.merge({id: body.data[i].id}, body.data[i].attributes);
        }
      } else if (_.isObject(body.data)) {
          body.data = _.merge({id: body.data.id}, body.data.attributes);
      }
      console.log(body.data);

      return body;
    },

    /**
     * Initialize config
     *
     * @return void
     */
    initConfig () {
      if (!this.config.getParamsShow) {
        this.config.getParamsShow = function (resource) {
          return { id: resource.id };
        };
      }

      if (!this.config.getRouteShow) {
        this.config.getRouteShow = function (resource) {
          return { name: this.route + '.show', params: this.getParamsShow(resource) };
        };
      }

      if (!this.config.getKeyByRoute) {
        this.config.getKeyByRoute = function (params) {
          return params.id;
        };
      }
    }

  }
}
