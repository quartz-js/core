import { SwitchAttribute } from './SwitchAttribute'

export class BooleanAttribute extends SwitchAttribute {
  constructor (name) {
    super(name);
  }

  getClassName() {
    return 'BooleanAttribute'
  }
}
