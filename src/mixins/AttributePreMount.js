export var AttributePreMount = {
  data() {
    return {
      show: true,
      error: null,
    };
  },
  methods: {
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
