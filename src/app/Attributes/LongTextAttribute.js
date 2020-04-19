import { BaseAttribute } from './BaseAttribute'

export class LongTextAttribute extends BaseAttribute {
  simple = true

  constructor (name) {
    super(name);
  }

  getClassName() {
    return 'LongTextAttribute'
  }
}
