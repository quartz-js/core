export var HandleResource = {
  props: ['resource'],
  data() {
    return {
      rawResource: null
    }
  },
  methods: {
    reloadRawResource() {
      this.rawResource = this.resource;
    },
    onChange () {
      this.$emit('input', this.rawResource);
    },
  },
  created() {
    this.reloadRawResource();
  }
}
