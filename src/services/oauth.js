
import { OAuthGithubProvider } from './oauth.provider.github';
import { OAuthGitlabProvider } from './oauth.provider.gitlab';
import { OAuthGoogleProvider } from './oauth.provider.google';
import { OAuthFacebookProvider } from './oauth.provider.facebook';

import { container } from './container';
import { UserApi } from '../api/UserApi';

export class OAuth
{

	constructor()
	{
		this.api = new UserApi();
	}

	/**
	 * Sign in
	 *
	 * @param {User} user
	 *
	 * @return {Observable}
	 */
	providerSignIn(provider, vars)
	{


		provider = this.getProviderByName(provider);


		window.location.href = provider.getAuthorizeUrl();

	}

	setCookieToken(token)
	{
		container.get('services.cookies').set('token', token);
	}

	getToken()
	{
		return container.get('services.cookies').get('token');
	}
	
	providerSignInCode(provider_name, params)
	{

		var provider = this.getProviderByName(provider_name);
		var params = provider.getParamsAccessToken(params);

		return !params.access_token 
			? this.api.oauthProviderRequestToken(provider_name, params).then(response => {
				this.setCookieToken(response.body.access_token);
			}) 
			: this.api.oauthProviderExchangeToken(provider_name, params).then(response => {
				this.setCookieToken(response.body.access_token);
			});


	}

	signIn(params)
	{
		return this.api.signIn(params).then(response => {
			this.setCookieToken(response.body.data.access_token);
		});
	}

	signUp(params)
	{
		return this.api.signUp(params);
	}

	authenticate(vars)
	{
		var access_token = container.get('services.cookies').get('token');

        return this.api.getUser(access_token).then(response => {
        	return response;
        })
	}


	getProviderByName(provider)
	{	
		
		var providers = {
			github: new OAuthGithubProvider(),
			gitlab: new OAuthGitlabProvider(),
			google: new OAuthGoogleProvider(),
			facebook: new OAuthFacebookProvider(),
		};

		return typeof providers[provider] !== "undefined" ? providers[provider] : null;
	}

	getUser(vars)
	{
		var access_token = container.get('services.cookies').get('token');

        return this.api.getUser(access_token);
	}

	confirmEmail(params)
	{
		return this.api.confirmEmail(params).then(response => {
			this.setCookieToken(response.body.access_token);
		});
	}

	requestConfirmEmail(params)
	{
		return this.api.requestConfirmEmail(params);
	}

	logout()
	{
		container.get('services.cookies').remove('token');
	}
	
}