export var LoadResource = {
  data() {
    return {
      rawValue: null
    };
  },
  watch: {
    value: function (){
      this.rawValue = this.attribute.extractValue(this.value);
    }
  },
  mounted () {
      this.rawValue = this.attribute.extractValue(this.value);
  }
}
