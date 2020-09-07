export var HandleResource = {
  props: ['resource'],
  watch: {
    resource: {
      handle: function (){
        this.reloadRawResource();
      },
      deep: true
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
