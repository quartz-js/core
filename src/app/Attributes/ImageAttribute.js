import { BaseAttribute } from './BaseAttribute'

export class ImageAttribute extends BaseAttribute {
  constructor (name) {
    super(name);
  }

  getClassName() {
    return 'ImageAttribute'
  }
}
