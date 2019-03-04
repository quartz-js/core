import { BaseAttribute } from './BaseAttribute'

export class LongTextAttribute extends BaseAttribute {
  constructor (name) {
    super(name);
    this.priority = 0;
  }
}
