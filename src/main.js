// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '../theme/index.css'
import store from './vuex/store'
import UI from './components/ui';
import scroll from 'vue-seamless-scroll'
import i18n from './i18n/i18n'
Vue.use(scroll)
Vue.use(scroll,{componentName: 'scroll-seamless'})
Vue.config.productionTip = false
Vue.use(UI);
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})
