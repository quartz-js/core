import { BaseAttribute } from '../attributes/BaseAttribute'

export class Base extends BaseAttribute {
  constructor (name) {
    super(name, {});
    this.priority = 0;
  }

  getLabelByResource (resource) {
    return resource.name;
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
   * @return {string}
   */
  getQuery () {
    return this.query;
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
   * @param {string} key
   * @param {object} resource
   *
   * @return this
   */
  executeQuery (key, resource) {
    return this.query(key, resource);
  }
  

  filterIndexerParams (params) {
    return {
      show: 5,
      query: this.executeQuery(params.query ? params.query : '', params.value)
    }
  }
}
