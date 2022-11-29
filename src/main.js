import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import router from './router'
// 完整引入，main.js写入以下代码
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.withCredentials = true;//允许跨域携带cookie信息
new Vue({
  router,
  render:h=>h(App),
}).$mount('#app')
