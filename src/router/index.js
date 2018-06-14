import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import addList from '@/components/addList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/addList',
      name: 'addList',
      component: addList
    },
  ]
})
