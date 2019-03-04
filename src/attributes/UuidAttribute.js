import { BaseAttribute } from './BaseAttribute'

export class UuidAttribute extends BaseAttribute {
  constructor () {
    super('uuid', {});
    this.extractor = function (resource) {
      return _.get(resource, 'uuid');
    };
    this.priority = 0;
  }
}
