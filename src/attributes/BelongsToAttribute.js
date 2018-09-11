import { BaseAttribute } from './BaseAttribute'

export class BelongsToAttribute extends BaseAttribute {
  constructor (name, api, options) {
    super(name, options);
    var self = this;

    this.api = api;
    this.query = function (key) {
      return "name ct '" + key + "'";
    };
    this.mutator = function (value) {
      return value ? value.name : null;
    };

    this.injector = function (resource, value) {
      resource[self.name] = value;

      return resource;
    };

    this.extractor = resource => {
      return typeof resource[this.getRelationName()] !== 'undefined' ? resource[this.getRelationName()] : null;
    };
  }

  getRelationName () {
    return this.name + '_relation';
  }

  /**
   * @param {string} name
   *
   * @return this
   */
  setApi (api) {
    this.api = api;

    return this;
  }

  /**
   * @return {string}
   */
  getApi () {
    return this.api;
  }

  /**
   * @param {callable} query
   *
   * @return this
   */
  setQuery (query) {
    this.query = query;

    return this;
  }

  /**
   * @return {string}
   */
  getQuery () {
    return this.query;
  }

  /**
   * @param {string} key
   *
   * @return this
   */
  executeQuery (key) {
    return this.query(key);
  }

  getLabelByResource (resource) {
    return resource.name;
  }

  /**
   * @return {Callable}
   */
  load (resources) {
    var ids = resources.filter(resource => { return resource[this.column]; }).map(resource => { return resource[this.column] }).join(',');
    return this.api.index({query: ids ? 'id in (' + ids + ')' : ''}).then(response => {
      resources.map(resource => {
        resource[this.getRelationName()] = response.body.data.find(b_resource => { return b_resource.id == resource[this.column] });
      });
    });
  }
}
