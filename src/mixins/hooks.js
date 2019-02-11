export var hooks = {
  methods: {
    getHooks($event, data){ 
      var hooks = this.hooks && typeof this.hooks[$event] !== "undefined" ? this.hooks[$event] : [];

      return Object.values(hooks.map((f) => {
        return f(data);
      }));
    },

	  executeHooks($event, data) {

	    var hooks = this.getHooks($event, data);

	    return hooks.reduce(function (prev, curr) {
	      return prev.then((data) => {
	        return curr(data);
	      });
	    }, Promise.resolve(data));

	  }
  }
}
