import { BaseAttribute } from './BaseAttribute'

export class SelectAttribute extends BaseAttribute {
 
  /**
   * @param {array} options
   *
   * @return this
   */
  setOptions (options) {
    this.options = options;

    return this;
  }

  /**
   * @return {string}
   */
  getOptions () {
    return this.options;
  }

  getOptionByValue (value) {
    return this.options.find(function (option) {
      return option.value == value;
    });
  }

  getClassName() {
    return 'SelectAttribute'
  }
}
