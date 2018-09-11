import Vue from 'vue';
import VueResource from 'vue-resource';
import { container } from '../services/container';

Vue.use(VueResource);

export class AccountApi {
  constructor () {
    this.resource_url = '/admin/users';
    this.url = process.env.API_URL;
    this.access_token = container.get('services.oauth') ? container.get('services.oauth').getToken() : null;
  }

  getFullUrl () {
    return this.url + this.resource_url;
  }

  /**
   * Sign in
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  signIn (params) {
    return Vue.http.post(this.url + '/auth', params);
  }

  /**
   * Request the provider access_token from code
   *
   * @param {string} provider_name
   * @param {Object} params
   *
   * @return {Promise}
   */
  oauthProviderRequestToken (provider_name, params) {
    return Vue.http.post(this.url + '/oauth/' + provider_name + '/access_token', params).then(response => {
      params.access_token = response.body.data.access_token;
      return this.oauthProviderExchangeToken(provider_name, params);
    });
  }

  /**
   * Convert an external access_token to internal access_token
   *
   * @param {string} provider_name
   * @param {Object} params
   *
   * @return {Promise}
   */
  oauthProviderExchangeToken (provider_name, params) {
    return Vue.http.post(this.url + '/oauth/' + provider_name + '/exchange_token', params);
  }

  /**
   * Sign up
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  signUp (params) {
    return Vue.http.post(this.url + '/sign-up', params);
  }

  /**
   * Get user
   *
   * @param {String} access_token
   *
   * @return {Promise}
   */
  getUser (access_token) {
    return Vue.http.get(this.url + '/account', { headers: {
      Authorization: 'Bearer ' + access_token
    }});
  }

  /**
   * Confirm email
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  confirmEmail (params) {
    return Vue.http.post(this.url + '/confirm-email', params);
  }

  /**
   * Request a confirmation email
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  requestConfirmEmail (params) {
    return Vue.http.post(this.url + '/request-confirm-email', params);
  }

  /**
   * Change password
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  changePassword (params) {
    return Vue.http.post(this.url + '/account/password', params, { headers: { Authorization: 'Bearer ' + this.access_token }});
  }

  /**
   * Delete account
   *
   * @params {Object} params
   *
   * @return {Promises}
   */
  deleteAccount (params) {
    return Vue.http.delete(this.url + '/account', { body: params, headers: { Authorization: 'Bearer ' + this.access_token }});
  }

  /**
   * Change email
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  changeEmail (params) {
    return Vue.http.post(this.url + '/account/email', params, { headers: { Authorization: 'Bearer ' + this.access_token }});
  }

  /**
   * Change username
   *
   * @param {Object} params
   *
   * @return {Promise}
   */
  changeUsername (params) {
    return Vue.http.post(this.url + '/account/username', params, { headers: { Authorization: 'Bearer ' + this.access_token }});
  }
 
};
