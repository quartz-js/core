import { BaseAttribute } from './BaseAttribute'

export class HtmlAttribute extends BaseAttribute {
  constructor (name, options) {
    super(name, options);
  }

  getClassName() {
    return 'HtmlAttribute'
  }
}
