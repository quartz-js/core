export var LoadResource = {
  data() {
    return {
      rawValue: null
    };
  },
  watch: {
    value: function (){
      this.rawValue = await this.attribute.extractValue(this.value);
    }
  },
  mounted () {
      this.rawValue = await this.attribute.extractValue(this.value);
  }
}
