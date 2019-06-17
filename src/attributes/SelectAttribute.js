import { BaseAttribute } from './BaseAttribute'

export class SelectAttribute extends BaseAttribute {
  constructor (name) {
    super(name);
    this.extractor = resource => {

      if (!resource) {
        return;
      }
      
      var value = resource[this.name];

      var option = this.getOptionByValue(value);

      return option;
    };

    this.injector = (resource, value) => {

      resource[this.name] = value;

      return resource;
    };

    this.mutator = (value) => {
      value = this.extractor(value);
      
      return value ? value.label : null;
    };
  }

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
