<script>

import { BelongsToMany } from '../../relations/BelongsToMany'
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