import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login.vue'
import home from '@/views/home.vue'
// import myInformation from '@/views/myInformation.vue'
import myInformation from '@/components/myInformation.vue'
Vue.use(VueRouter)

const routes = [
{
  path: '/home',
  component: home
},
{
  path: '/login',
  component: login
},
{
  path: '/myInformation',
  component: myInformation
}
]

const router = new VueRouter({
  routes
})

export default router
