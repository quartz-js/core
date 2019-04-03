module.exports = {
    Attributes: {
        Base: require('./attributes/BaseAttribute').BaseAttribute,
        BelongsTo: require('./attributes/BelongsToAttribute').BelongsToAttribute,
        DateTime: require('./attributes/DateTimeAttribute').DateTimeAttribute,
        CreatedAt: require('./attributes/CreatedAtAttribute').CreatedAtAttribute,
        UpdatedAt: require('./attributes/UpdatedAtAttribute').UpdatedAtAttribute,
        DeletedAt: require('./attributes/DeletedAtAttribute').DeletedAtAttribute,
        Yaml: require('./attributes/YamlAttribute').YamlAttribute,
        Enum: require('./attributes/EnumAttribute').EnumAttribute,
        Number: require('./attributes/NumberAttribute').NumberAttribute,
        Boolean: require('./attributes/BooleanAttribute').BooleanAttribute,
        ClassName: require('./attributes/ClassNameAttribute').ClassNameAttribute,
        Array: require('./attributes/ArrayAttribute').ArrayAttribute,
        Object: require('./attributes/ObjectAttribute').ObjectAttribute,
        Id: require('./attributes/IdAttribute').IdAttribute,
        Uuid: require('./attributes/UuidAttribute').UuidAttribute,
        Text: require('./attributes/TextAttribute').TextAttribute,
        LongText: require('./attributes/LongTextAttribute').LongTextAttribute,
        Image: require('./attributes/ImageAttribute').ImageAttribute,
        Select: require('./attributes/SelectAttribute').SelectAttribute,
        Switch: require('./attributes/SwitchAttribute').SwitchAttribute,
        Url: require('./attributes/UrlAttribute').UrlAttribute,
        File: require('./attributes/FileAttribute').FileAttribute,
        Email: require('./attributes/EmailAttribute').EmailAttribute,
        Password: require('./attributes/PasswordAttribute').PasswordAttribute,
    },
    Relations: {
        MorphThrough: require('./relations/MorphThrough').MorphThrough,
        HasOneMorph: require('./relations/HasOneMorph').HasOneMorph,
        Matrix: require('./relations/Matrix').Matrix,
    },
    ProviderLoader: require('./app/Providers/ProviderLoader').ProviderLoader,
    ServiceProvider: require('./app/Providers/ServiceProvider').ServiceProvider,
    QuartzServiceProvider: require('./app/Providers/QuartzServiceProvider').QuartzServiceProvider,
    Manager: require('./app/Managers/Manager').Manager,
    Helper: require('./app/Helper').Helper,
    ResourceApi: require('./api/ResourceApi').ResourceApi,
    container: require('./services/container').container,
    AttributePreMount: require('./mixins/AttributePreMount').AttributePreMount,
    mixins: {
        utils: require('./mixins/utils').utils,
    },
    install: function (Vue, options) {

        Vue.component("QResourceCreate", require('./components/Resource/Create').default)
        Vue.component("QResourceEdit", require('./components/Resource/Edit').default)
        Vue.component("QResourceIndex", require('./components/Resource/Index').default)
        Vue.component("QResourceRemove", require('./components/Resource/Remove').default)
        Vue.component("QResourceShow", require('./components/Resource/Show').default)

        Vue.component("QPageIndex", require('./components/Page/Index').default)
        Vue.component("QPageShow", require('./components/Page/Show').default)

        Vue.component("QShowJson", require('./components/Show/Json').default)
        Vue.component("QShowText", require('./components/Show/Text').default)

        Vue.component("QFormJson", require('./components/Form/FormJson').default)
        Vue.component("QFormHtml", require('./components/Form/FormHtml').default)

        Vue.component("QMorphThrough", require('./components/Input/MorphThrough').default)
        Vue.component("QBelongsTo", require('./components/Input/BelongsTo').default)
        Vue.component("QBelongsToOne", require('./components/Input/BelongsToOne').default)
        Vue.component("QHasOneMorph", require('./components/Input/HasOneMorph').default)
        Vue.component("QHtml", require('./components/Input/Html').default)
        Vue.component("QYaml", require('./components/Input/Yaml').default)
        Vue.component("QDate", require('./components/Input/Date').default)
        Vue.component("QDatetime", require('./components/Input/DateTime').default)
        Vue.component("QJson", require('./components/Input/Json').default)
        Vue.component("QSecret", require('./components/Input/Secret').default)
        Vue.component("QSelect", require('./components/Input/Select').default)
        Vue.component("QSwitch", require('./components/Input/Switch').default)
        Vue.component("QText", require('./components/Input/Text').default)
        Vue.component("QTextarea", require('./components/Input/Textarea').default)
        Vue.component("QMatrix", require('./components/Input/Matrix').default)
        Vue.component("QFile", require('./components/Input/File').default)
    }
};