import { BaseAttribute } from './BaseAttribute'

export class SelectAttribute extends BaseAttribute 
{

	constructor(name)
	{	
		super(name);

		var self = this;

		this.extractor = (resource => {
			var value = resource[this.name];

			var option = this.getOptionByValue(value);

			return option;
		});


		this.injector = function(resource, value) {
			resource[self.name] = value;

			return resource;
		};
		
		this.mutator = function(value) {

			return value ? value.label : null;
		};
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

	getOptionByValue(value) {
		return this.options.find(function(option) {
			return option.value === value;
		});
	}

}