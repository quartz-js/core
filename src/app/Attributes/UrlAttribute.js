import { BaseAttribute } from './BaseAttribute'

export class UrlAttribute extends BaseAttribute {
  simple = true
  
  getClassName() {
    return 'UrlAttribute'
  }
}
