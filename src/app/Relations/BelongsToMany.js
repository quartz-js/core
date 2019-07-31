import { MorphToMany } from './MorphToMany'

export class BelongsToMany extends MorphToMany {

  getClassName() {
    return 'BelongsToMany'
  }
}
