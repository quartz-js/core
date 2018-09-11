import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class FileApi extends ResourceApi {
resource_url = '/admin/files';

  /**
   * Upload
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
upload (params, progress) {
  return Vue.http.post(this.getFullUrl() + '/upload', params, {
    progress (e) {
      progress(e);
    },
    headers: { Authorization: 'Bearer ' + this.access_token }
  });
}
};
