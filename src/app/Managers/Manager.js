var clone = require('clone');

export class Manager {
  constructor (params) {

    this.create = true;
    this.update = true;
    this.remove = true;
    this.show = true;
    
    if (!this.name) {
      this.name = this.title;
    }

    this.rowEnabled = (resource) => {
      return undefined;
    }

    this.ini = function() {
      this.attributes.map((attribute) => {
        attribute.resourceConfig = this;
      });
    };

    this.getParamsShow = function (resource) {
      return { id: resource.id };
    };

    this.getRouteShow = function (resource) {
      return { name: this.route + '.show', params: this.getParamsShow(resource) };
    };

    this.getId = function(vue) {
      return this.getKeyByRoute(vue.$route.params);
    };

    this.getRouteIndex = function(resource) {
      return {name: this.route + '.index'};
    }

    this.getKeyByRoute = function (params) {
      return params.id;
    };

    this.getFinalQuery = function (query) {
      return query;
    };

    this.getIdentification = function () {
      return this.manager.getFullUrl();
    };

    this.onShowEdit = function () {

    };

    this.onCreateSuccess = function (vue, response) {
    };

    this.onUpdateSuccess = function (vue, response) {
    };
    
    this.onRemoveSuccess = function (vue, response) {
    };

    this.showRow = function (resource) {

      var result = this.rowEnabled(resource);

      if (result !== undefined) {
        return result;
      }

      return true
    }

    /**
     * Get attribute by name
     *
     * @param {string} name
     *
     * @return {BaseAttribute}
     */
    this.getAttribute = function (name) {
      return this.attributes.find(function (attribute) {
        return attribute.name === name;
      });
    };

    /**
     * Get attributes by names
     *
     * @param {string} name
     *
     * @return {BaseAttribute}
     */
    this.getAttributes = function(names) {
      return this.attributes.filter(function (attribute) {
        return names.indexOf(attribute.name) !== -1;
      });
    };

    this.resourceEvent = function(label) {
      return this.name + ":" + label;
    }

    this.getListableAttributes = function() {
      return this.attributes.filter((attribute) => {
        return attribute.listable;
      }).map((attribute) => {
        return attribute.getName()
      });
    }

    for (var i in params) {
      this[i] = params[i];
    }
  }
  getHooks($event, data){ 
    var hooks = [];

    this.attributes.map(attribute => {
      hooks = hooks.concat(attribute.getHooks($event, data))
    });

    return hooks;
  }

  executeHooks($event, data) {

    var hooks = this.getHooks($event, data);

    return hooks.reduce(function (prev, curr) {
      return prev.then((data) => {
        return curr(data);
      });
    }, Promise.resolve(data));

  }

  clone () {
    return clone(this);
  }

  removeResource (id) {

    return this.manager.remove(id).then(response => {
      this.onRemoveSuccess(this, response);
      bus.$emit(this.resourceEvent("removed"), id);
    })
  }

  createResource (data) {

    return this.executeHooks('BeforeCreate', {resource: data}).then((data) => {
      return this.manager.create(data.resource);
    }).then(response => {

      let promises = this.attributes.map(attribute => {
        return attribute.persist(response.body.data.id, data);
      });

      return Promise.all(promises).then(() => {
        this.onCreateSuccess(this, response);
        bus.$emit(this.resourceEvent("created"), response.body.data);

        return response;
      });
    }).catch(error => {
      console.log(error);
      return this.executeHooks('AfterCreateError', {resource: data}).then((data) => {
        throw error
      })
    })
  }

  updateResource (id, data) {
    
    return this.executeHooks('BeforeCreate', {resource: data}).then((data) => {
      return this.manager.update(id, data.resource);
    }).then(response => {

      let promises = this.attributes.map(attribute => {
        return attribute.persist(response.body.data.id, data);
      });

      return Promise.all(promises).then(() => {
        this.onUpdateSuccess(this, response);
        bus.$emit(this.resourceEvent("updated"), response.body.data);

        return response;
      });
    }).catch(error => {
      console.log(error);
      return this.executeHooks('AfterCreateError', {resource: data}).then((data) => {
        throw error
      })
    })
  }
};
