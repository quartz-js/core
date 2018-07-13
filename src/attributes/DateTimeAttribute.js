import { BaseAttribute } from './BaseAttribute'

export class DateTimeAttribute extends BaseAttribute {
  constructor (name, options) {
    super(name, options);
    this.mutator = function (value) {
      return moment(value).format('DD-MM-YYYY[,] HH:mm:ss')
    };
  }
}
