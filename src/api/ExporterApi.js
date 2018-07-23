import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class ExporterApi extends ResourceApi {
	resource_url = '/admin/exporters';

	/**
	 * renderTemplate
	 *
	 * @param {int} id
	 * @param {Object} params
	 *
	 * @return {Promise}
	 */
	generate (id, params) {
	  return Vue.http.post(this.getFullUrl() + '/' + id + '/generate', params, { headers: { Authorization: 'Bearer ' + this.access_token }});
	}
};
