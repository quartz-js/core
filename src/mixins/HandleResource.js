export var HandleResource = {
  props: ['resource'],
  watch: {
    resource: function (){
      this.reloadRawResource();
    }
  },
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
