import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class CustomPageApi extends ResourceApi {
	resource_url = '/admin/custom-pages';
};
