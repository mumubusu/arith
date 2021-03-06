import Vue from 'vue'
import Router from 'vue-router'
import Page from '@/components/page'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'page',
      component: Page
    }
  ]
})
