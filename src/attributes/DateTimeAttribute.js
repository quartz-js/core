import { BaseAttribute } from './BaseAttribute'
import moment from 'moment'

export class DateTimeAttribute extends BaseAttribute {
  constructor (name, options) {
    super(name, options);
    this.mutator = function (value) {
      return value ? moment(value).format('DD-MM-YYYY[,] HH:mm:ss') : null
    };
    this.priority = 0;
  }

  getClassName() {
    return 'DateTimeAttribute'
  }
}
