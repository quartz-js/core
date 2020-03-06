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
   * Persist
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  persist (query, params) {
    return this.http.post(
      this.url(''),
      this.getFullParams(params),
      { 
        params: {
          query: this.filterQuery(query)
        }
      }
    )
  }

  /**
   * Store
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  store (query, params) {
    return this.http.put(
      this.url(''),
      this.getFullParams(params),
      { 
        params: {
          query: this.filterQuery(query)
        }
      }
    )
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
   * Erase
   *
   * @param {string} query
   *
   * @return {Promise}
   */
  erase (query) {
    return this.http.delete(this.url(''), { params: {query: this.filterQuery(query) }})
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
    return this.store(`id eq ${id}`, params)
  }

  /**
   * Remove
   *
   * @param {int} id
   *
   * @return {Promise}
   */
  remove (id) {
    return this.erase(`id eq ${id}`)
  }
};
