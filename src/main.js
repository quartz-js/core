import Vue from 'vue'
import App from './App.vue'
import QuartzCore from './index'

import Vuetify from 'vuetify'
Vue.use(Vuetify)
Vue.use(QuartzCore)

Vue.config.productionTip = false

import 'vuetify/dist/vuetify.min.css'

require('@railken/quartz-core/assets/main.css')
require('@railken/quartz-core/assets/fluid.css')

new Vue({
  render: h => h(App),
}).$mount('#app')
