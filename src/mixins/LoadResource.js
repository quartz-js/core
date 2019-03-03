export var LoadResource = {
  props: {
    config: {
      type: Object,
      required: true,
    },
    resource: {
      type: Object
    },
    id: {
      type: [Number,String]
    }
  },
  data() {
    return {
      data: null,
    };
  },
  watch: {
    resource: function (){
      this.loadDataByProps();
    },
    id: function (){
      this.loadDataByProps();
    }
  },
  methods: {
    resetData () {
      this.setData(this.resource);
    },
    setData (object) {
      this.data = JSON.parse(JSON.stringify(object));
    },
    loadDataById (id) {
      return this.config.manager.show(id).then(response => {
        var resource = response.body;
        this.config.loadResources([resource.data]).then((data) => {
          this.setData(data[0]);
        }).catch(response => {
          console.log(response)
          this.setData(null);
        });

      }).catch(response => {
        this.setData(null);
      });
    },

    loadDataByProps () {

      if (this.resource) {
        return this.config.loadResources([this.resource]).then((data) => {
          this.setData(data[0]);
        }).catch(response => {
          console.log(response)
          this.setData(null);
        });
      } else if (this.id) {
        return this.loadDataById(this.id);
      } else {
        throw new Error("Nor resource object or id has been sent");
      }
    },
    loadDataByUrl () {
      return this.loadDataById(this.config.getId(this));
    },
    listenResourceEvents() {
      bus.$on(this.config.resourceEvent("updated"), data => {
        if (data.id === this.data.id) {
          this.data = data;
        }
      });
      bus.$on(this.config.resourceEvent("removed"), data => {
        if (data.id === this.data.id) {
          // this.data = null;
        }
      });
    }
  }
}
