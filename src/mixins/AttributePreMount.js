export var AttributePreMount = {
  data() {
    return {
      show: true,
      error: null,
    };
  },
  methods: {
    canMount() {



      if (this.attribute.fixed(this.value)) {
        this.attribute.injectValue(this.value, this.attribute.fixed(this.value));
    
        this.$emit('input', this.attribute.fixed(this.value));
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
