import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'
// import nprogress from 'nprogress'
// import 'nprogress/nprogress.css'
Vue.use(VueRouter)
const flag = true
/// 路由
const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName:'login' */ '@/views/login/index.vue')

  }, {
    path: '/',
    component: Layout,
    children: [
      {
        path: '', /// 默认子路由
        name: 'home',
        component: () => import(/* webpackChunkName:'home' */ '@/views/home/index.vue'), // 打包的时候，生成的模块名叫home,可以方便调试那个模块有错误
        meta: { requiresAuth: flag }/// 路由元信息
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName:'advert' */ '@/views/advert/index.vue'),
        meta: { requiresAuth: flag }/// 路由元信息
      }, {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName:'advert-space' */ '@/views/advert-space/index.vue'),
        meta: { requiresAuth: flag }/// 路由元信息
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName:'course' */ '@/views/course/index.vue'),
        meta: { requiresAuth: flag }/// 路由元信息
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName:'user' */ '@/views/user/index.vue'),
        meta: { requiresAuth: flag }/// 路由元信息
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName:'menu' */ '@/views/menu/index.vue'),
        meta: { requiresAuth: flag }/// 路由元信息
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName:'role' */ '@/views/role/index.vue'),
        meta: { requiresAuth: flag }/// 路由元信息
      }, {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName:'resource' */ '@/views/resource/index.vue'),
        meta: { requiresAuth: flag }/// 路由元信息
      }, {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName:'menu-create' */ '@/views/menu/create.vue'),
        meta: { requiresAuth: flag }/// 路由元信息
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue')
      }
    ]
  }, {
    path: '/*',
    name: '404',
    component: () => import(/* webpackChunkName:'404' */ '@/views/error-page/404.vue')
  }

]

const router = new VueRouter({
  routes
})
// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  // nprogress.start()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      return next({
        name: 'login',
        query: { // 通过 url 传递查询字符串参数
          redirect: to.fullPath // 把登录成功需要返回的页面告诉登录页面
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
router.afterEach(() => {
  // nprogress.store()
})
export default router
