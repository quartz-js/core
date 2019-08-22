<script>

import { container } from '../../app/Container';
import _ from 'lodash'

export default {
  data() {
    return {
      now: new Date()
    }
  },
  computed: {
    attributes() {
      return _.assignIn({},{now:this.now}, _.clone(container.get('$quartz.props.' + this.$vnode.componentOptions.tag, {})), this.$attrs);
    }
  },
  created() {
    window.bus.$on('component.update', () => {
      setTimeout((i) => {
        this.now = new Date
      }, 10);
    });
  }
}
</script>