/**
 * Handle all url related issues
 */
export class Url {

  /**
   * Push the key+value into the url
   */
  static updateQueryUrlParameter(key, value) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);

    var params = Object.assign({}, Url.params || [], urlParams.entries())

    params[key] = value;

    Url.params = params;

    window.history.pushState(null, '', window.location.href.split("?")[0] + "?" + _.map(params, (val, key) => { return key+"="+val; }).join("&"));
  }
};
