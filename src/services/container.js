var set = require('set-value');
const get = require('get-value');

export const container =
{
  vars: [],
  __getStorage: function () {
  	return window['service'];
  },

  set: function (name, value) {
  	set(this.__getStorage(), name, value);
  	console.log(window['service']);
  },

  get: function (name, def) {
  	console.log(name);
  	return get(this.__getStorage(), name, { default: def })
  }
}

if (typeof window['service'] === "undefined") {
  window['service'] = {};
}