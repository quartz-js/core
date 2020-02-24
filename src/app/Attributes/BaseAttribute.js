import _ from 'lodash';
var clone = require('clone');
import { container } from '../Container';
import { Translator } from '../Translator';
import { Helper } from '../Helper';
import { Hook } from '../Hook';
import Twig from 'twig';

export class BaseAttribute {
  required = false;
  
  constructor (name, options) {
    this.translator = new Translator();
    this.hook = new Hook();
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

    if (!this.extract) {
      return Promise.resolve(null)
    }

    for (let i in this.extract.attributes) {

      let val = this.extract.attributes[i];


      if (val.path && _.has(resource, val.path)) {
          return Promise.resolve(_.get(resource, val.path))
      }

      if (val.query) {
        return this.attribute.select.manager(resource).index({
          query: container.get('template').parse(val.query, {resource: resource})
        })
      }
    }
    return Promise.resolve(null)
    // throw new Error("It seems that the extraction of the resource to retrieve the attribute value failed. Please check your 'extract' attribute in the attribute: " + this.name)
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
      return this.getLabelByResource(value, resource)
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

    _.map(this.inject.attributes, (val, key) => {

      if (val.template) {
        let parsed = container.get('template').parse(val.template, {value: value, resource: resource})

        _.set(resource, key, parsed);
      }

      if (val.path) {
        _.set(resource, key, _.get({value: value}, val.path));
      }
    })


    return resource;
  }

  injectPersist(resource, value) {

    _.map(this.persist.attributes, (name) => {
      _.set(resource, name, _.get(value, name));
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

    if (!this.persist.data) {
      return Promise.resolve(1)
    }
    return this.extractValue(data).then(val => {

      let calls = this.multiple ? val || [] : [val]

      // Searching by criteria, remove all that doesn't have criteria + id.

      let queries = [];

      if (!Array.isArray(calls)) {
        return 1;
      }

      calls.map(value => {
        let attrs = _.mapValues(this.persist.data.attributes, (i) => {
          return Twig.twig({data: i}).render({
            value: value,
            resource: data
          })
        })

        queries.push(attrs)
      });

      let scopes = _.mapValues(this.persist.data.scopes, (val, key) => {
        return Twig.twig({data: val}).render({
          resource: data
        })
      })

      let query = _.map(scopes, (val, key) => {
        return `${key} eq "${val}"`
      }).join(" and ")

      /*query = query + " and " + queries.map(i => {
        return _.map(i, (val, key) => {
          return `${key} != "${val}"`
        }).join(" and ")
      }).join(" and ")*/

      return this.persist.manager(data).manager.erase(query).then(i => {

        let promises = [];
        queries.map(value => {
          promises.push(this.persist.manager(data).manager.create(_.merge(scopes, value)))
        })

        return Promise.all(promises)
      })
    })

  }

  boot () {

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
  getLabelByResource (value, resource) {
    if (typeof value === 'undefined' || typeof resource === 'undefined') {
      return null;
    }

    let resources = this.multiple ? (value || []) : [value]
    return resources.map(value => container.get('template').parse(this.readable.label, value ? {resource: resource, value: value} : {})).join("\n");
  }

  /**
   * @param {object} resource
   *
   * @return string
   */
  getSelectByResource (value, resource) {
    return container.get('template').parse(this.select.label, {value: value, resource: resource})
  }

  /**
   * @param {object} resource
   *
   * @return string
   */
  filterQuery (value, resource, key) {
    return container.get('template').parse(this.select.query, {value: value, resource: resource, '__key__': key})
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
