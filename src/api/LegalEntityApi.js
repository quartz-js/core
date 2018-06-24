import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class LegalEntityApi extends ResourceApi
{
	resource_url = "/admin/legal-entities";

};
