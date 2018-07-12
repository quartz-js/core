import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class HttpLogApi extends ResourceApi {
resource_url = '/admin/http-logs';
};
