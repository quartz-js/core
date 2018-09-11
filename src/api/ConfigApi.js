import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class ConfigApi extends ResourceApi {
resource_url = '/admin/configs';

  /**
   * Patch
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
patch (params) {
  return Vue.http.patch(this.getFullUrl(), params, { headers: { Authorization: 'Bearer ' + this.access_token }});
}
};
