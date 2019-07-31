import { BaseAttribute } from './BaseAttribute'

export class UrlAttribute extends BaseAttribute {
  constructor (name) {
    super(name);
    this.mutator = function (value) {
      value = this.extractor(value);
      
      return "<a href='" + value + "' target='_blank'>" + (value.length > 50 ? value.substr(0, 50) + '\u2026' : value) + '</a>';
    };
  }

  getClassName() {
    return 'UrlAttribute'
  }
}
