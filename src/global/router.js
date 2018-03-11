import Vue from 'vue'
import Router from 'vue-router'
import signin from '../views/signin/router'
// import home from '../views/home/router'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/signin'
    },
    // ...home
    ...signin
  ]
})