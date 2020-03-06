var clone = require('clone');
const lodash = require('lodash');
import Twig from 'twig';
import { Helper } from '../Helper'
import { Hook } from '../Hook'
import { container } from '../Container'

export class Manager {
  constructor (params) {

    this.hook = new Hook();

    this.attributes = [];
    this.create = true;
    this.update = true;
    this.remove = true;
    this.show = true;
    this.parserFinalQuery = [];
    this.descriptor = params.descriptor || [];

    this.readable = params.readable || {}

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

    this.getFinalQuery = function (query, obj) {
      this.parserFinalQuery.map(parser => {
        query = parser(query)
      })

      if (query && obj) {
        query = container.get('template').parse(query, obj)
      }

      return query;
    };

    this.getIdentification = function () {
      return this.name;
    };

    this.onShowEdit = function () {

    };

    this.onCreateSuccess = function (vue, data) {

      if (!this.persist || !this.persist.data || !this.vars.containerResource) {
        return Promise.resolve(1)
      }

      let params = _.mapValues(this.persist.data.attributes, (val, key) => {
        return Twig.twig({data: val}).render({
          containerResource: this.vars.containerResource,
          resource: data
        })
      })

      return this.persist.manager(data).manager.create(params).then(i => {
        bus.$emit(this.getKeyResourceEvent(this.vars.containerResource.getType(), 'changed'), this.vars.containerResource);
      })

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


    /**
     * Get attributes by namesyay
     *
     * @param {string} name
     *
     * @return {BaseAttribute}
     */
    this.getPrimaryAttributes = function() {
      return this.attributes.filter(function (attribute) {
        return attribute.required
      });
    };


    for (var i in params) {
      this[i] = params[i];
    }
  }
  
  resourceEvent (label) {
    return this.getKeyResourceEvent(this.data, label)
  }

  getKeyResourceEvent(nameData, nameEvent)
  {
      return nameData + ":" + nameEvent;
  }

  index (params) {
    return this.hook.execute('include', []).then(includes => {
      return this.manager.index(_.merge(params, {include: includes.join(',')}))
    })
  }

  addAction(type, component) {
    this.actions[type].push(component)
  }

  addAttribute (attribute) {
    this.attributes.push(attribute)
    attribute.manager = () => { return this };
    attribute.ini();
  }

  async getParamsToPersist (original, action) {
    let resource = {}

    for (let attr in this.attributes) {
      attr = this.attributes[attr]
      attr.injectPersist(resource, original, action)
    }

    return resource
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

  clone () {
    return clone(this);
  }

  removeResource (data) {

    return this.manager.remove(data.id).then(response => {
      this.onRemoveSuccess(this, response);
      bus.$emit(this.resourceEvent("removed"), data);

      this.attributes.map((attribute) => {
        attribute.onRemove(data);
      });
    })
  }

  createResource (data) {

    return this.hook.execute('BeforeCreate', {resource: data}).then((data) => {
      return this.hook.execute('beforePersist', data.resource);
    }).then(async params => {
      
      params = _.pickBy(params, (value) => {
        return value !== null
      })

      params = await this.getParamsToPersist(params, 'create')

      return this.manager.create(params);
    }).then(response => {

      data.id = response.body.data.id

      let promises = this.attributes.map(attribute => {
        return attribute.onSave(response.body.data.id, data);
      });


      this.attributes.map((attribute) => {
        attribute.onCreate(data);
      });


      return Promise.all(promises).then(() => {

        return this.onCreateSuccess(this, response.body.data);

      }).then(i => {
        bus.$emit(this.resourceEvent("created"), response.body.data);
      })
    }).catch(error => {
      Helper.handleResponse(error);

      return this.hook.execute('AfterCreateError', {resource: data}).then((data) => {
        throw error
      })
    })
  }

  newEntity(route) {
    let data = {};

    this.injectDefault(data, route)

    return data;
  }

  injectDefault(data, route) {
    this.attributes.map(attribute => {
      attribute.injectDefault(data, route)
    });
  }

  updateResource (id, data) {
    
    return this.hook.execute('BeforeCreate', {resource: data}).then((data) => {
      return this.hook.execute('beforePersist', data.resource);
    }).then(async params => {

      params = await this.getParamsToPersist(params, 'update')

      this.attributes.map(attribute => {
        params = attribute.preUpdate(params);
      });

      return this.manager.update(id, params);
    }).then(response => {

      data = _.merge(data, response.body.data);

      let promises = this.attributes.map(attribute => {
        return attribute.onSave(data.id, data);
      });

      this.attributes.map((attribute) => {
        attribute.onUpdate(data);
      });

      return Promise.all(promises).then(() => {

        this.onUpdateSuccess(this, response);

        bus.$emit(this.resourceEvent("updated"), data);

        return response;
      });
    }).catch(error => {
      Helper.handleResponse(error);

      return this.hook.execute('AfterCreateError', {resource: data}).then((data) => {
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

  getQueryableAttributes() {
    if (this.hasAttribute('name')) {
      return [this.getAttribute('name')]
    }

    return this.attributes.filter(attribute => {
      return attribute.getClassName() === 'TextAttribute' || attribute.getClassName() === 'NumberAttribute';
    }).slice(0, 5);
  }
};
