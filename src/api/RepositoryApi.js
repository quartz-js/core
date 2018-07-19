import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class RepositoryApi extends ResourceApi {
	resource_url = '/admin/repositories';
};
