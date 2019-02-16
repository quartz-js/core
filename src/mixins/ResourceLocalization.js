import VueI18n from 'vue-i18n'

export var ResourceLocalization = {
  methods: {

    getLocalizationPrefixData() {
      return '$quartz.data.'
    },
    getResourceTitle(resource) {
      return this.$t(this.getLocalizationPrefixData() + resource.name + '.name')
    },
    getResourceDescription(resource) {
      return this.$t(this.getLocalizationPrefixData() + resource.name + '.description')
    },
    getLocalizationKeyAttribute (resource, attribute, suffix) {
      return this.getLocalizationPrefixData() + resource + '.attributes.' + attribute.getName() + suffix;
    },
    getAttributeLabel(attribute) {

      if (this.$te(this.getLocalizationKeyAttribute(attribute.manager().name, attribute, '.label'))) {
        return this.$t(this.getLocalizationKeyAttribute(attribute.manager().name, attribute, '.label'))
      }

      if (this.$te(this.getLocalizationKeyAttribute('__common', attribute, '.label'))) {
        return this.$t(this.getLocalizationKeyAttribute('__common', attribute, '.label'))
      }

      return attribute.getName();
    },
    getAttributeDescription(attribute) {

      if (this.$te(this.getLocalizationKeyAttribute(attribute.manager().name, attribute, '.description'))) {
        return this.$t(this.getLocalizationKeyAttribute(attribute.manager().name, attribute, '.description'))
      }

      if (this.$te(this.getLocalizationKeyAttribute('__common', attribute, '.description'))) {
        return this.$t(this.getLocalizationKeyAttribute('__common', attribute, '.description'))
      }

      return null;
    },
  }
}
