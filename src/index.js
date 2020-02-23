module.exports = {
    Attributes: {
        Base: require('./app/Attributes/BaseAttribute').BaseAttribute,
        DateTime: require('./app/Attributes/DateTimeAttribute').DateTimeAttribute,
        CreatedAt: require('./app/Attributes/CreatedAtAttribute').CreatedAtAttribute,
        UpdatedAt: require('./app/Attributes/UpdatedAtAttribute').UpdatedAtAttribute,
        DeletedAt: require('./app/Attributes/DeletedAtAttribute').DeletedAtAttribute,
        Yaml: require('./app/Attributes/YamlAttribute').YamlAttribute,
        Enum: require('./app/Attributes/EnumAttribute').EnumAttribute,
        Number: require('./app/Attributes/NumberAttribute').NumberAttribute,
        Boolean: require('./app/Attributes/BooleanAttribute').BooleanAttribute,
        ClassName: require('./app/Attributes/ClassNameAttribute').ClassNameAttribute,
        Array: require('./app/Attributes/ArrayAttribute').ArrayAttribute,
        Object: require('./app/Attributes/ObjectAttribute').ObjectAttribute,
        Id: require('./app/Attributes/IdAttribute').IdAttribute,
        Uuid: require('./app/Attributes/UuidAttribute').UuidAttribute,
        Text: require('./app/Attributes/TextAttribute').TextAttribute,
        LongText: require('./app/Attributes/LongTextAttribute').LongTextAttribute,
        Image: require('./app/Attributes/ImageAttribute').ImageAttribute,
        Select: require('./app/Attributes/SelectAttribute').SelectAttribute,
        Switch: require('./app/Attributes/SwitchAttribute').SwitchAttribute,
        Url: require('./app/Attributes/UrlAttribute').UrlAttribute,
        File: require('./app/Attributes/FileAttribute').FileAttribute,
        Email: require('./app/Attributes/EmailAttribute').EmailAttribute,
        Password: require('./app/Attributes/PasswordAttribute').PasswordAttribute,
        Html: require('./app/Attributes/HtmlAttribute').HtmlAttribute,
        DataName: require('./app/Attributes/DataNameAttribute').DataNameAttribute,
    },
    Interceptor: require('./app/Interceptor').Interceptor,
    ProviderLoader: require('./app/Providers/ProviderLoader').ProviderLoader,
    ServiceProvider: require('./app/Providers/ServiceProvider').ServiceProvider,
    QuartzServiceProvider: require('./app/Providers/QuartzServiceProvider').QuartzServiceProvider,
    Manager: require('./app/Managers/Manager').Manager,
    Helper: require('./app/Helper').Helper,
    ResourceApi: require('./app/Api/ResourceApi').ResourceApi,
    container: require('./app/Container').container,
    Translator: require('./app/Translator').Translator,
    AttributePreMount: require('./mixins/AttributePreMount').AttributePreMount,
    HandleResource: require('./mixins/HandleResource').HandleResource,
    mixins: {
        utils: require('./mixins/utils').utils,
        Expandable: require('./mixins/Expandable').Expandable,
    },
    install: function (Vue, options) {

        Vue.component("QResourceCreate", require('./components/Resource/Create').default)
        Vue.component("QResourceEdit", require('./components/Resource/Edit').default)
        Vue.component("QDataIteratorTable", require('./components/Data/Iterator/Table').default)
        Vue.component("QDataIteratorDiscussion", require('./components/Data/Iterator/Discussion').default)
        Vue.component("QDataIteratorCalendar", require('./components/Data/Iterator/Calendar').default)
        Vue.component("QDataCameraBarcode", require('./components/Data/CameraBarcode').default)
        Vue.component("QResourceRemove", require('./components/Resource/Remove').default)
        Vue.component("QResourceShow", require('./components/Resource/Show').default)

        Vue.component("QPageIndex", require('./components/Page/Index').default)
        Vue.component("QPageShow", require('./components/Page/Show').default)

        Vue.component("QShowJson", require('./components/Show/Json').default)
        Vue.component("QShowText", require('./components/Show/Text').default)

        Vue.component("QFormJson", require('./components/Form/FormJson').default)
        Vue.component("QFormHtml", require('./components/Form/FormHtml').default)
        Vue.component("QFormYaml", require('./components/Form/Yaml').default)

        Vue.component("QAttrAutocomplete", require('./components/Input/Autocomplete').default)
        Vue.component("QAttrHtml", require('./components/Input/Html').default)
        Vue.component("QAttrYaml", require('./components/Input/Yaml').default)
        Vue.component("QAttrDate", require('./components/Input/Date').default)
        Vue.component("QAttrDatetime", require('./components/Input/DateTime').default)
        Vue.component("QAttrJson", require('./components/Input/Json').default)
        Vue.component("QAttrSecret", require('./components/Input/Secret').default)
        Vue.component("QAttrSelect", require('./components/Input/Select').default)
        Vue.component("QAttrSwitch", require('./components/Input/Switch').default)
        Vue.component("QAttrCheckbox", require('./components/Input/Checkbox').default)
        Vue.component("QAttrText", require('./components/Input/Text').default)
        Vue.component("QAttrTextarea", require('./components/Input/Textarea').default)
        Vue.component("QAttrFile", require('./components/Input/File').default)


        let components = [
          'QBtn', 
          'QBtnTable',
          'QBtnInput',
          'QBtnCompact',
          'QTextField',
          'QTextarea',
          'QAutocomplete',
          'QCheckbox',
          'QColorPicker', 
          'QNavigationDrawer',
          'QAppBar',
          'QSidebar',
          'QCard',
          'QSheet',
          'QTabs',
          'QSelect',
          'QSnackbar',
          'QForm',
          'QDialog',
          'QComponentSelector',
          'QIcon',
          'QContent',
          'QContainer',
          'QLogo',
          'QApp',
          'QViewIcon'
        ]

        components.map(function(i) {
          Vue.component(`${i}`, require(`./components/Components/${i}`).default)
        })

        Vue.prototype.$container = require('./app/Container').container
    }
};