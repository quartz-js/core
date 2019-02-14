import { container } from './../../services/container'
import lodash from 'lodash';

export class ServiceProvider {

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
      console.log(container.get('$vue.routes'));
      container.set('$vue.routes', container.get('$vue.routes').concat(routes))
    }
  }

  addData(data) {
    container.get('$quartz.data').push(data);
  }

  addLang(lang) {
  	console.log(lang)
  	var obj = container.get('$quartz.lang');
  	_.merge(obj, lang);
  	container.set('$quartz.lang', obj)
  }
}