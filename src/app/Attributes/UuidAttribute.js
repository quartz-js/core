import { BaseAttribute } from './BaseAttribute'

export class UuidAttribute extends BaseAttribute {
  simple = true

  getClassName() {
    return 'UuidAttribute'
  }
}
