import _ from 'lodash';
var clone = require('clone');
import { container } from '../Container';
import { Translator } from '../Translator';
import { Helper } from '../Helper';
import Twig from 'twig';

export class BaseAttribute {
  required = false;
  
  constructor (name, options) {
    this.translator = new Translator();

    this.hooks = [];
    this.priority = 1;

    this.retrievers = {};

    this.default = () => {
      return null;
    };
    
    this.fixed = (resource) => {
      return undefined;
    }

    this.mutator = (resource) => {
      return this.getLabelByResource(resource)
    }

    this.query = (key, resource) => {

      let relationable = this.getRelationable(resource);

      let queries = [];

      let query = Twig.twig({data: relationable.query.template}).render(_.merge(resource, {'__key__': key}))

      query = query.split("eq null").join("is null");
      query = query.split("!= null").join("is not null");

      queries.push(query);

      return Helper.mergePartsQuery(queries, "and");

    };
  }

  async extractor (resource) {
    for (let i in this.extract.attributes) {

      let val = this.extract.attributes[i];

      if (val.path && _.has(resource, val.path)) {
          return Promise.resolve(_.get(resource, val.path))
      }

      if (val.query) {
        return this.attribute.select.manager(resource).index({
          query: Twig.twig({data: val.query}).render({resource: resource})
        })
      }
    }

    throw new Error("cannot resolve " + this.name)
  }

  ini () {
  }

  fill (vars) {
    _.map(vars, (val, key) => {
      this.set(key, val)
    })

    return this
  }

  set (name, value) {
    _.set(this, name, value)

    return this
  }

  get (name) {
    return _.get(this, name)
  }

  setFixed (callback, query) {
    this.set('fixed', callback);
    this.manager().parserFinalQuery.push((query) => {

      let fixed = this.fixed(null);
      
      // @todo: label of fixed
      fixed = typeof fixed === 'object' && fixed ? fixed.id : fixed;

      let newQuery = '';

      if (fixed === null) {
        newQuery = `${this.column} is null`;
      } else {
        newQuery = `${this.column} = '${fixed}'`
      }

      return Helper.mergePartsQuery([newQuery, query], 'and');
    })
  }
  
  toPage (resource) {
    return null

    // this.getSelectManager(resource).getRouteShow(this.extractValue(resource))
  }

  injectDefault (data, route) {

    let defaultByRoute = this.parseExtractedDefaultFromRoute(this.extractDefaultFromRoute(route));

    this.injectValue(data, defaultByRoute ? defaultByRoute : this.getDefault())
  }

  extractDefaultFromRoute (route) {
    return route['query'] && route['query'][this.name] ? route['query'][this.name] : null;
  }

  parseExtractedDefaultFromRoute (value) {
    return value;
  }

  /**
   * @return {Closure}
   */
  getDefault () {
    return this.fixed(null) || this.default();
  }
  
  addHook($event, callback) {
    if (typeof this.hooks[$event] === "undefined") {
      this.hooks[$event] = [];
    }

    this.hooks[$event].push(callback)

  }

  getHooks($event){
    var hooks = typeof this.hooks[$event] !== "undefined" ? this.hooks[$event] : [];

    return hooks
  }


  executeHooks($event, data) {

    var hooks = this.getHooks($event, data);

    return hooks.reduce(function (prev, curr) {
      return prev.then((data) => {
        return curr(data);
      });
    }, Promise.resolve(data));
  }


  /**
   * @return {string}
   */
  getDescription () {
    return this.description;
  }

  /**
   * @return {Callable}
   */
  getMutator () {
    return this.mutator;
  }

  /**
   * Extract value from resource
   *
   * @param {object} resource
   *
   * @return Promise
   */
  extractValue (resource) {
    return this.extractor(resource);
  }

  /**
   * Extract value from resource in a readable format
   *
   * @param {object} resource
   *
   * @return mixed
   */
  extractReadableValue (resource) {
    return this.extractValue(resource).then(value => {
      return this.getLabelByResource({value: value})
    })
  }

