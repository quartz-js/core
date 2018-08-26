import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class EmailSenderApi extends ResourceApi {
	resource_url = '/admin/email-senders';

	/**
	 * Send email
	 *
	 * @param {int} id
	 * @param {Object} params
	 *
	 * @return {Promise}
	 */
	send (id, params) {
	  return Vue.http.post(this.getFullUrl() + '/' + id + '/send', params, { headers: { Authorization: 'Bearer ' + this.access_token }});
	}

	/**
	 * Render email
	 *
	 * @param {Object} params
	 *
	 * @return {Promise}
	 */
	render (params) {
	  return Vue.http.post(this.getFullUrl() + '/render', params, { headers: { Authorization: 'Bearer ' + this.access_token }});
	}
};
