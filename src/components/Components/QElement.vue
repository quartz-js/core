<script>

import { container } from '../../app/Container';
import _ from 'lodash'

export default {
  data() {
    return {
      attributes: {},
    }
  },
  methods: {
    reload() {
      this.attributes = _.assignIn({}, this.$attrs, _.clone(container.get('$quartz.props.' + this.$vnode.componentOptions.tag, {})));
    }
  },
  mounted() {
    this.reload();
  },
  created() {
    this.reload();

    window.bus.$on('component.update', () => {
      setTimeout((i) => {
        this.reload();
      }, 10);
    });
  }
}
</script>