  /**
   * Inject value to resource
   *
   * @param {object} resource
   * @param {mixed} value
   *
   * @return mixed
   */
  injectValue (resource, value) {

    if (!resource) {
      return;
    }

    _.map(this.persist.attributes, (val, key) => {

      if (val.template) {
        let parsed = Twig.twig({data: val.template}).render({value: value, resource: resource})

        _.set(resource, key, parsed);
      }

      if (val.path) {
        _.set(resource, key, _.get({value: value}, val.path));
      }
    })

    return resource;
  }

  /**
   * @return {Callable}
   */
  load (resources) {
    return Promise.resolve(resources);
  }
  
  clone () {
    return clone(this);
  }

  getIdsFromResources (resources) {

    return resources.filter(resource => { 
      return resource.id; 
    }).map(resource => { 
      return resource.id 
    });

  }

  getIdsNotBootedFromResources (resources) {

    return resources.filter(resource => { 
      return resource.id && !resource.__booted; 
    }).map(resource => { 
      return resource.id 
    });

  }

  preUpdate(data) {
    if (this.fixed(data) !== undefined) {
      delete data[this.name]
    }

    return data;
  }

  onSave(id, data) {
    return Promise.resolve(1)
  }

  onUpdate(data) {

  }

  onRemove(data) {

  }

  onCreate(data) {

  }

  getClassName() {
    return 'BaseAttribute'
  }

  /**
   * @param {object} resource
   *
   * @return string
   */
  getLabelByResource (resource) {
    return Twig.twig({data: this.readable.label}).render(resource ? resource : {})
  }

  /**
   * @param {object} resource
   *
   * @return string
   */
  getSelectByResource (resource) {
    return Twig.twig({data: this.select.label}).render(resource ? resource : {})
  }

  /**
   * @param {object} resource
   *
   * @return string
   */
  filterQuery (resource) {
    return Twig.twig({data: this.select.query}).render(resource ? resource : {})
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
   * @return {Callable}
   */
  /*persist (id, data) {
    return;
    
    let query;

    if (this.morphTypeColumn) {
      query = `${this.morphTypeColumn} = '${this.morphTypeValue}' and ${this.morphKeyColumn} eq ${id}`;
    } else {
      query = `${this.morphKeyColumn} eq ${id}`;
    }

    return this.storageApi.index({
      query: query, 
      show: 999
    }).then(responseR => {
      
      var idsOriginal = responseR.body.data.map(resource => {
        return parseInt(resource[this.relationId])
      });

      var idsDefined = typeof data[this.column] !== "undefined" && data[this.column] ? data[this.column].filter(resource => resource).map(resource => {
        return parseInt(resource.id)
      }) : [];
      
      var idsToAdd = idsDefined.filter(rId => {
          return idsOriginal.indexOf(rId) < 0;
      });

      var idsToRemove = idsOriginal.filter(rId => {
          return idsDefined.indexOf(rId) < 0;
      });

      var promises = idsToAdd.map((resourceId) => {
        var params = {};

        if (this.morphTypeColumn) {
          params[this.morphTypeColumn] = this.morphTypeValue
        }

        params[this.morphKeyColumn] = id
        params[this.relationId] = resourceId

        return this.storageApi.create(params);
      });

      if (idsToRemove.length > 0) {

        let query;

        if (this.morphTypeColumn) {
          query = `${this.morphTypeColumn} = '${this.morphTypeValue}' and ${this.morphKeyColumn} eq ${id} and ${this.relationId} in (${idsToRemove.join(',')})`
        } else {
          query = `${this.morphKeyColumn} eq ${id} and ${this.relationId} in (${idsToRemove.join(',')})`
        }

        promises.push(this.storageApi.erase({
          query: query
        }));
      }

      return Promise.all(promises);
    });
  }*/
}
