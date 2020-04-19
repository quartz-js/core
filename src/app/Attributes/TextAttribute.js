import { BaseAttribute } from './BaseAttribute'
import moment from 'moment'

export class TextAttribute extends BaseAttribute {
  simple = true
  
  constructor (name, options) {
    super(name, options);
  }

  getClassName() {
    return 'TextAttribute'
  }
}
