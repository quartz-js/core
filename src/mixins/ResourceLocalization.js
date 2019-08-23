const s = require("underscore.string");

export var ResourceLocalization = {
  methods: {
    getLocalizationPrefixData() {
      return '$quartz.data.'
    },
    humanize(str) {
      return s.humanize(str);
    },
    getResourceTitle(resource) {
      return this.$t(this.getLocalizationPrefixData() + resource.name + '.name')
    },
    getResourceDescription(resource) {
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lobortis in arcu at pellentesque. Sed at porta odio. Vivamus sollicitudin euismod justo id ornare. Suspendisse a metus orci. Cras tempor finibus metus, nec dictum enim sollicitudin sit amet. Vestibulum et suscipit lacus. Nam vestibulum tempus dolor."
      // return this.$t(this.getLocalizationPrefixData() + resource.name + '.description')
    },
    getLocalizationKeyAttribute (resource, attribute, suffix) {
      return this.getLocalizationPrefixData() + resource + '.attributes.' + attribute.label + suffix;
    },
    getAttributeLabel(attribute) {

      if (this.$te(this.getLocalizationKeyAttribute(attribute.manager().name, attribute, '.label'))) {
        return this.$t(this.getLocalizationKeyAttribute(attribute.manager().name, attribute, '.label'))
      }

      if (this.$te(this.getLocalizationKeyAttribute('__common', attribute, '.label'))) {
        return this.$t(this.getLocalizationKeyAttribute('__common', attribute, '.label'))
      }

      return this.humanize(attribute.label);
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
