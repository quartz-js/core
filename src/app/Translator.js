import { container } from './Container'
const s = require("underscore.string");

export class Translator {

  getLocalizationPrefixData()
  {
    return '$quartz.data.'
  }

  humanize(str)
  {
    return s.humanize(str);
  }
  
  getLocalizationKeyAttribute (resource, attribute, suffix)
  {
    return this.getLocalizationPrefixData() + resource + '.attributes.' + attribute.label + suffix;
  }
  
  translate(attribute, property)
  {
    let translator = container.get('translator');

    if (translator.te(this.getLocalizationKeyAttribute(attribute.manager().name, attribute, '.' + property))) {
      return translator.t(this.getLocalizationKeyAttribute(attribute.manager().name, attribute, '.' + property))
    }

    if (translator.te(this.getLocalizationKeyAttribute('__common', attribute, '.' + property))) {
      return translator.t(this.getLocalizationKeyAttribute('__common', attribute, '.' + property))
    }

    return this.humanize(attribute.name)
  }

}
