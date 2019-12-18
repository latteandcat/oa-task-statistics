import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/tasklist'
  },
  {
    path: '/tasklist',
    name: 'tasklist',
    component: () => import('../views/taskList.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/adminTaskList.vue')
  },
  {
    path: '/tasklistByName',
    name: 'tasklistByName',
    component: () => import('../views/taskListByName.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
