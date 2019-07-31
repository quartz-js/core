import { BaseAttribute } from './BaseAttribute'
import moment from 'moment'

export class TextAttribute extends BaseAttribute {
  constructor (name, options) {
    super(name, options);
  }

  getClassName() {
    return 'TextAttribute'
  }
}
