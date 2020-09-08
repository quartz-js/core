export class Url {
  static updateQueryUrlParameter(key, value) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);

    var params = Object.assign({}, Url.params || [], urlParams.entries())

    params[key] = value;

    Url.params = params;

    window.history.pushState(null, '', window.location.href.split("?")[0] + "?" + _.map(params, (val, key) => { return key+"="+val; }).join("&"));
  }
};
