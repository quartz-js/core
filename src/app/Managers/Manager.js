var clone = require('clone');
const lodash = require('lodash');

export class Manager {
  constructor (params) {

    this.attributes = [];
    this.create = true;
    this.update = true;
    this.remove = true;
    this.show = true;
    this.parserFinalQuery = [];
    this.descriptor = params.descriptor || [];

    this.actions = {
      basic: [],
      icon: []
    }
    
    if (!this.name) {
      this.name = this.title;
    }

    this.rowEnabled = (resource) => {
      return undefined;
    }

    params.attributes.map((attribute) => {
      this.addAttribute(attribute);
    });

    delete params.attributes


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
      this.parserFinalQuery.map(parser => {
        query = parser(query)
      })

      return query;
    };

    this.getIdentification = function () {
      return this.name;
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
     * Has attribute by name
     *
     * @param {string} name
     *
     * @return {BaseAttribute}
     */
    this.hasAttribute = function (name) {
      return this.attributes.find(function (attribute) {
        return attribute.name === name;
      });
    };

    /**
     * Get attribute by name
     *
     * @param {string} name
     *
     * @return {BaseAttribute}
     */
    this.getAttribute = function (name) {
      let attr = this.attributes.find(function (attribute) {
        return attribute.name === name;
      });

      if (!attr) {
        throw `Cannot find attribute called ${this.name}:${name}. Available attributes(${this.attributes.length}) are: ${this.attributes.map(attribute => {
          return attribute.name
        }).join(',')}`
      }

      return attr
    };

    /**
     * Get attributes by namesyay
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
      return this.data + ":" + label;
    }

    this.getListableAttributes = function() {
      return this.attributes.filter((attribute) => {
        return !attribute.hidden && attribute.listable && attribute.fixed() === undefined
      })
    }

    for (var i in params) {
      this[i] = params[i];
    }

    this.hooks = [];
  }

  addAction(type, component) {
    this.actions[type].push(component)
  }

  addAttribute (attribute) {
    this.attributes.push(attribute)
    attribute.manager = () => { return this };

    if (attribute.fixed(null) !== undefined) {
      this.parserFinalQuery.push((query) => {

        let fixed = attribute.fixed(null);
        
        // @todo: label of fixed
        fixed = typeof fixed === 'object' && fixed ? fixed.id : fixed;


        let newQuery = '';

        if (fixed === null) {
          newQuery = `${attribute.column} is null`;
        } else {
          newQuery = `${attribute.column} = '${fixed}'`
        }

        return this.mergePartsQuery([newQuery, query], 'and');
      })
    }
  }

  mergePartsQuery(parts, operator) {
    let sub = parts.filter((part) => {
      return part
    }).map((part) => {
      return `(${part})`
    })
    return sub.join(` ${operator} `)
  }

  set (name, value) {
    this[name] = value

    return this
  }
  
  addHook($event, callback) {
    if (typeof this.hooks[$event] === "undefined") {
      this.hooks[$event] = [];
    }

    this.hooks[$event].push(callback)

  }

  getHooks($event, data){ 
    var hooks = typeof this.hooks[$event] !== "undefined" ? this.hooks[$event] : [];

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

  removeResource (data) {

    return this.manager.remove(data.id).then(response => {
      this.onRemoveSuccess(this, response);
      bus.$emit(this.resourceEvent("removed"), data.id);

      this.attributes.map((attribute) => {
        attribute.onRemove(data);
      });
    })
  }

  createResource (data) {

    return this.executeHooks('BeforeCreate', {resource: data}).then((data) => {
      return this.executeHooks('beforePersist', data.resource);
    }).then(params => {
      
      params = _.pickBy(params, (value) => {
        return value !== null
      })

      return this.manager.create(params);
    }).then(response => {

      let promises = this.attributes.map(attribute => {
        return attribute.persist(response.body.data.id, data);
      });


      this.attributes.map((attribute) => {
        attribute.onCreate(data);
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

  newEntity() {
    let data = {};

    this.injectDefault(data)

    return data;
  }

  injectDefault(data) {
    this.attributes.map(attribute => {
      attribute.injectDefault(data)
    });
  }

      

  updateResource (id, data) {
    
    return this.executeHooks('BeforeCreate', {resource: data}).then((data) => {
      return this.executeHooks('beforePersist', data.resource);
    }).then(params => {
      return this.manager.update(id, params);
    }).then(response => {

      data = _.merge(data, response.body.data);

      let promises = this.attributes.map(attribute => {
        return attribute.persist(data.id, data);
      });

      return Promise.all(promises).then(() => {
        this.onUpdateSuccess(this, response);
        bus.$emit(this.resourceEvent("updated"), data);

        this.attributes.map((attribute) => {
          attribute.onUpdate(data);
        });

        return response;
      });
    }).catch(error => {
      console.log(error);
      return this.executeHooks('AfterCreateError', {resource: data}).then((data) => {
        throw error
      })
    })
  }

  loadResources(data) {

    var promises = this.attributes.map(attribute => {
      return (r) => { 
        return attribute.load(r)
      };
    });
    
    promises.push((r) => {
      r.map(resource => {
        return resource.__booted = true;
      })

      return Promise.resolve(r);
    })
    
    return promises.reduce(function (prev, curr) {
      return prev.then((r) => {
        return curr(r);
      });
    }, Promise.resolve(data))
  }
};
