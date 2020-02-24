import { BaseAttribute } from './BaseAttribute'
import moment from 'moment'

export class DateAttribute extends BaseAttribute {
  constructor (name, options) {
    super(name, options);
    this.mutator = function (value) {
      value = this.extractor(value);
      
      return value ? moment(value).format('DD-MM-YYYY') : null
    };
    this.priority = 0;
  }

  getClassName() {
    return 'DateAttribute'
  }
}
