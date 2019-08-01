export var Expandable = {
  data() {
    return {
      'expandable': []
    } 
  },
  methods: {
    changeStatusExpandable(key, value)
    {
      let index = this.expandable.indexOf(key);

      if (value && index === -1) {
        this.expandable.push(key)
      }

      if (!value && index !== -1) {
        this.expandable.splice(index, 1)
      }
    },
    canExpand(key)
    {
      return this.expandable.indexOf(key) !== -1
    }
  },
}
