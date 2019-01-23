// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW'

import 'vue-loading-overlay/dist/vue-loading.css';
import Vue from 'vue';
import App from './App';
import router from './router';
import 'bootstrap';
import './bus';
import Currency from './filters/currency';
import Timestamps from './filters/timestamps';

Vue.use(VeeValidate, {
  events: 'input|blur',
});
VeeValidate.Validator.localize('zh_TW',zhTWValidate);

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;  //跨域登入用

Vue.component('Loading', Loading);
Vue.filter('currency', Currency);
Vue.filter('timestamps', Timestamps);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  
})
router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){  //如果這個頁面需驗證
    //執行驗證的api
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
      console.log(response.data);
      if(response.data.success){
          next();
        }else{
          next({
            path:'/login' //驗證沒通過則回到login頁面
          })
        }
    })
  }else{
    next();
  }
})
