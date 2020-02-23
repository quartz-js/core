import { EnumAttribute } from './EnumAttribute'
import { container } from '../Container'
const s = require("underscore.string");

export class DataNameAttribute extends EnumAttribute {
  boot () {
    this.setOptions(container.get('$quartz.view.services').map(service => {
      return {
        label: service.tag,
        value: service.tag,
      }
    }))
  }

  getClassName() {
    return 'EnumAttribute'
  }
}
