import _ from 'lodash';

export class BaseAttribute {
  constructor (name, options) {

    this.name = name;
    this.label = name;
    this.column = name;
    this.default = () => {
      return undefined;
    };

    if (options && options.column) {
      this.column = options.column;
    }

    this.mutator = (value) => {
      return value;
    };
    this.extractor = (resource) => {
      return _.get(resource, this.column);
    };
    this.injector = (resource, value) => {
      _.set(resource, this.column, value);

      return resource;
    };

    this.fixed = (resource) => {
      
    }
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

  /**
   * @return {Closure}
   */
  getDefault () {
    var d = this.default;

    return d();
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
    return this.injector(resource, value);
  }

  /**
   * @return {Callable}
   */
  load (resources) {
    return null;
  }


}
