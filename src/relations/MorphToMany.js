import { Base } from './Base'

export class MorphToMany extends Base {

  constructor (name, indexerApi, storageApi, options) {
    super(name, options);

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
   * @return {Callable}
   */
  load (resources) {

    var ids = this.getIdsNotBootedFromResources(resources)

    if (ids.length === 0) {
      // return Promise.resolve(resources);
    }

    ids = resources.map(resource => { return resource.id});

    return this.storageApi.index({
      query: `${this.morphTypeColumn} = '${this.morphTypeValue}' and ${this.morphKeyColumn} in (${ids.join(',')})`, 
      show: 999,
      include: `${this.relationName}`
    }).then(responseR => {
      
      return Promise.resolve(resources.map(resource => {

        let values = responseR.body.data.filter(r => {
          return parseInt(r[this.morphKeyColumn]) === parseInt(resource.id)
        }).map(r => {
          return r[this.relationName]
        });

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
      query: `${this.morphTypeColumn} = '${this.morphTypeValue}' and ${this.morphKeyColumn} eq ${id}`, 
      show: 999
    }).then(responseR => {
      
      var idsOriginal = responseR.body.data.map(resource => {
        return parseInt(resource[this.relationId])
      });
      
      var idsDefined = typeof data[this.name] !== "undefined" && data[this.name] ? data[this.name].map(resource => {
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

        params[this.morphTypeColumn] = this.morphTypeValue
        params[this.morphKeyColumn] = id
        params[this.relationId] = resourceId

        return this.storageApi.create(params);
      });

      if (idsToRemove.length > 0) {
        promises.push(this.storageApi.erase({
          query: `${this.morphTypeColumn} = '${this.morphTypeValue}' and ${this.morphKeyColumn} eq ${id} and ${this.relationId} in (${idsToRemove.join(',')})`
        }));
      }

      return Promise.all(promises);
    });
  }

  getClassName() {
    return 'MorphToMany'
  }
}
