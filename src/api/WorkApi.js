import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class WorkApi extends ResourceApi
{
	resource_url = "/admin/works";

	/**
	 * renderTemplate
	 *
	 * @param {Object} params
	 *
	 * @return {Promise}
	 */
	renderTemplate(params)
	{
		return Vue.http.post(this.getFullUrl() + "/render", params, { headers: { Authorization: "Bearer "+this.access_token }});
	}

};
