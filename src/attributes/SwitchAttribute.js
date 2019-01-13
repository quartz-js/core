import { SelectAttribute } from './SelectAttribute'

export class SwitchAttribute extends SelectAttribute {
  getOptionByValue (value) {
    return this.options.find(function (option) {
      return option.value == value;
    });
  }
  constructor (name) {
    super(name);

    this.setOptions([{
      value: 0,
      label: "No"
    },{
      value: 1,
      label: "Yes",
    }]);
  }
}
