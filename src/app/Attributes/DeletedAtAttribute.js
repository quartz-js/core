import { DateTimeAttribute } from './DateTimeAttribute'

export class DeletedAtAttribute extends DateTimeAttribute {

  constructor (name, options) {
    super(name, options);
  }

  getClassName() {
    return 'DeletedAtAttribute'
  }
}
