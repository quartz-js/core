import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class FileGeneratorApi extends ResourceApi {
	resource_url = '/admin/file-generators';

	/**
	 * Generate file
	 *
	 * @param {int} id
	 * @param {Object} params
	 *
	 * @return {Promise}
	 */
	generate (id, params) {
	  return Vue.http.post(this.getFullUrl() + '/' + id + '/generate', params, { headers: { Authorization: 'Bearer ' + this.access_token }});
	}

	/**
	 * Render file
	 *
	 * @param {Object} params
	 *
	 * @return {Promise}
	 */
	render (params) {
	  return Vue.http.post(this.getFullUrl() + '/render', params, { headers: { Authorization: 'Bearer ' + this.access_token }});
	}
};
