import { OAuthProvider } from './oauth.provider';
import { container } from './container';

export class OAuthGoogleProvider extends OAuthProvider {
  constructor () {
    super();

    this.url = 'https://accounts.google.com/o/oauth2/v2';

    this.enabled = process.env.GOOGLE_OAUTH_ENABLED;
    this.client_id = process.env.GOOGLE_OAUTH_CLIENT_ID;
    this.client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    this.redirect_uri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  }

  getAuthorizeUrl () {
    return this.url + '/auth' + this.obj_to_query({
      client_id: this.client_id,
      scope: 'https://www.googleapis.com/auth/userinfo.email',
      redirect_uri: this.redirect_uri,
      response_type: 'token'
    })
  }

  getParamsAccessToken (vars) {
    var token = null;

    try {
      token = window.location.hash.split('&').map(function (v) { return v.split('='); });
      token = token[0][1];
    } catch (e) {

    }

    return {
      access_token: token,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri
    };
  }
}
