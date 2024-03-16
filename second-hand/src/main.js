import Vue from 'vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import '../src/assets/styles/index.css'

Vue.use(Element, { size: 'small', zIndex: 3000 })
Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
