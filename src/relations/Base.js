import { BaseAttribute } from '../attributes/BaseAttribute'
import { Helper } from '../app/Helper'

export class Base extends BaseAttribute {
  listable = false;
  
  constructor (name) {
    super(name, {});


    this.query = (key, resource) => {

      let queries = [];

      queries.push("name ct '" + key + "'");

      if (this.style && this.style.query) {

        var template = (tpl, args) => tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

        let query = template(this.style.query, resource);

        query = query.split("eq null").join("is null");
        queries.push(query);
      }

      return Helper.mergePartsQuery(queries, "and");

    };
    
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
