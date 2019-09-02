import { Helper } from '../app/Helper'

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
    loadDataByQuery(query)
    {
      return this.config.executeHooks('include', []).then(includes => {
        return this.config.manager.index({
          include: includes.join(","),
          query: query, 
          show: 1, 
          page: 1
        })
      }).then(response => {
      
        var resource = response.body;
        return this.config.loadResources([resource.data[0]])

      }).then((data) => {
        this.setData(data[0]);
      }).catch(response => {
        Helper.handleResponse(response);

        this.setData(null);
      });
    },
    loadDataByQueryOrId(id) {
      
      if (this.config.getFinalQuery(null)) {
        return this.loadDataByQuery(`id eq ${id}`);
      }

      if (id) {
        return this.loadDataById(id);
      }
    },
    loadDataById (id) {

      return this.config.executeHooks('include', []).then(includes => {
        return this.config.manager.show(id, {
          include: includes.join(",")
        })
      }).then(response => {
        var resource = response.body;

        return this.config.loadResources([resource.data])

      }).then((data) => {
        this.setData(data[0]);

      }).catch(response => {
        Helper.handleResponse(response)
        
        this.setData(null);
      });
    },

    loadDataByProps () {
      if (this.resource) {
        if (JSON.stringify(this.resource) === JSON.stringify(this.data)) {
          return;
        }

        return this.config.loadResources([this.resource]).then((data) => {
          this.setData(data[0]);
        }).catch(response => {
          Helper.handleResponse(response);

          this.setData(null);
        });
      } else if (this.id) {
        return this.loadDataByQueryOrId(this.id);
      } else {
        throw new Error("Nor resource object or id has been sent");
      }
    },
    loadDataByUrl () {
      return this.loadDataByQueryOrId(this.config.getId(this));
    },
    createListeners() {

      bus.$on(this.config.resourceEvent("changed"), data => {
        if (this.data.id) {
          this.loadDataById(this.data.id);
        }
      });

      bus.$on(this.config.resourceEvent("updated"), data => {

        if (!data) {
          return;
        }

        if (parseInt(data.id) === parseInt(this.data.id)) {
          this.config.loadResources([data]).then((data) => {
            this.setData(data[0]);
          })
        }
      });
      bus.$on(this.config.resourceEvent("removed"), data => {

        console.log(data)
        
        if (parseInt(data.id) === parseInt(this.data.id)) {
          this.data = null;
        }
      });
    },
    destroyListeners() {
      bus.$off(this.config.resourceEvent("changed"));
      bus.$off(this.config.resourceEvent("updated"));
      bus.$off(this.config.resourceEvent("removed"));
    }
  }
}
