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
  {path:'/' ,redirect:'/login'},
  {
    path: '/login',
    component: login
  },
{
  path: '/home',
  component: home,
  children:[
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
},
]

const router = new VueRouter({
  routes
})
//全局前置路由守卫————初始化的时候被调用、每次路由切换之前被调用
router.beforeEach((to, from, next) => {
  if(to.path==='/login'){
   return next();
  }
  const token=window.sessionStorage.getItem('token');
 
   //普通用户路由守卫
   if(!token){
     return next('/login');
   }else{
     return next();
   }
  
 })
export default router
