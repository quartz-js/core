import { BaseAttribute } from './BaseAttribute'

export class BelongsToAttribute extends BaseAttribute {
  constructor (name, api, options) {
    super(name, options);

    this.api = api;
    this.query = (key) => {
      return "name ct '" + key + "'";
    };
    this.mutator = (value) => {
        return value ? this.getLabelByResource(value) : null;
    };

    this.injector = (resource, value) => {
      resource[this.getRelationName()] = value ? value : null;
      resource[this.name] = value ? value.id : null;

      return resource;
    };

    this.default = () => {
      return { id: undefined };
    };

    this.extractor = resource => {
      return resource && typeof resource[this.getRelationName()] !== 'undefined' ? resource[this.getRelationName()] : null;
    };
  }
  addBeforeCreateHook () {
    this.addHook('BeforeCreate', (data) => {

      let finalValue = this.extractor(data.resource);

      if (!finalValue || !finalValue.id) {
        return this.resourceConfig().createResource(finalValue)
          .then(response => {

            data.resource[this.name] = response.body.data.id
            finalValue.id = response.body.data.id;

            return data
          })
      } else {
        return this.resourceConfig().updateResource(finalValue.id, finalValue)
          .then(response => {

            data.resource[this.name] = response.body.data.id
            finalValue.id = response.body.data.id;

            return data
          })
      }
    });

    return this;
  }

  getRelationName () {
    return this.name + '_relation';
  }

  injectDefault (data) {
    let def = this.getDefault()

    if (JSON.stringify(this.resourceConfig()) === JSON.stringify(this.manager())) {
      return
    }

    this.resourceConfig().injectDefault(def)

    this.injectValue(data, def)
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
   * @param {string} name
   *
   * @return this
   */
  setApi (api) {
    this.api = api;

    return this;
  }

  /**
   * @return {string}
   */
  getApi () {
    return this.api;
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
   * @return {string}
   */
  getQuery () {
    return this.query;
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

  getLabelByResource (resource) {
    return resource.name;
  }

  /**
   * @return {Callable}
   */
  load (resources) {
    var ids = resources.filter(resource => { 
      return resource[this.column]; 
    }).filter(resource => {
      let val = this.extractValue(resource)

      return !val || !val.id || resource[this.column] !== val.id

    }).map(resource => { return resource[this.column] });


    if (ids.length === 0) {
      return Promise.resolve(resources)
    }

    return this.api.index({query: ids ? 'id in (' + ids.join(',') + ')' : '', show: 999}).then(responseR => {
      return Promise.resolve(resources.map(resource => {
        resource[this.getRelationName()] = responseR.body.data.find(b_resource => { return b_resource.id == resource[this.column] });
        return resource;
      }))
    });
  }
}
