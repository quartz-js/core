import { BaseAttribute } from '../Attributes/BaseAttribute'
import { Helper } from '../Helper'
import Mustache from 'mustache'

export class Base extends BaseAttribute {

  relationables = [];

  constructor (name) {
    super(name, {});

    this.mutator = (resource) => {
      return this.getLabelByResource(this.extractor(resource), resource)
    }

    this.query = (key, resource) => {

      let relationable = this.getRelationable(resource);

      let queries = [];

      if (key) {
        let query = Mustache.render(relationable.query.template, _.merge(resource, {'__key__': key}))

        query = query.split("eq null").join("is null");
        query = query.split("!= null").join("is not null");

        queries.push(query);
      }


      return Helper.mergePartsQuery(queries, "and");

    };
    
    this.priority = 0;
  }

  /**
   * @param {Closure} closure
   */
  setRelationableSwitcher (closure) {
    this.relationableSwitcher = closure;
  }

  /**
   * @param {object} relationable
   */
  addRelationable(relationable) {
    this.relationables.push(relationable);
  }

  /**
   * @param {object} resource
   *
   * @return {object}
   */
  getRelationManager (resource) {

    if (!resource) {
      return null;
    }

    let relationable = this.getCurrentRelationableByResource(resource)

    if (!relationable) {
      return null;
    }

    let manager = relationable.manager(resource);
    relationable.onLoad(manager);

    return manager;
  }

  /**
   * @param {object} resource
   *
   * @return {object}
   */
  getCurrentRelationableByResource (resource) {
    return this.relationables.find((relationable) => {
      return relationable.key === this.relationableSwitcher(resource)
    })
  }

  /**
   * @param {object} resource
   *
   * @return {object}
   */
  getRelationableActions (resource) {
    if (!resource) {
      return null;
    }

    let relationable = this.getCurrentRelationableByResource(resource)

    return relationable ? relationable.actions : null
  }

  /**
   * @param {object} resource
   *
   * @return {object}
   */
  getRelationable (resource) {
    if (!resource) {
      return null;
    }

    let relationable = this.getCurrentRelationableByResource(resource)

    return relationable
  }

  /**
   * @param {object} resource
   * @param {object} parentResource
   *
   * @return string
   */
  getLabelByResource (resource, parentResource) {

    if (!resource) {
      return null;
    }

    return this.getRelationable(resource)
      ? Mustache.render(this.getRelationable(resource).label.template, resource)
      : null;
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

  /**
   * @param {object} params
   *
   * @return {object}
   */
  filterIndexerParams (params) {

    let relationable = this.getRelationable(params.value);

    return {
      show: 50,
      query: this.executeQuery(params.query ? params.query : '', params.value),
      include: relationable.query.include
    }
  }
}
