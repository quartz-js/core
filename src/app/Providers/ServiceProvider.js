import { container } from './../../services/container'
import lodash from 'lodash';

export class ServiceProvider {

  registerComponent(name, options) {
    container.set('$vue.components', container.get('$vue.components', []).concat([{name: name, options: options}]))
  }

  loadComponents(vue) {

    container.get('$vue.components').map(component => {
      vue.component(component.name, component.options);
    })
  }

  addRoutes(parentName, routes) {
    if (parentName) {
    	var route = container.get('$vue.routes').find((route) => {
    	  return route.name === parentName;
    	})

      if (!route) {
        throw "No route found with name "+parentName
      }

    	route.children = route.children.concat(routes);
    } else {
      container.set('$vue.routes', container.get('$vue.routes').concat(routes))
    }
  }

  findRoute(query) {

    var routes = container.get('$vue.routes');

    for (let i = 0; i < query.length; i++) {
      var result = this.__findArray(routes, query[i])

      routes = result.children
    }

    return result;
  }

  __findArray(array, params) {
    return array.find((r) => {
      return _.isEqual(_.pick(r, Object.keys(params)), params);
    })
  }

  addData(data) {

    if (!data.icon) {
      data.icon = require('../../assets/data-icon.svg');
    }

    container.get('$quartz.data').push(data);
  }

  addLang(lang) {
  	var obj = container.get('$quartz.lang');
  	_.merge(obj, lang);
  	container.set('$quartz.lang', obj)
  }
}