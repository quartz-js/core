import { container } from '../app/Container'

export var AttributePreMount = {
  props: ['action', 'disabled'],
  data() {
    return {
      show: true,
      error: null,
    };
  },
  methods: {
    isDisabled() {
      return this.disabled || (this.action === 'update' && !this.attribute.mutable) || this.attribute.disabled
    },
    globalAttributeProps() {
      return container.get('$quartz.core.props.form', {});
    },
    canShow() {
      return this.show;
    },
    canMount() {
      
      if (this.errors) {
        this.error = this.errors.find((error) => {
          return error.label === this.attribute.name;
        });
      }

      return true;

    }
  }
}
