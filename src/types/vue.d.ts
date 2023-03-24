import VueRouter from 'vue-router'
import { Route } from 'vue-router'

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter,
    $route: Route,
    $message: any,
    $msgbox: any,
    $confirm: any,
    $pageDataModelEngine: any,
    $globalData: any
  }
}
