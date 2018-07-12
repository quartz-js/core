import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
import { LegalEntityApi } from './LegalEntityApi'
Vue.use(VueResource);

export class CustomerApi extends ResourceApi {
resource_url = '/admin/customers';

/**
* Create
*
* @param {Object} params
*
* @return {Promise}
*/
create (params) {
  return new LegalEntityApi().create({name: params.name}).then(response2 => {
    params.legal_entity_id = response2.body.resource.id;
    return Vue.http.post(this.getFullUrl(), this.getFullParams(params), { headers: { Authorization: 'Bearer ' + this.access_token }}).catch(response => {
      new LegalEntityApi().delete(response2.resource.id);
    })
  });
}
};
