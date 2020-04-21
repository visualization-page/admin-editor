import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/editor',
    name: 'editor',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
    children: [
      {
        path: ':dir',
        name: 'editor-edit',
        component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue')
      }
    ]
  },
  {
    path: '/project/list',
    name: 'project-list',
    component: () => import(/* webpackChunkName: "project" */ '../views/project/list.vue')
  },
  {
    path: '/suggest',
    name: 'suggest',
    component: () => import(/* webpackChunkName: "project" */ '../views/suggest.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
