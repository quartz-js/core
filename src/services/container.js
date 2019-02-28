var set = require('set-value');
const get = require('get-value');

export const container =
{
  vars: [],
  __getStorage () {
  	return window['service'];
  },

  set (name, value) {
  	set(this.__getStorage(), name, value);
  },

  get (name, def) {
  	return get(this.__getStorage(), name, { default: def })
  },

  load (name, value) {
    if (!this.get(name)) {
      this.set(name, value)
    }
  },
}

if (typeof window['service'] === "undefined") {
  window['service'] = {};
}