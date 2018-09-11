import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class UserApi extends ResourceApi {
  resource_url = '/admin/users';
};
