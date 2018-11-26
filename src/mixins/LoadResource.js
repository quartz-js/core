export var LoadResource = {
  data() {
    return {
      data: null
    };
  },
  methods: {
    resetData () {
      this.setData(this.resource);
    },
    setData (object) {
      this.data = JSON.parse(JSON.stringify(object))
    },
    loadDataById (id) {
      this.config.manager.show(id).then(response => {
          var resource = response.body;
          var promises = this.config.attributes.map(attribute => {
              return attribute.load([resource.data]);
          });
           
          Promise.all(promises).then(() =>  {
            this.setData(response.body.data);
          }).catch(response => {
            this.setData(null);
          });

        }).catch(response => {
          this.setData(null);
        });
    },

    loadDataByProps () {
      if (this.resource) {
        this.setData(this.resource);
      } else if (this.id) {
        this.loadDataById(this.id);
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
          this.data = null;
        }
      });
    }
  }
}
