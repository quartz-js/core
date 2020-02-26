import { container } from '../app/Container'

export var AttributePreMount = {
  props: ['action'],
  data() {
    return {
      show: true,
      error: null,
    };
  },
  methods: {
    isDisabled() {
      return this.action === 'update' && !this.attribute.mutable
    },
    globalAttributeProps() {
      return container.get('$quartz.core.props.form', {});
    },
    canShow() {
      return this.show;
    },
    canMount() {

      let fixed = this.attribute.fixed(this.value);

      if (this.attribute && fixed !== undefined) {

        this.attribute.injectValue(this.value, fixed);
        this.$emit('input', this.value);
        
        this.show = false;
        return false;
      }

      if (this.errors) {
        this.error = this.errors.find((error) => {
          return error.label === this.attribute.name;
        });
      }

      return true;

    }
  }
}
