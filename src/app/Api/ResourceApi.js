import { container } from '../Container';
import _ from 'lodash';
const axios = require('axios');


export class ResourceApi {
  constructor (language) {

    console.log('Creating...')
    this.http = axios.create({})

    this.params = {};
    this.filterQuery = function (query) {

      if (query) {
        query = query.replace(/\\/g, "\\\\");
      }

      return query;
    }

    this.http.interceptors.response.use((response) => {
      response.body = response.data
      return this.parse(response);
    }, (error) => {

      response.body = response.data
      return Promise.reject(error);
    });
  }

  url (url) {
    let parts = [
      container.get('config').app.api.url.replace(/\/$/, '')
    ]

    if (this.resource_url) {
      parts.push(this.resource_url.replace(/\/$/, '').replace(/^\//, ''))
    }

    if (url) {
      parts.push(url.replace(/\/$/, '').replace(/^\//, ''))
    }

    return parts.join("/");
  }

  setParams (params) {
    this.params = params;

    return this;
  }

  getFullParams (params) {
    return Object.assign({}, this.params, params);
  }

  setFilterQuery (filterQuery) {
    this.filterQuery = filterQuery;

    return this;
  }

  parseRelationship (relationship, response) {
    return response.body.included.find((include) => {
      return include.type === relationship.type && parseInt(include.id) === parseInt(relationship.id)
    })
  }

  parseData (data, response) {

    if (!data) {
      return null
    }
    
    if (!data.id) {
      return data
    }
    
    if (data.relationships) {
      _.map(data.relationships, (relationships, key) => {

        if (!Array.isArray(relationships.data)) {
          data.attributes[key] = this.parseData(this.parseRelationship(relationships.data, response), response);
        } else {
          relationships.data.map((relationship, keyRelation) => {
            let val = this.parseData(this.parseRelationship(relationship, response), response);

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
  parse (response) {

    var body = response.body;

    if (Array.isArray(body.data)) {
      for (let i in body.data) {
        body.data[i] = this.parseData(body.data[i], response);
      }
    } else if (_.isObject(body.data)) {
        body.data = this.parseData(body.data, response);
    }

    response.body = body;

    return response;
  }

  post (url, params, options) {
    return this.http.post(this.url(url), params instanceof FormData ? params : this.getFullParams(params), options)
      .then((response) => { 
        return this.parse(response) 
      });
  }

  get (url, options) {
    return this.http.get(this.url(url))
  }

  /**
   * Index
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  index (params) {
    console.log(params);
    console.log(this.http.headers)
    params.query = this.filterQuery(params.query);
    return this.get('', { params: this.getFullParams(params) })
  }

  /**
   * Store
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  store (params) {
    params.query = this.filterQuery(params.query);
    return this.http.put(this.url(), { params: this.getFullParams(params) })
  }

  /**
   * Create
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  create (params) {
    return this.post('', this.getFullParams(params))
  }

  /**
   * Index
   *
   * @param {int} id
   * @param {Object} params
   *
   * @return {Promise}
   */
  show (id, params) {
    return this.http.get(id, { params: this.getFullParams(params) })
  }

  /**
   * update
   *
   * @param {int} id
   * @param {Object} params
   *
   * @return {Promise}
   */
  update (id, params) {
    return this.http.put(this.url(id), this.getFullParams(params))
  }

  /**
   * Remove
   *
   * @param {int} id
   *
   * @return {Promise}
   */
  remove (id) {
    return this.http.delete(this.url(id));
  }

  /**
   * Erase
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  erase (params) {
    params.query = this.filterQuery(params.query);
    return this.http.delete(this.url(), { params: this.getFullParams(params)})
  }
};
