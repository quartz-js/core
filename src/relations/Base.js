import { BaseAttribute } from '../attributes/BaseAttribute'

export class Base extends BaseAttribute {
  listable = false;
  
  constructor (name) {
    super(name, {});
    this.priority = 0;
  }

  getLabelByResource (resource) {
    return resource.name;
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
      show: 50,
      query: this.executeQuery(params.query ? params.query : '', params.value)
    }
  }
}
