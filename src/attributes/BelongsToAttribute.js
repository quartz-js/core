import { Base } from '../relations/Base'

export class BelongsToAttribute extends Base {

  constructor (name, options) {
    super(name, options);

    this.query = (key) => {
      return "name ct '" + key + "'";
    };

    this.components = {};
    
    this.mutator = (value) => {
        return value ? this.getLabelByResource(value) : null;
    };

    this.injector = (resource, value) => {
      
      resource[this.getRelationName()] = value ? value : null;
      resource[this.name] = value ? value.id : null;

      return resource;
    };

    this.default = () => {
      return { id: undefined };
    };

    this.extractor = resource => {
      return resource && typeof resource[this.getRelationName()] !== 'undefined' ? resource[this.getRelationName()] : null;
    };
  }
  compareDefault (resource, value) {
    let t = JSON.parse(JSON.stringify(resource));
    this.injectDefault(t);
    
    return JSON.stringify(this.extractor(t)) === JSON.stringify(value);
  }
  addBeforeCreateHook () {
    this.addHook('BeforeCreate', (data) => {

      let finalValue = this.extractor(data.resource);

      if (this.compareDefault(data.resource, finalValue) && this.required === false) {
        return Promise.resolve(data)
      }

      if (!finalValue || !finalValue.id) {
        return this.relationManager().createResource(finalValue)
          .then(response => {

            data.resource[this.name] = response.body.data.id
            finalValue.id = response.body.data.id;

            return data
          })
      } else {

        return this.relationManager().updateResource(finalValue.id, finalValue)
          .then(response => {

            data.resource[this.name] = response.body.data.id
            finalValue.id = response.body.data.id;

            return data
          })
      }
    });

    return this;
  }

  getRelationName () {
    return this.name + '_relation';
  }

  injectDefault (data) {
    let def = this.getDefault()
    console.log(this.relationManager);

    if (JSON.stringify(this.relationManager()) === JSON.stringify(this.manager())) {
      return
    }

    this.relationManager().injectDefault(def)

    this.injectValue(data, def)
  }


  /**
   * @return {Callable}
   */
  load (resources) {
    var ids = resources.filter(resource => { 

      if (!resource[this.column]) {
        this.injectDefault(resource)
      }

      return resource[this.column] && !resource.__booted; 
    }).map(resource => { return resource[this.column] });

    if (ids.length === 0) {
      return Promise.resolve(resources)
    }

    return this.relationManager().manager.index({query: ids ? 'id in (' + ids.join(',') + ')' : '', show: 999}).then(responseR => {
      return Promise.resolve(resources.map(resource => {
        resource[this.getRelationName()] = responseR.body.data.find(b_resource => { return b_resource.id == resource[this.column] });
        return resource;
      }))
    });
  }
}
