import { BaseAttribute } from './BaseAttribute'
import moment from 'moment'

export class DateTimeAttribute extends BaseAttribute {
  getClassName() {
    return 'DateTimeAttribute'
  }
}
