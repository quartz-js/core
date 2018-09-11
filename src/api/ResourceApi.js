import Vue from 'vue';
import VueResource from 'vue-resource';
import { container } from '../services/container';
Vue.use(VueResource);

export class ResourceApi {
  constructor () {
    this.url = process.env.API_URL;
    this.access_token = container.get('services.oauth') ? container.get('services.oauth').getToken() : null;
    this.params = {};
    this.filterQuery = function (query) {
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
    return Object.assign(this.params, params);
  }

  setFilterQuery (filterQuery) {
    this.filterQuery = filterQuery;

    return this;
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
        for (var i in body.data) {
          body.data[i] = _.merge({id: body.data[i].id}, body.data[i].attributes);
        }
      } else if (_.isObject(body.data)) {
          body.data = _.merge({id: body.data.id}, body.data.attributes);
      }

      response.body = body;

      return response;
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
    return Vue.http.get(this.getFullUrl(), { params: this.getFullParams(params), headers: { Authorization: 'Bearer ' + this.access_token }}).then(this.parse);
  }

  /**
   * Create
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  create (params) {
    return Vue.http.post(this.getFullUrl(), this.getFullParams(params), { headers: { Authorization: 'Bearer ' + this.access_token }}).then(this.parse);
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
    return Vue.http.get(this.getFullUrl() + '/' + id, { params: this.getFullParams(params), headers: { Authorization: 'Bearer ' + this.access_token }}).then(this.parse);
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
    return Vue.http.put(this.getFullUrl() + '/' + id, this.getFullParams(params), { headers: { Authorization: 'Bearer ' + this.access_token }}).then(this.parse);
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
};
