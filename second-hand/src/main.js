import Vue from 'vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import '../src/assets/styles/index.css'
import axios from 'axios'
// import request from '@/request.js'
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })
Vue.use(Element, { size: 'small', zIndex: 3000 })
Vue.config.productionTip = false
Vue.prototype.$http = axios
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
