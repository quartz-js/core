import { Base } from '../Relations/Base'

export class BelongsToAttribute extends Base {

  constructor (name, options) {
    super(name, options);

    this.relationableSwitcher = (resource) => {
      return null;
    }

    this.components = {};
    

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


    this.injector = (resource, value) => {
      
      resource[this.getRelationName()] = value ? value : null;
      resource[this.name] = value ? value.id : null;

      return resource;
    };

  }
  compareDefault (resource, value) {
    let t = JSON.parse(JSON.stringify(resource));
    this.injectDefault(t);
    
    return JSON.stringify(this.extractor(t)) === JSON.stringify(value);
  }

  parseExtractedDefaultFromRoute (value) {
    return value ? JSON.parse(value) : null;
  }

  addBeforeCreateHook () {
    this.addHook('BeforeCreate', (data) => {

      let finalValue = this.extractor(data.resource);

      if (this.compareDefault(data.resource, finalValue) && this.required === false) {
        return Promise.resolve(data)
      }

      if (!finalValue || !finalValue.id) {
        return this.getRelationManager(data.resource).createResource(finalValue)
          .then(response => {

            data.resource[this.name] = response.body.data.id
            finalValue.id = response.body.data.id;

            return data
          })
      } else {

        return this.getRelationManager(data.resource).updateResource(finalValue.id, finalValue)
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
    return this.name.replace('_id', '');
  }

  onCreate(data) {
    this.getRelationManager(data) && bus.$emit(this.getRelationManager(data).resourceEvent("changed"), this.extractValue(data));
  }

  onUpdate(data) {
    this.getRelationManager(data) && bus.$emit(this.getRelationManager(data).resourceEvent("changed"), this.extractValue(data));
  }

  onRemove(data) {
    this.getRelationManager(data) && bus.$emit(this.getRelationManager(data).resourceEvent("changed"), this.extractValue(data));
  }

  getClassName() {
    return 'BelongsToAttribute'
  }
}
