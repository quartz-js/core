import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class InvoiceItemApi extends ResourceApi
{
	resource_url = "/admin/invoice-items";

	constructor(params)
	{
		super();
		this.params = params;
	}
};
