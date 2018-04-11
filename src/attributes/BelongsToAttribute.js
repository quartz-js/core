import { BaseAttribute } from './BaseAttribute'

export class BelongsToAttribute extends BaseAttribute 
{

	constructor(name, api)
	{	
		super(name);
		this.api = api;
		this.query = function(key) { 
			return "name ct '"+key+"'";
		};
	}

	/**
	 * @param {string} name
	 *
	 * @return this
	 */
	setApi(api)
	{
		this.api = api;

		return this;
	}

	/**
	 * @return {string}
	 */
	getApi()
	{
		return this.api;
	}

	/**
	 * @param {callable} query
	 *
	 * @return this
	 */
	setQuery(query)
	{
		this.query = query;

		return this;
	}

	/**
	 * @return {string}
	 */
	getQuery()
	{
		return this.query;
	}

	/**
	 * @param {string} key
	 *
	 * @return this
	 */
	executeQuery(key)
	{
		return this.query(key);
	}

	getLabelByResource(resource)
	{
		return resource.name;
	}


}