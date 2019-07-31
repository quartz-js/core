import { SelectAttribute } from './SelectAttribute'

export class EnumAttribute extends SelectAttribute {
  constructor (name) {
    super(name);
  }

  getClassName() {
    return 'EnumAttribute'
  }
}
