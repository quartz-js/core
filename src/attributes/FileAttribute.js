import { BaseAttribute } from './BaseAttribute'

export class FileAttribute extends BaseAttribute {

  constructor (name, persistApi, options) {
    super(name, options);

    this.persistApi = persistApi;

    this.injector = (resource, value) => {
      resource[this.getRelationName()] = value ? value : null;
      resource[this.name] = value ? value : null;

      return resource;
    };

    this.default = () => {
      return { content: null, filename: null, filetype: null };
    };

    this.extractor = resource => {
      return resource && typeof resource[this.getRelationName()] !== 'undefined' ? resource[this.getRelationName()] : null;
    };

  }


  getRelationName () {
    return this.name + '_relation';
  }

  /**
   * @return {Callable}
   */
  load (resources) {

    return Promise.resolve(resources);
  }



  /**
   * @return {Callable}
   */
  persist (id, data) {

    var content = this.extractValue(data);

    const formData = new FormData();

    formData.append("file", content.file, content.filename)

    return this.persistApi.upload(id, formData, (e) => {
      if (e.lengthComputable) {
        var percent = e.loaded / e.total * 100;
        console.log(percent);

      }
    })
  }
}
