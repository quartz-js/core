import { BaseAttribute } from './BaseAttribute'
import moment from 'moment'

export class DateAttribute extends BaseAttribute {
  simple = true
  
  getClassName() {
    return 'DateAttribute'
  }
}
