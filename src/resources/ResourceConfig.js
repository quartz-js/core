export class ResourceConfig {
  constructor (params) {

    this.create = true;
    this.update = true;
    this.remove = true;
    this.show = true;

    this.getParamsShow = function (resource) {
      return { id: resource.id };
    };

    this.getRouteShow = function (resource) {
      return { name: this.route + '.show', params: this.getParamsShow(resource) };
    };

    this.getId = function(vue) {
      return this.getKeyByRoute(vue.$route.params);
    };

    this.getRouteIndex = function(resource) {
      return {name: this.route + '.index'};
    }

    this.getKeyByRoute = function (params) {
      return params.id;
    };

    this.getFinalQuery = function (query) {
      return query;
    };

    this.getIdentification = function () {
      return this.manager.getFullUrl();
    };

    this.onShowEdit = function () {

    };

    this.onCreateSuccess = function (vue, response) {
    };

    this.onUpdateSuccess = function (vue, response) {
    };
    
    this.onRemoveSuccess = function (vue, response) {
    };



    /**
     * Get attribute by name
     *
     * @param {string} name
     *
     * @return {BaseAttribute}
     */
    this.getAttribute = function (name) {
      return this.attributes.find(function (attribute) {
        return attribute.name === name;
      });
    };

    /**
     * Get attributes by names
     *
     * @param {string} name
     *
     * @return {BaseAttribute}
     */
    this.getAttributes = function(names) {
      return this.attributes.filter(function (attribute) {
        return names.indexOf(attribute.name) !== -1;
      });
    };

    this.resourceEvent = function(label) {
      return this.title + ":" + label;
    }


    for (var i in params) {
      this[i] = params[i];
    }
  }
};
