import { SelectAttribute } from './SelectAttribute'

export class SwitchAttribute extends SelectAttribute {
  getOptionByValue (value) {
    return this.options.find(function (option) {
      return option.value === value;
    });
  }
  constructor (name) {
    super(name);

    var self = this;
  }
}
