import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class InvoiceApi extends ResourceApi
{
	resource_url = "/admin/invoices";


	/**
	 * Issue
	 *
	 * @param {int} id
	 *
	 * @return {Promise}
	 */
	issue(id)
	{
		return Vue.http.post(this.getFullUrl()+"/"+id+"/issue", { headers: { Authorization: "Bearer "+this.access_token }});
	}

};
