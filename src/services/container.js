export const container =
{
  vars: [],
  set: function (name, value) {
    window['service'][name] = value;
  },

  get: function (name) {
    return typeof window['service'][name] !== 'undefined' ? window['service'][name] : null;
  }
}

if (typeof window['service'] === "undefined") {
  window['service'] = {};
}