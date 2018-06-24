export const container =
{
	vars: [],
	set: function(name, value)
	{
		this.vars[name] = value;
	},

	get: function(name)
	{
		return typeof this.vars[name] !== "undefined" ? this.vars[name] : null;
	}
}