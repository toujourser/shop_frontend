import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8081/api/v1.0';
Vue.prototype.$http = axios; //将axios挂载到http上， 可以通过this.http 直接访问

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
