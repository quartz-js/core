import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class CustomerContractApi extends ResourceApi {
resource_url = '/admin/contracts';

constructor (params) {
  super();
  this.params = params;
}
};
