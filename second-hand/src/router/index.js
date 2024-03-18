import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login.vue'
import home from '@/views/home.vue'

import myInformation from '@/components/myInformation.vue'
import modifyInfo from '@/components/modifyInfo.vue'
import modifyPassword from '@/components/modifyPassword.vue'
import goods from '@/components/goods.vue'
import twoHand from '@/components/twoHand.vue'
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
},
{
  path: '/modifyInfo',
  component: modifyInfo
},
{
  path: '/modifyPassword',
  component: modifyPassword
},
{
  path: '/goods',
  component: goods
},
{
  path: '/twoHand',
  component: twoHand
}
]

const router = new VueRouter({
  routes
})

export default router
