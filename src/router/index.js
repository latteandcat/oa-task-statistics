import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/user/tasklist'
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/components/layout/index'),
    children: [
      {
        path: 'tasklist',
        component: () => import('@/views/user/taskList'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
