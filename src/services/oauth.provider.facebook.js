import { OAuthProvider } from './oauth.provider';
import { container } from './container';

export class OAuthFacebookProvider extends OAuthProvider
{

	constructor()
	{
		super();
		this.url = "https://www.facebook.com/v2.9";

		this.enabled = process.env.FACEBOOK_OAUTH_ENABLED; 
		this.client_id = process.env.FACEBOOK_OAUTH_CLIENT_ID;
		this.client_secret = process.env.FACEBOOK_OAUTH_CLIENT_SECRET;
		this.redirect_uri = process.env.FACEBOOK_OAUTH_REDIRECT_URI;
	}

	getAuthorizeUrl()
	{
		return this.url+"/dialog/oauth"+this.obj_to_query({
			client_id: this.client_id,
			scope: 'email',
			redirect_uri: this.redirect_uri
		})
	}

	getParamsAccessToken(vars)
	{
		return {
			redirect_uri: this.redirect_uri,
			client_id: this.client_id,
			client_secret: this.client_secret,
			code: vars.code
		};
	}

}