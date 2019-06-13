import { BaseAttribute } from './BaseAttribute'

export class ImageAttribute extends BaseAttribute {
  constructor (name) {
    super(name);
    this.mutator = function (value) {
      value = this.extractor(value);
      
      return "<a href='" + value + "' target='_blank'><img src='" + value + "' width='80' height='80'></a>";
    };
  }

  getClassName() {
    return 'ImageAttribute'
  }
}
