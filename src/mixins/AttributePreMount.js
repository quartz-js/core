import { container } from '../app/Container'

export var AttributePreMount = {
  data() {
    return {
      show: true,
      error: null,
    };
  },
  methods: {
    globalAttributeProps() {
      return container.get('$quartz.core.props.form', {});
    },
    canShowDueToCondition()
    {
      if (this.attribute.get('style') && this.attribute.get('style').condition) {

        for (let key in this.attribute.get('style').condition) {
          let value = this.attribute.get('style').condition[key];

          if (value != this.value[key]) {
            return false;
          }
        }
      }

      return true;
    },
    canShow() {
      return this.show && this.canShowDueToCondition();
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
