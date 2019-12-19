import { container } from '../Container';

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

  static parseRelationship (relationship, response) {
    return [].concat(response.body.data, response.body.included).find((include) => {
      return include.type === relationship.type && parseInt(include.id) === parseInt(relationship.id)
    })
  }

  static parseData (data, response) {

    if (!data) {
      return null
    }

    if (!data.id) {
      return data
    }

    if (data.relationships) {
      _.map(data.relationships, (relationships, key) => {
        if (!Array.isArray(relationships.data)) {
          if (typeof data.attributes[key] === 'undefined') {
            data.attributes[key] = Parser.parseData(Parser.parseRelationship(relationships.data, response), response);
          }
        } else {

          relationships.data.map((relationship, keyRelation) => {
            let val = Parser.parseData(Parser.parseRelationship(relationship, response), response);

            if (val !== null && typeof val === 'object') {
              if (typeof data.attributes[key] === 'undefined') {
                data.attributes[key] = [];
              }
              

              if (typeof data.attributes[key][keyRelation] === 'undefined') {
                data.attributes[key][keyRelation] = val;
              }
            }
          })
        }

      })
    }

    data = _.merge({id: data.id == parseInt(data.id) ? parseInt(data.id) : data.id}, data.attributes);

    return data;
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
    
    let data = _.clone(body.data)

    if (Array.isArray(body.data)) {
      for (let i in body.data) {
        data[i] = Parser.parseData(data[i], response);
      }
    } else if (_.isObject(body.data)) {
        data = Parser.parseData(data, response);
    }

    response.body = body;
    response.body.data = data

    return response;
  }
};
