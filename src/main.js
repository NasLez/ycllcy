import Vue from 'vue'
import App from './App.vue'

// 完整引入，main.js写入以下代码
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import axios from 'axios';
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.withCredentials = true;//允许跨域携带cookie信息
new Vue({
  render: h => h(App),
}).$mount('#app')
