import { DateTimeAttribute } from './DateTimeAttribute'

export class DeletedAtAttribute extends DateTimeAttribute {

  listable = false;
  
  constructor (name, options) {
    super(name, options);
  }

  getClassName() {
    return 'DeletedAtAttribute'
  }
}
