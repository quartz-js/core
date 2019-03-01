import { Base } from './Base'

import _ from 'lodash'

export class Matrix extends Base {

  constructor (name, api, structure, options) {
    super(name, options);

    this.structure = structure;
    this.api = api;
    this.query = (key) => {
      return "name ct '" + key + "'";
    };

    this.mutator = (values) => {
        return values ? this.getLabelByResource(values) : [];
    };
  
    this.preLoad = (resources) => {
      return Promise.resolve();
    }
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

  explode (arr) {
    if (arr.length <= 1) {
      return arr;
    }

    var result = [];

    for (let x = 0; x < arr[0].length; x++) {
      for (let y = 0; y < arr[1].length; y++) {
        result.push(_.merge({}, arr[0][x], arr[1][y]));
      }
    }
    result = [result]
    arr.splice(0, 2)

    for (let x = 0; x < arr.length; x ++) {
      result.push(arr[x])
    }

    return this.explode(result)
  }

  primaryKeys (resource) {
    var row = this.row(resource)[0];


    row = _.pickBy(row, field => {
      return !field.editable;
    })
    return Object.values(_.mapValues(row, (field, fieldKey) => {
      return fieldKey
    }))
  }

  row (resource) {
    return this.explode(_.clone(this.structure(resource)))[0]

    return row;
  }


  combineRow (row) {
    var value = {};

    _.mapValues(row, (field, fieldKey) => {
      value[fieldKey] = field.value ? field.value : null
    });

    return value;
  }

  combinedRow (resource) {
    var value = this.row(resource).map((row, rowKey) => {
      return this.combineRow(row);
    })

    return value;
  }

  subsetByPrimaryKeys(arr, resource) {

    arr = _.clone(arr)

    var ret = {};

    this.primaryKeys(resource).map(primaryKey => {
      ret[primaryKey] = arr[primaryKey]
    })

    return ret;

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

    return this.preLoad(resources).then(() => {

      if (ids.length === 0) {
        /*resources.map(resource => {
          resource[this.name]  = this.combinedRow(resource)          
        })*/
        return Promise.resolve(resources)
      }

      return this.api.index({query: this.searchQuery(ids), show: 999}).then(responseR => {

        resources.map(resource => {

          let value = this.combinedRow(resource)

          let apiValue = responseR.body.data.filter((b_resource) => { return this.comparatorByApi(b_resource, resource)});


          apiValue.map((resource) => {

            var index = value.findIndex(valueToFind => {
              var result = _.isEqual(this.subsetByPrimaryKeys(valueToFind, resource), this.subsetByPrimaryKeys(resource, resource)) === true


              return result;
            })

            if (index >= 0) {
              value[index] = resource
            }
          })

          resource[this.name] = value

          return resource;
        });

        return resources
      });
    })
  }

  getIndexByRow(row, resource)
  {
    row = this.subsetByPrimaryKeys(row, resource);

    return row.map((row, rowKey) => {
      return rowKey + "-" + row;
    }).join("_");
  }


  /**
   * @return {Callable}
   */
  persist (id, data) {

    var value = this.extractor(data)

    if (!value) {
      return
    }

    return this.api.index({query: this.searchQuery([id]), show: 999}).then(responseR => {
      
      var idsOriginal = responseR.body.data.map(resource => {
        return parseInt(resource.id)
      });
        
      var idsDefined = value.map(resource => {
        return parseInt(resource.id)
      }).filter(id => {
        return id != 0
      })

      var idsToRemove = idsOriginal.filter(rId => {
          return idsDefined.indexOf(rId) < 0;
      });

      var promises = data[this.name].map((resource) => {

        var params = _.merge(this.toAdd(id), resource);

        return resource.id ? this.api.update(resource.id, params) : this.api.create(params);
      });

      if (idsToRemove.length > 0) {
        promises.push(this.api.erase({
          query: this.searchQuery([id]) + `andid in (${idsToRemove.join(',')})`
        }));
      }

      return promises;
    })
  }
}
