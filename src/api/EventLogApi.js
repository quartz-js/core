import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class EventLogApi extends ResourceApi {
resource_url = '/admin/event-logs';

/**
* stats
*
* @param {Object} params
*
* @return {Promise}
*/
stats (params) {
  return Vue.http.get(this.getFullUrl() + '/stats', { params: params, headers: { Authorization: 'Bearer ' + this.access_token }});
}
};
