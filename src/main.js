import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios';
import {MessageBox} from 'element-ui'
import ZkTable from 'vue-table-with-tree-grid'

axios.defaults.baseURL = '/api/v1.0';

// 请求拦截器
axios.interceptors.request.use((config) => {
    config.headers.authorization = 'Bearer ' + window.sessionStorage.getItem('token');
    return config
});
// 响应信息拦截
axios.interceptors.response.use((response) => {
    if (response.data.code === 401) {
        MessageBox.alert('登录信息超时，请重新登录！', '登录超时', {
            confirmButtonText: '跳转登录页面', callback: action => {
                window.location.href = '/login'
            }
        });

    }
    return response
});
Vue.prototype.$http = axios; //将axios挂载到http上， 可以通过this.http 直接访问

Vue.config.productionTip = false;
Vue.component('tree-table', ZkTable);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
