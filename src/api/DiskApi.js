import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class DiskApi extends ResourceApi {
resource_url = '/admin/disks';
};
