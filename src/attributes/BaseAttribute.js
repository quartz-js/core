import lodash from 'lodash';
var clone = require('clone');

export class BaseAttribute {
  required = false;
  
  constructor (name, options) {

    if (!options) {
      options = [];
    }
    
    this.required = false;
    this.hooks = [];
    this.name = name;
    this.label = name;
    this.column = name;
    this.priority = 1;
    this.descriptor = options.descriptor || [];
    this.retrievers = {
    };

    this.default = () => {


      return null;
    };

    if (options && options.column) {
      this.column = options.column;
    }

    this.mutator = (value) => {
      return value;
    };
    this.extractor = (resource) => {
      return lodash.get(resource, this.column);
    };
    this.injector = (resource, value) => {
      lodash.set(resource, this.column, value);

      return resource;
    };

    this.listable = true;
    
    this.fixed = (resource) => {
      return undefined;
    }
  }

  set (name, value) {
    this[name] = value

    return this
  }

  get (name) {
    return this[name];
  }
  
  /**
   * @param {Closure} callback
   *
   * @return this
   */
  setDefault (callback) {
    this.default = callback;

    return this;
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
   * @param {string} description
   *
   * @return this
   */
  setDescription (description) {
    this.description = description;

    return this;
  }

  /**
   * @return {string}
   */
  getDescription () {
    return this.description;
  }

  /**
   * @param {string} name
   *
   * @return this
   */
  setName (name) {
    this.name = name;

    return this;
  }

  /**
   * @return {string}
   */
  getName () {
    return this.name;
  }

  /**
   * @param {string} label
   *
   * @return this
   */
  setLabel (label) {
    this.label = label;

    return this;
  }

  /**
   * @return {string}
   */
  getLabel () {
    return this.label;
  }

  /**
   * @param {Callable} mutator
   *
   * @return this
   */
  setMutator (mutator) {
    this.mutator = mutator;

    return this;
  }

  /**
   * @return {Callable}
   */
  getMutator () {
    return this.mutator;
  }

  /**
   * @param {Callable} extractor
   *
   * @return this
   */
  setExtractor (extractor) {
    this.extractor = extractor;

    return this;
  }

  /**
   * @param {Callable} injector
   *
   * @return this
   */
  setInjector (injector) {
    this.injector = injector;

    return this;
  }

  /**
   * @return {Callable}
   */
  getExtractor () {
    return this.extractor;
  }

  /**
   * Extract value from resource
   *
   * @param {object} resource
   *
   * @return mixed
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
    return this.mutator(this.extractor(resource));
  }

  /**
   * Inject value from resource
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

    return this.injector(resource, value);
  }

  /**
   * @return {Callable}
   */
  load (resources) {
    return Promise.resolve(resources);
  }

  /**
   * @return {Callable}
   */
  persist (id, data) {
    return null;
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

  onUpdate(data) {

  }

  onRemove(data) {

  }
  onCreate(data) {

  }

  getClassName() {
    return 'BaseAttribute'
  }

}
