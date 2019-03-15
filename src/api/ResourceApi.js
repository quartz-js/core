import Vue from 'vue';
import { container } from '../services/container';
import _ from 'lodash';

import VueResource from 'vue-resource'
Vue.use(VueResource);

export class ResourceApi {
  constructor () {
    this.url = container.get('config').app.api.url;
    this.access_token = container.get('oauth').getToken();
    this.params = {};
    this.filterQuery = function (query) {

      if (query) {
        query = query.replace(/\\/g, "\\\\");
      }

      return query;
    }
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

  parseData (data, response) {

    if (data.relationships) {
      _.map(data.relationships, (relationship) => {

        data.attributes[relationship.data.type] = this.parseData(response.body.included.find((include) => {
          return include.type === relationship.data.type && include.id === relationship.data.id
        }), response);
      })
    }

    data = _.merge({id: data.id}, data.attributes);

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

  post (url, body, options) {
    return Vue.http.post(url, body, options)
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
    return Vue.http.get(this.getFullUrl(), { params: this.getFullParams(params), headers: { Authorization: 'Bearer ' + this.access_token }}).then((response) => { return this.parse(response) });
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
    return Vue.http.put(this.getFullUrl(), { params: this.getFullParams(params), headers: { Authorization: 'Bearer ' + this.access_token }}).then((response) => { return this.parse(response) });
  }

  /**
   * Create
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  create (params) {
    return Vue.http.post(this.getFullUrl(), this.getFullParams(params), { headers: { Authorization: 'Bearer ' + this.access_token }}).then((response) => { return this.parse(response) });
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
    return Vue.http.get(this.getFullUrl() + '/' + id, { params: this.getFullParams(params), headers: { Authorization: 'Bearer ' + this.access_token }}).then((response) => { return this.parse(response) });
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
    return Vue.http.put(this.getFullUrl() + '/' + id, this.getFullParams(params), { headers: { Authorization: 'Bearer ' + this.access_token }}).then((response) => { return this.parse(response) });
  }

  /**
   * Remove
   *
   * @param {int} id
   *
   * @return {Promise}
   */
  remove (id) {
    return Vue.http.delete(this.getFullUrl() + '/' + id, { headers: { Authorization: 'Bearer ' + this.access_token }});
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
    return Vue.http.delete(this.getFullUrl(), { params: this.getFullParams(params), headers: { Authorization: 'Bearer ' + this.access_token }}).then((response) => { return this.parse(response) });
  }
};
