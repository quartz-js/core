
import Vue from 'vue'
import App from './app.vue'
import router from './router.js'
import VueResource from 'vue-resource'
Vue.config.debug = true;
Vue.use(VueResource)
Vue.http.options.emulateHTTP = true
new Vue({
  router,
  el: '#appIndex',
  render: h => h(App)
})
