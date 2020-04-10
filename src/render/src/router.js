import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('./index.vue')
  },
  {
    path: '/project/:dir',
    component: () => import('./index.vue')
  },
  {
    path: '/page/:dir/:id',
    name: 'page',
    component: () => import(/* webpackChunkName: "page" */ './page.vue')
  },
  {
    path: '*',
    component: () => import('./404.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  Vue.prototype.$native.noMenu()
  next()
})

export default router
