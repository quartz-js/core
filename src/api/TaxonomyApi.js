import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class TaxonomyApi extends ResourceApi {
	resource_url = '/admin/taxonomies';

	constructor (params) {
	  super();
	  this.params = params;
	}
};
