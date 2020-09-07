import { container } from '../Container';
import Vue from 'vue'

export class ValueInjector
{
  /**
   * Given a resource inject the information based on configuration and vars
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
   * @param value
   * @param config
   * @param vars
   *
   * @return object @todo to promise
   */
  inject (resource, value, config, vars) {

    if (!resource || !config) {
      return resource
    }

    if (!vars) {
      vars = {}
    }

    _.map(config, (val, key) => {

      if (val.template) {
        let parsed = container.get('template').parse(val.template, _.merge({
          value: value, 
          resource: resource
        }, vars))

        Vue.set(resource, key, parsed);

        //_.set(resource, key, parsed);
      }

      if (val.path) {
        //_.set(resource, key, _.get({value: value}, val.path));
        Vue.set(resource, key, _.get({value: value}, val.path));
      }
    })


    return resource;
  }
}