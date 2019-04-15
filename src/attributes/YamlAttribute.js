import { BaseAttribute } from './BaseAttribute'
import moment from 'moment'

export class YamlAttribute extends BaseAttribute {
  constructor (name, options) {
    super(name, options);
  }

  getClassName() {
    return 'YamlAttribute'
  }
}
