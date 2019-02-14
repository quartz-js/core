export var ResourceLocalization = {
  methods: {
    getResourceTitle(resource) {
      return this.$t('$quartz.data.' + resource.name + '.name')
    },
    getResourceDescription(resource) {
      return this.$t('$quartz.data.' + resource.name + '.description')
    },
    getAttributeLabel(attribute) {
      return this.$t('$quartz.data.' + attribute.resourceConfig.name + '.attributes.' + attribute.getName() + '.label')
    },
    getAttributeDescription(attribute) {
      return this.$t('$quartz.data.' + attribute.resourceConfig.name + '.attributes.' + attribute.getName() + '.description')
    },
  }
}
