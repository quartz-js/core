import Twig from 'twig';

export class Template {

  parse(tmpl, data) {
    return tmpl ? Twig.twig({data: tmpl}).render(data) : null
  }

}
