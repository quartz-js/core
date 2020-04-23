import { container } from '../Container';

export class ValueExtractor
{

  /**
   * Given a resource extract the information based on configuration and vars
   *
   * ----------------------------------
   *
   * Example 1 configuration: 
   * [{
   *  path: 'myPath'
   * }]
   *
   * Return promise: "resource.myPath"
   *
   * ---------------------------------
   *
   *
   * @param resource
   * @param config
   * @param vars
   *
   * @return Promise
   */
  extract(resource, config, vars)
  {
    if (!resource || !config) {
      return Promise.resolve(null)
    }

    if (!vars) {
      vars = {}
    }

    for (let key in config) {

      let val = config[key]

      if (typeof val === 'string' || typeof val === 'number') {
        return Promise.resolve(val)
      }

      if (val.path && _.has(resource, val.path)) {
        return Promise.resolve(_.get(resource, val.path))
      }

      if (val.query) {
        return vars.queryManager.index({
          query: container.get('template').parse(val.query, {resource: resource})
        })
      }


    }

    // throw new Error("It seems that the extraction of the resource to retrieve the attribute value failed. Please check your 'extract' attribute in the attribute: " + this.name)
  
    return Promise.resolve(null)
  }
}