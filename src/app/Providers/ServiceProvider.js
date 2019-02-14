import { container } from './../../services/container'
import lodash from 'lodash';

export class ServiceProvider {

  addRoutes(routes) {
  	var route = container.get('$vue.routes').find((route) => {
  	  return route.name === 'app';
  	});

  	route.children = route.children.concat(routes);
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