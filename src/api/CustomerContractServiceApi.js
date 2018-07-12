import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class CustomerContractServiceApi extends ResourceApi {
resource_url = '/admin/contract-services';

constructor (params) {
  super();
  this.params = params;
}
};
