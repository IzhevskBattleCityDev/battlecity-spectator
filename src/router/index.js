import Vue from 'vue'
import Router from 'vue-router'
import Boards from '@/components/Boards'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Boards',
      component: Boards
    }
  ]
})
