<script>

import { BelongsToMany } from '../../app/Relations/BelongsToMany'
import MorphToMany from './MorphToMany'

export default {
  extends: MorphToMany,
  props: {
    attribute: {
      type: BelongsToMany,
      required: true
    },
  },
}

</script>