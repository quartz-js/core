import { BaseAttribute } from './BaseAttribute'

export class IdAttribute extends BaseAttribute {
  simple = true
  
  getClassName() {
    return 'IdAttribute'
  }
}
