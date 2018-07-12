export class ResourceConfig {
  constructor (params) {
    this.getParamsShow = function (resource) {
      return { id: resource.id };
    };

    this.getRouteShow = function (resource) {
      return { name: this.route + '.show', params: this.getParamsShow(resource) };
    };

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

    for (var i in params) {
      this[i] = params[i];
    }
  }
};
