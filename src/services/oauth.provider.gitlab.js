import { OAuthProvider } from './oauth.provider';
import { container } from './container';

export class OAuthGitlabProvider extends OAuthProvider {
  constructor () {
    super();
    this.url = 'https://gitlab.com/oauth';

    this.enabled = process.env.GITLAB_OAUTH_ENABLED;
    this.client_id = process.env.GITLAB_OAUTH_CLIENT_ID;
    this.client_secret = process.env.GITLAB_OAUTH_CLIENT_SECRET;
    this.redirect_uri = process.env.GITLAB_OAUTH_REDIRECT_URI;
  }

  getAuthorizeUrl () {
    return this.url + '/authorize' + this.obj_to_query({
      client_id: this.client_id,
      response_type: 'code',
      redirect_uri: this.redirect_uri,
      scope: 'read_user'
    })
  }

  getParamsAccessToken (vars) {
    return {
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri,
      code: vars.code
    };
  }
}
