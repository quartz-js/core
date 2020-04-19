import { BaseAttribute } from './BaseAttribute'

export class NumberAttribute extends BaseAttribute {
  simple = true
  
  constructor (name, options) {
    super(name, options);
  }

  getClassName() {
    return 'NumberAttribute'
  }
}
