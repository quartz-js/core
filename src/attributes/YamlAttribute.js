import { BaseAttribute } from './BaseAttribute'

export class YamlAttribute extends BaseAttribute {
  constructor (name, options) {
    super(name, options);
    this.priority = 0;
  }

  getClassName() {
    return 'YamlAttribute'
  }
}
