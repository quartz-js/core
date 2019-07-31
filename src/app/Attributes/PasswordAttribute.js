import { TextAttribute } from './TextAttribute'

export class PasswordAttribute extends TextAttribute {
  constructor (name) {
    super(name);
  }

  getClassName() {
    return 'PasswordAttribute'
  }
}
