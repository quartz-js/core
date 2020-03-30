import { BaseAttribute } from './BaseAttribute'

export class FileAttribute extends BaseAttribute {

  showComponent = 'q-show-file'
  
  /**
   * @return {Callable}
   */
  onSave (id, data) {

    return this.extractValue(data).then(content => {

      if (!content) {
        return Promise.resolve(1)
      }

      const formData = new FormData();

      formData.append("file", content.file, content.filename)

      return this.manager().manager.post("upload?query=id eq "+id, formData, (e) => {
        if (e.lengthComputable) {
          var percent = e.loaded / e.total * 100;
          console.log(percent);
        }
      })
    })
  }

  /**
   * @param {object} resource
   *
   * @return string
   */
  getLabelByResource (value, resource) {
    
    return resource.url

  }

  getClassName() {
    return 'FileAttribute'
  }
}
