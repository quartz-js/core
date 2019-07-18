import { BaseAttribute } from '../attributes/BaseAttribute'
import { Helper } from '../app/Helper'

export class Base extends BaseAttribute {
  listable = false;
  
  constructor (name) {
    super(name, {});

    this.mutator = (resource) => {
      return this.getLabelByResource(this.extractor(resource), resource)
    }

    this.query = (key, resource) => {

      let queries = [];

      let manager = this.getRelationManager(resource);

      if (manager) {
        let str = manager.getQueryableAttributes().map(attribute => {
          return attribute.name;
        }).join(', ,')

        queries.push(`concat(${str}) ct "${key}"`)
      } else {
        queries.push(`name ct "${key}"`)
      }

      if (this.style && this.style.query) {

        var template = (tpl, args) => tpl.replace(/\${(\w+)}/g, (_, v) => {
          return typeof args[v] !== 'undefined' ? args[v] : 'null'
        });

        let query = template(this.style.query, resource);

        query = query.split("eq null").join("is null");
        query = query.split("!= null").join("is not null");
        queries.push(query);
      }

      return Helper.mergePartsQuery(queries, "and");

    };
    
    this.priority = 0;
  }

  getLabelByResource (resource, parentResource) {

    if (!resource) {
      return;
    }

    if (parentResource) {
      let manager = this.getRelationManager(parentResource);
      
      if (manager) {
        let names = [];

        manager.getQueryableAttributes().map(attribute => {

          if (resource[attribute.name]) {
            names.push(resource[attribute.name]);
          }
        })

        return names.join(" ");
      }
    }

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
    
  getRelationManager (resource) {
    return null;
  }

  filterIndexerParams (params) {
    return {
      show: 50,
      query: this.executeQuery(params.query ? params.query : '', params.value)
    }
  }
}
