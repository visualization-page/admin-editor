import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "editor_v2" */ '../views/home.vue')
  },
  // {
  //   path: '/editor',
  //   name: 'editor',
  //   component: () => import(/* webpackChunkName: "editor" */ '../views/editor/index.vue'),
  //   children: [
  //     {
  //       path: ':dir',
  //       name: 'editor-edit-dev',
  //       component: () => import(/* webpackChunkName: "editor" */ '../views/editor/index.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/editor-sample/:dir',
  //   name: 'editor-edit-sample',
  //   component: () => import(/* webpackChunkName: "editor" */ '../views/editor/sample.vue')
  // },
  {
    path: '/project/list',
    name: 'project-list',
    component: () => import(/* webpackChunkName: "project" */ '../views/project/list.vue')
  },
  {
    path: '/suggest',
    name: 'suggest',
    component: () => import(/* webpackChunkName: "project" */ '../views/suggest.vue')
  },
  {
    path: '/v2/editor/:dir',
    name: 'editor_v2',
    component: () => import(/* webpackChunkName: "editor_v2" */ '../views/v2/editor.vue')
  },
  {
    path: '/mock',
    name: 'mock',
    component: () => import(/* webpackChunkName: "mock" */ '../views/mock/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
