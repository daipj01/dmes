import {NavList} from '../components/navlist'
window.document.addEventListener('touchstart', function (event) {
    /* Do Nothing */
  }, false);
  const install = function (Vue) {
    // Vue.component(Users.name, Users);
    // Vue.component(AssemblyOrder.name, AssemblyOrder);
    // Vue.component(Convention.name, Convention);
    // Vue.component(Proinfo.name, Proinfo);
    Vue.component(NavList.name, NavList);
  
  
    // Vue.prototype.$dialog = {
    //   confirm: Confirm,
    //   alert: Alert,
    //   toast: Toast,
    //   notify: Notify,
    //   loading: Loading,
    //   prompt: Prompt,
    // };
  };
  
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }
  export default {
    install
  };