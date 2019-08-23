import { container } from '../Container';

export class Parser {
  static interceptors () {

    container.get('axios').interceptors.response.use((response) => {
      response.body = response.data
      return Parser.parse(response);
    }, (response) => {

      response.body = response.data
      return Promise.reject(response);
    });
  }


  static parseRelationship (relationship, response) {
    return response.body.included.find((include) => {
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
          data.attributes[key] = Parser.parseData(Parser.parseRelationship(relationships.data, response), response);
        } else {
          relationships.data.map((relationship, keyRelation) => {
            let val = Parser.parseData(Parser.parseRelationship(relationship, response), response);

            if (val !== null && typeof val === 'object') {
              data.attributes[key][keyRelation] = val;
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

    var body = response.body;

    if (Array.isArray(body.data)) {
      for (let i in body.data) {
        body.data[i] = Parser.parseData(body.data[i], response);
      }
    } else if (_.isObject(body.data)) {
        body.data = Parser.parseData(body.data, response);
    }

    response.body = body;

    return response;
  }
};
