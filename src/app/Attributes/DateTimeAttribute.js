import { BaseAttribute } from './BaseAttribute'
import moment from 'moment'

export class DateTimeAttribute extends BaseAttribute {
  simple = true
  
  getClassName() {
    return 'DateTimeAttribute'
  }
}
