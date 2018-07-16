import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class WorkApi extends ResourceApi {
	resource_url = '/admin/works';
};
