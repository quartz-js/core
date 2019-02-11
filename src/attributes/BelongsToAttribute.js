import { BaseAttribute } from './BaseAttribute'

export class BelongsToAttribute extends BaseAttribute {
  constructor (name, api, options) {
    super(name, options);

    this.api = api;
    this.query = (key) => {
      return "name ct '" + key + "'";
    };
    this.mutator = (value) => {
        return value ? this.getLabelByResource(value) : null;
    };

    this.injector = (resource, value) => {
      resource[this.getRelationName()] = value;
      resource[this.name] = value ? value.id : null;

      return resource;
    };

    this.extractor = resource => {
      return resource && typeof resource[this.getRelationName()] !== 'undefined' ? resource[this.getRelationName()] : null;
    };
  }

  getRelationName () {
    return this.name + '_relation';
  }

  /**
   * @param {string} component
   *
   * @return this
   */
  setCreateComponent(component) {
    this.createComponent = component;

    return this;
  }

  /**
   * @return {string}
   */
  getCreateComponent() {
    return this.createComponent;
  }

  /**
   * @param {string} component
   *
   * @return this
   */
  setUpdateComponent(component) {
    this.updateComponent = component;

    return this;
  }

  /**
   * @return {string}
   */
  getUpdateComponent() {
    return this.updateComponent;
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
   * @param {object} resource
   *
   * @return this
   */
  executeQuery (key, resource) {
    return this.query(key, resource);
  }

  getLabelByResource (resource) {
    return resource.name;
  }

  /**
   * @return {Callable}
   */
  load (resources) {
    var ids = resources.filter(resource => { return resource[this.column]; }).map(resource => { return resource[this.column] }).join(',');

    return this.api.index({query: ids ? 'id in (' + ids + ')' : '', show: 999}).then(responseR => {
      resources.map(resource => {
        resource[this.getRelationName()] = responseR.body.data.find(b_resource => { return b_resource.id == resource[this.column] });

        return resource;
      });
    });
  }
}
