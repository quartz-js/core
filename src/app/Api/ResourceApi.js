import { container } from '../Container';
import _ from 'lodash';

export class ResourceApi {

  constructor () {

    this.http = container.get('axios')

    this.params = {};
    this.filterQuery = function (query) {

      if (query) {
        query = query.replace(/\\/g, "\\\\");
      }

      return query;
    }
  }

  url (url) {
    url = `${url}`
    
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

  post (url, params, options) {
    return this.http.post(this.url(url), params instanceof FormData ? params : this.getFullParams(params), options)
  }

  put (url, params, options) {
    return this.http.put(this.url(url), params instanceof FormData ? params : this.getFullParams(params), options)
  }

  get (url, options) {
    return this.http.get(this.url(url), options)
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
    return this.get(id, { params: this.getFullParams(params) })
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
    return this.put(id, this.getFullParams(params))
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
    return this.http.delete(this.url(''), { params: this.getFullParams(params)})
  }
};
