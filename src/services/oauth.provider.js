export class OAuthProvider {
  constructor () {

  }

  obj_to_query (obj) {
    var parts = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    }
    return '?' + parts.join('&');
  }

  isEnabled () {
    return this.enabled === true;
  }
}
