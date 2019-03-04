import lodash from 'lodash';
var clone = require('clone');

export class BaseAttribute {
  constructor (name, options) {

    this.hooks = [];
    this.name = name;
    this.label = name;
    this.column = name;
    this.priority = 1;
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
  
  /**
   * @param {Closure} callback
   *
   * @return this
   */
  setDefault (callback) {
    this.default = callback;

    return this;
  }

  injectDefault (data) {
    this.injectValue(data, this.getDefault())
  }


  /**
   * @return {Closure}
   */
  getDefault () {
    var d = this.default;

    return d();
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

}
