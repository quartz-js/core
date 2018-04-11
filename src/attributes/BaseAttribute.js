export class BaseAttribute {

	constructor(name)
	{	
		var self = this;

		this.name = name;
		this.label = name;
		this.mutator = function(value) {
			return value;
		};
		this.extractor = function(resource) {
			return resource[self.name];
		};
	}

	/**
	 * @param {string} name
	 *
	 * @return this
	 */
	setName(name)
	{
		this.name = name;

		return this;
	}

	/**
	 * @return {string}
	 */
	getName()
	{
		return this.name;
	}

	/**
	 * @param {string} label
	 *
	 * @return this
	 */
	setLabel(label)
	{
		this.label = label;

		return this;
	}

	/**
	 * @return {string}
	 */
	getLabel()
	{
		return this.label;
	}

	/**
	 * @param {Callable} mutator
	 *
	 * @return this
	 */
	setMutator(mutator)
	{
		this.mutator = mutator;

		return this;
	}

	/**
	 * @return {Callable}
	 */
	getMutator()
	{
		return this.mutator;
	}

	/**
	 * @param {Callable} extractor
	 *
	 * @return this
	 */
	setExtractor(extractor)
	{
		this.extractor = extractor;

		return this;
	}

	/**
	 * @return {Callable}
	 */
	getExtractor()
	{
		return this.extractor;
	}

	/**
	 * Extract value from resource
	 *
	 * @return mixed
	 */
	extractValue(resource)
	{
		return this.mutator(this.extractor(resource));
	}
}