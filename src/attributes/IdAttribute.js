import { BaseAttribute } from './BaseAttribute'

export class IdAttribute extends BaseAttribute {
  constructor () {
    super('id', {});
    this.extractor = function (resource) {
      return _.get(resource, 'id');
    };
  }
}
