import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "render-page" */ './index.vue')
  },
  {
    path: '/project/:dir',
    component: () => import(/* webpackChunkName: "render-page" */ './index.vue')
  },
  {
    path: '/page/:dir/:id',
    name: 'page',
    component: () => import(/* webpackChunkName: "render-page" */ './page.vue')
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "render-page" */ './404.vue')
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // Vue.prototype.$native.noMenu && Vue.prototype.$native.noMenu()
  next()
})

export default router
