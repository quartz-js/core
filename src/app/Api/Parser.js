import { container } from '../Container';
import { RawResource } from './RawResource'
var util = require('util')

export class Parser {
  static interceptors () {

    container.get('axios').interceptors.response.use((response) => {
      response.body = response.data
      return Parser.parse(response);
    }, (error) => {
      if (error.response) {
        error.response.body = error.response.data
        return Promise.reject(error.response);
      } else {
        throw error
      }
    });
  }

  static parseData (resources, response) {

    if (!resources) {
      return null
    }


    let objects = [].concat(resources, response.body.included || [] ).map(obj => {
      return new RawResource(obj)
    })

    objects.map((data, keyData) => {

      if (data.relationships) {
        _.map(data.relationships, (relationships, key) => {

          if (!Array.isArray(relationships.data)) {
            if (typeof data.attributes[key] === 'undefined') {
              data.attributes[key] = objects.find(i => i.type === relationships.data.type && i.id == relationships.data.id)
            }
          } else {

            relationships.data.map((relationship, keyRelation) => {

              let val = objects.find(i => i.type === relationship.type && i.id == relationship.id)

              if (val !== null && typeof val === 'object') {
                if (typeof data.attributes[key] === 'undefined') {
                  objects[keyData].attributes[key] = [];
                }

                if (typeof data.attributes[key][keyRelation] === 'undefined') {
                  objects[keyData].attributes[key][keyRelation] = val;
                }
              }
            })
          }

        })
      }
    })
    
    objects.map(data => {
      data.convert()
    })

    return resources.map(data => {
      return objects.find(i => i.getType() === data.type && i.id == data.id)
    })
  }

  /**
   * Parse
   *
   * @param response
   *
   * @return Promise
   */
  static parse (response) {

    let body = response.body;

    if (typeof body !== 'object' || typeof body.data === 'undefined') {
      return response
    }
    
    if (body.data && Array.isArray(body.data)) {
      let data = _.clone(body.data)

      data = Parser.parseData(data, response);

      response.body = body;
      response.body.data = data
    }

    return response;
  }
};
