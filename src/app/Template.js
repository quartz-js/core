import Twig from 'twig';

export class Template {
  extendFunction(name, closure) {
    Twig.extendFunction(name, closure)
  }
  
  extendFilter(name, closure) {
    Twig.extendFilter(name, closure)
  }
  
  parse(tmpl, data) {
    return tmpl ? Twig.twig({data: tmpl}).render(data) : null
  }

}
