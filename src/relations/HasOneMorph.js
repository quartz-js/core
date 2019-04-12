import { MorphThrough } from './MorphThrough'

export class HasOneMorph extends MorphThrough {

  constructor (name, api, component, morphName, morphType, options) {
    super(name, options);

    this.morphName = morphName;
    this.morphType = morphType;
    this.indexerApi = api;
    this.storageApi = api;
    this.component = component
    this.relationManager = component.relationManager

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
      return resource && typeof resource[this.name] !== 'undefined' ? resource[this.name] : null;
    };
  }

  getLabelByResource (resource) {
    return resource;
  }


  /**
   * @return {Callable}
   */
  load (resources) {

    var ids = resources.filter(resource => { 
      return resource.id && !resource.__booted; 
    }).map(resource => { 
      return resource.id 
    });

    if (ids.length === 0) {
      return Promise.resolve(resources);
    }
    
    return this.storageApi.index({
      query: `${this.morphName}_type = '${this.morphType}' and ${this.morphName}_id in (${ids.join(',')})`, 
      show: 999,
    }).then(responseR => {
      
      return Promise.resolve(resources.map(resource => {

        var values = responseR.body.data.filter(b_resource => { 
          return b_resource[`${this.morphName}_id`] == resource.id 
        }).map(b_resource => {
          return b_resource;
        })

        values = values.length > 0 ? values[0] : null

        this.injectValue(resource, values);

        return resource;
      }))
    });
  }



  /**
   * @return {Callable}
   */
  persist (id, data) {

    return this.storageApi.index({
      query: `${this.morphName}_type = '${this.morphType}' and ${this.morphName}_id eq ${id}`, 
      show: 1
    }).then(responseR => {
      
      let params = this.extractValue(data)

      params[`${this.morphName}_type`] = this.morphType
      params[`${this.morphName}_id`] = id

      if (responseR.body.data.length === 0) {
        return this.storageApi.create(params);
      } else {
        return this.storageApi.update(responseR.body.data[0].id, params);
      }

    });
  }
}
