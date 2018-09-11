import Vue from 'vue';
import VueResource from 'vue-resource';
import { ResourceApi } from './ResourceApi'
Vue.use(VueResource);

export class NotificationApi extends ResourceApi {
resource_url = '/notifications';

/**
   * Index
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
index (params) {
  return Vue.http.get(this.getFullUrl(), { params: params, headers: { Authorization: 'Bearer ' + this.access_token }});
}

/**
   * Index
   *
   * @param {int} id
   * @param {Object} params
   *
   * @return {Promise}
   */
show (id, params) {
  return Vue.http.get(this.getFullUrl() + '/' + id, { params: params, headers: { Authorization: 'Bearer ' + this.access_token }});
}

/**
   * Mark as read
   *
   * @param {int} id
   *
   * @return {Promise}
   */
markAsRead (id) {
  return Vue.http.post(this.getFullUrl() + '/' + id + '/read', {}, { headers: { Authorization: 'Bearer ' + this.access_token }});
}

/**
   * Mark as read
   *
   * @param {int} id
   *
   * @return {Promise}
   */
markAsUnread (id) {
  return Vue.http.post(this.getFullUrl() + '/' + id + '/unread', {}, { headers: { Authorization: 'Bearer ' + this.access_token }});
}
};
