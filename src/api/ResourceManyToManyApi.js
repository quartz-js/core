import Vue from 'vue';
import { container } from '../services/container';
Vue.use(VueResource);

export class ResourceManyToManyApi {
  constructor () {
    this.url = container.get('config').API_URL;
    this.access_token = container.get('oauth').getToken();
  }

  getFullUrl (container_id, resource_id) {
    return this.url + this.resource_url;
  }

  /**
   * Index
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  index (params) {
    return Vue.http.get(this.getFullUrl(), { params: params, headers: { Authorization: 'Bearer ' + this.access_token }});
  }

  /**
   * Create
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  create (params) {
    // Create first container resource and than attatch
    return this.api.create(params).then(response => {
      return Vue.http.post(this.getFullUrl() + '/' + response.body.data.id, params, { headers: { Authorization: 'Bearer ' + this.access_token }}).then(response2 => {
        return response;
      });
    })
  }

  /**
   * update
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  update (id, params) {
    // Create first container resource and than attatch
    return this.api.update(id, params);
  }

  /**
   * Remove
   *
   * @param {int} id
   *
   * @return {Promise}
   */
  remove (id) {
    // Removing the entity will remove the relation
    return this.api.remove(id);
  }

  /**
   * show
   *
   * @param {int} id
   *
   * @return {Promise}
   */
  show (id) {
    // Removing the entity will remove the relation
    return this.api.show(id);
  }
};
