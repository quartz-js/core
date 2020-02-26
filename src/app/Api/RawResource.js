import { container } from '../Container';
import _ from 'lodash';

export class RawResource {

  constructor (params) {
    this.fill(params)
  }

  fill(params)
  {
    _.map(params, (value, key) => this[key] = value)
  }

  convert () {

    let attributes = _.clone(this.attributes)


    this.setType(this.type)
    delete this.attributes
    delete this.relationships
    delete this.type

    this.fill(attributes)
    this.id = !isNaN(this.id) ? parseInt(this.id) : this.id
  }

  getKeyType() {
    return ':@type'
  }

  setType(type) {
    this[this.getKeyType()] = type
  }

  getType()
  {
    return this[this.getKeyType()]
  }
};