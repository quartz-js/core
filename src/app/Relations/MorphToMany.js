import { Base } from './Base'

export class MorphToMany extends Base {

  constructor (name, indexerApi, storageApi, options) {
    super(name, options);

    this.indexerApi = indexerApi;
    this.storageApi = storageApi;

    this.injector = (resource, values) => {
      resource[this.column] = values;

      return resource;
    };

    this.extractor = resource => {
      return resource && typeof resource[this.column] !== 'undefined' ? resource[this.column] : [];
    };
  }

  /**
   * @return {Callable}
   */
  persist (id, data) {
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
  }

  getClassName() {
    return 'MorphToMany'
  }
}
