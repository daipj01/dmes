// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '../theme/index.css'
import store from './store'
import UI from './components/ui';
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)
Vue.use(scroll,{componentName: 'scroll-seamless'})
Vue.config.productionTip = false
Vue.use(UI);
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
