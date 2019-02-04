import { BaseAttribute } from './attributes/BaseAttribute'
import { BelongsToAttribute } from './attributes/BelongsToAttribute'
import { DateTimeAttribute } from './attributes/DateTimeAttribute'
import { IdAttribute } from './attributes/IdAttribute'
import { ImageAttribute } from './attributes/ImageAttribute'
import { SelectAttribute } from './attributes/SelectAttribute'
import { SwitchAttribute } from './attributes/SwitchAttribute'
import { UrlAttribute } from './attributes/UrlAttribute'

import { ResourceConfig } from './resources/ResourceConfig'
import { ResourceApi } from './api/ResourceApi'

import { container } from './services/container'
import { utils } from './mixins/utils'


import QResourceCreate from './components/Resource/Create'
import QResourceEdit from './components/Resource/Edit'
import QResourceIndex from './components/Resource/Index'
import QResourceRemove from './components/Resource/Remove'
import QResourceShow from './components/Resource/Show'

import QPageIndex from './components/Page/Index'
import QPageShow from './components/Page/Show'

import QShowJson from './components/Show/Json'
import QShowText from './components/Show/Text'

import QFormJson from './components/Form/FormJson'
import QFormHtml from './components/Form/FormHtml'

import QBelongsTo from './components/Input/BelongsTo'
import QHtml from './components/Input/Html'
import QYaml from './components/Input/Yaml'
import QDatetime from './components/Input/DateTime'
import QSecret from './components/Input/Secret'
import QSelect from './components/Input/Select'
import QSwitch from './components/Input/Switch'
import QText from './components/Input/Text'
import QTextarea from './components/Input/Textarea'

const LibraryModule = {
    Attributes: {
        Base: BaseAttribute,
        BelongsTo: BelongsToAttribute,
        DateTime: DateTimeAttribute,
        Id: IdAttribute,
        Image: ImageAttribute,
        Select: SelectAttribute,
        Switch: SwitchAttribute,
        Url: UrlAttribute,
    },
    ResourceConfig: ResourceConfig,
    ResourceApi: ResourceApi,
    container: container,
    mixins: {
        utils: utils,
    },
    install: function (Vue, options) {
        Vue.component("QResourceCreate", QResourceCreate)
        Vue.component("QResourceEdit", QResourceEdit)
        Vue.component("QResourceIndex", QResourceIndex)
        Vue.component("QResourceRemove", QResourceRemove)
        Vue.component("QResourceShow", QResourceShow)

        Vue.component("QPageIndex", QPageIndex)
        Vue.component("QPageShow", QPageShow)

        Vue.component("QShowJson", QShowJson)
        Vue.component("QShowText", QShowText)

        Vue.component("QFormJson", QFormJson)
        Vue.component("QFormHtml", QFormHtml)

        Vue.component("QBelongsTo", QBelongsTo)
        Vue.component("QHtml", QHtml)
        Vue.component("QYaml", QYaml)
        Vue.component("QDatetime", QDatetime)
        Vue.component("QSecret", QSecret)
        Vue.component("QSelect", QSelect)
        Vue.component("QSwitch", QSwitch)
        Vue.component("QText", QText)
        Vue.component("QTextarea", QTextarea)
    }
};

// Export library
export default LibraryModule;
