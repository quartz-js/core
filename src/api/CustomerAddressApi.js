import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceManyToManyApi } from './ResourceManyToManyApi'
import { AddressApi } from './AddressApi'
Vue.use(VueResource);

export class CustomerAddressApi extends ResourceManyToManyApi 
{
	resource_url = "/admin/customers/@container_id/addresses";


	constructor(container_id)
	{
		super();
		this.api = new AddressApi();
		this.resource_url = this.resource_url.replace("@container_id", container_id);
	}


};
