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
    return this.getLocalizationPrefixData() + resource + '.attributes.' + attribute + '.' + suffix;
  }
  
  translate(data, attribute, property)
  {
    let translator = container.get('translator');

    if (translator.te(this.getLocalizationKeyAttribute(data, attribute, property))) {
      return translator.t(this.getLocalizationKeyAttribute(data, attribute, property))
    }

    if (translator.te(this.getLocalizationKeyAttribute('__common', attribute, property))) {
      return translator.t(this.getLocalizationKeyAttribute('__common', attribute, property))
    }

    return this.humanize(attribute)
  }

}
