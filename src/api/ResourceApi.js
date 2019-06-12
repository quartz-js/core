import Vue from 'vue';
import { container } from '../services/container';
import _ from 'lodash';

import VueResource from 'vue-resource'
Vue.use(VueResource);

export class ResourceApi {
  constructor (language) {
    this.url = container.get('config').app.api.url;
    this.access_token = container.get('oauth').getToken();
    this.params = {};
    this.filterQuery = function (query) {

      if (query) {
        query = query.replace(/\\/g, "\\\\");
      }

      return query;
    }

    this.headers = {
      "Authorization": 'Bearer ' + this.access_token,
      "Accept-Language": language
    };
  }

  setParams (params) {
    this.params = params;

    return this;
  }

  getFullUrl () {
    return this.url + this.resource_url;
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
    return Vue.http.post(this.getFullUrl() + url, params instanceof FormData ? params : this.getFullParams(params), _.merge({ headers: this.headers }, options))
      .then((response) => { 
        return this.parse(response) 
      });
  }

  get (url, options) {
    return Vue.http.get(url, options)
  }

  /**
   * Index
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  index (params) {
    params.query = this.filterQuery(params.query);
    return Vue.http.get(this.getFullUrl(), { params: this.getFullParams(params), headers: this.headers}).then((response) => { return this.parse(response) });
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
    return Vue.http.put(this.getFullUrl(), { params: this.getFullParams(params), headers: this.headers}).then((response) => { return this.parse(response) });
  }

  /**
   * Create
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  create (params) {
    return Vue.http.post(this.getFullUrl(), this.getFullParams(params), { headers: this.headers }).then((response) => { return this.parse(response) });
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
    return Vue.http.get(this.getFullUrl() + '/' + id, { params: this.getFullParams(params), headers: this.headers}).then((response) => { return this.parse(response) });
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
    return Vue.http.put(this.getFullUrl() + '/' + id, this.getFullParams(params), { headers: this.headers}).then((response) => { return this.parse(response) });
  }

  /**
   * Remove
   *
   * @param {int} id
   *
   * @return {Promise}
   */
  remove (id) {
    return Vue.http.delete(this.getFullUrl() + '/' + id, { headers: this.headers});
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
    return Vue.http.delete(this.getFullUrl(), { params: this.getFullParams(params), headers: this.headers}).then((response) => { return this.parse(response) });
  }
};
