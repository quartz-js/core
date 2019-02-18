import { Base } from './Base'

export class MorphThrough extends Base {

  constructor (name, indexerApi, storageApi, morphName, morphType, options) {
    super(name, options);

    this.morphName = morphName;
    this.morphType = morphType;
    this.indexerApi = indexerApi;
    this.storageApi = storageApi;

    this.query = (key) => {
      return "name ct '" + key + "'";
    };

    this.mutator = (value) => {
        return value ? this.getLabelByResource(value) : null;
    };

    this.injector = (resource, values) => {
      resource[this.name] = values;

      return resource;
    };

    this.extractor = resource => {
      return resource && typeof resource[this.name] !== 'undefined' ? resource[this.name] : [];
    };
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

    var ids = resources.map(resource => { return resource.id });

    return this.storageApi.index({
      query: ids.length > 0 ? `${this.morphName}_type = '${this.morphType}' and ${this.morphName}_id in (${ids.join(',')})` : '', 
      show: 999,
      include: `${this.name}`
    }).then(responseR => {
      return resources.map(resource => {

        var values = responseR.body.data.filter(b_resource => { 
          return b_resource[`${this.morphName}_id`] == resource.id 
        }).map(b_resource => {
          var includedResource = responseR.body.included.find(includedResource => {
            return includedResource.id == b_resource[`${this.name}_id`]
          })

          includedResource.attributes.id = includedResource.id;
          return includedResource.attributes;
        })

        
        this.injectValue(resource, values);

        return resource;
      });
    });
  }



  /**
   * @return {Callable}
   */
  persist (id, data) {

    this.storageApi.index({
      query: `${this.morphName}_type = '${this.morphType}' and ${this.morphName}_id eq ${id}`, 
      show: 999
    }).then(responseR => {
      
      var idsOriginal = responseR.body.data.map(resource => {
        return parseInt(resource[`${this.name}_id`])
      });
        
      var idsDefined = typeof data[this.name] !== "undefined" ? data[this.name].map(resource => {
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

        params[`${this.morphName}_type`] = this.morphType
        params[`${this.morphName}_id`] = id
        params[`${this.name}_id`] = resourceId

        return this.storageApi.create(params);
      });

      if (idsToRemove.length > 0) {
        promises.push(this.storageApi.erase({
          query: `${this.morphName}_type = '${this.morphType}' and ${this.morphName}_id eq ${id} and ${this.name}_id in (${idsToRemove.join(',')})`
        }));
      }

      return Promise.all(promises);
    });
  }
}
