import { BaseAttribute } from './BaseAttribute'

export class SelectAttribute extends BaseAttribute 
{

	constructor(name)
	{	
		super(name);
	}

	/**
	 * @param {array} options
	 *
	 * @return this
	 */
	setOptions(options)
	{
		this.options = options;

		return this;
	}

	/**
	 * @return {string}
	 */
	getOptions()
	{
		return this.options;
	}

}