import { OAuthProvider } from './oauth.provider';
import { container } from './container';

export class OAuthGithubProvider extends OAuthProvider {
  constructor () {
    super();
    this.url = 'https://github.com/login/oauth';

    this.enabled = process.env.GITHUB_OAUTH_ENABLED;
    this.client_id = process.env.GITHUB_OAUTH_CLIENT_ID;
    this.client_secret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
    this.redirect_uri = process.env.GITHUB_OAUTH_REDIRECT_URI;
  }

  getAuthorizeUrl () {
    return this.url + '/authorize' + this.obj_to_query({
      client_id: this.client_id,
      client_secret: this.client_secret,
      scope: 'user:email'
    })
  }

  getParamsAccessToken (vars) {
    return {
      url: 'https://github.com/login/oauth/access_token',
      client_id: this.client_id,
      client_secret: this.client_secret,
      code: vars.code
    };
  }
}
