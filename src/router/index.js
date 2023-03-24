import Vue from 'vue'
import Router from 'vue-router'

// import Home from '../home/Home.vue'
// import mobileDesign from '../home/mobile-design.vue'
// import projectDesign from './project-design.vue'
import projectDesign from '@/views/project-design/new-ui-index'
import thirdAuthPage from '@/views/project-design/third-auth-page'
import LanguageView from './LanguageView.vue'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/project/all/index'
  }, {
    path: '/project/all',
    component: Layout,
    permissionSetting: 'apply_setting',
    meta: { title: '全部项目', icon: 'iconproject' },
    children: [
      {
        path: 'index',
        name: 'index',
        permissionSetting: 'apply_setting',
        component: () => import('@/views/main_new_ui.vue'/* webpackChunkName: "project-all" */),
        meta: { title: '全部项目', icon: 'iconproject' }
      }
    ]
  },
  {
    path: '/auth/page',
    component: thirdAuthPage,
    hidden: true,
   
  },
  // 不在侧边栏展示的路由
  {
    path: '/design/:lang',
    component: LanguageView,
    permissionSetting: 'apply_setting',
    // meta: { title: '页面设计', icon: 'iconzhanshi' },
    hidden: true,
    children: [
      {
        path: '',
        name: 'index',
        permissionSetting: 'apply_setting',
        component: projectDesign,
        meta: { title: '页面设计', icon: 'iconzhanshi' }
      }
    ]
  }, {
    path: '/downCommentDetail',
    component: () => import('@/views/project-design/dowmComment/index'/* webpackChunkName: "login-index" */),
    // permissionSetting: 'apply_setting',
    hidden: true
  }, {
    path: '/downApplyDetail',
    component: () => import('@/views/project-design/dowmApply/index'/* webpackChunkName: "login-index" */),
    // permissionSetting: 'apply_setting',
    hidden: true
  }, {
    path: '/login',
    component: () => import('@/views/login/index'/* webpackChunkName: "login-index" */),
    hidden: true,
    meta: { title: '登录' }
  }, {
    path: '/user',
    component: Layout,
    permissionSetting: 'apply_setting',
    meta: { title: '用户管理', icon: 'iconuser' },
    // hidden: true,
    children: [
      {
        path: 'list',
        name: 'list',      
        permissionSetting: 'apply_setting',
        component: () => import('@/views/user/index'/* webpackChunkName: "report-index" */),
        meta: { title: '用户管理', icon: 'iconuser' }
      }
    ]
  },  {
    path: '/controlBorder',
    name:'controlBorder',
    component: Layout,
    permissionSetting: 'apply_setting',
    meta: { title: '控制台'},
    // hidden: true,
    children: [
      {
        path: '',
        name: 'index',
        permissionSetting: 'apply_setting',
        component: () => import('@/views/control-border/index'/* webpackChunkName: "report-index" */),
        meta: { title: '控制台', icon: 'iconuser' }
      }
    ]
  }, 
  {
    path: '/project/user',
    component: Layout,
    permissionSetting: 'apply_setting',
    meta: { title: '用户管理'},
    // hidden: true,
    children: [
      {
        path: '',
        name: 'index',
        permissionSetting: 'apply_setting',
        component: () => import('@/views/project-user/index'/* webpackChunkName: "report-index" */),
        meta: { title: '用户管理', icon: 'iconuser' }
      }
    ]
  }, {
    path: '/project/role',
    component: Layout,
    permissionSetting: 'apply_setting',
    meta: { title: '角色管理'},
    // hidden: true,
    children: [
      {
        path: '',
        name: 'index',
        permissionSetting: 'apply_setting',
        component: () => import('@/views/project-role/index'/* webpackChunkName: "report-index" */),
        meta: { title: '角色管理', icon: 'iconuser' }
      }
    ]
  }, 
  // {
  //   path: '/role',
  //   component: Layout,
  //   permissionSetting: 'apply_setting',
  //   meta: { title: '角色管理', icon: 'iconrole',img:'role' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'list',
  //       hidden: true,
  //       permissionSetting: 'apply_setting',
  //       component: () => import('@/views/role/index'/* webpackChunkName: "report-index" */),
  //       meta: { title: '角色管理', icon: 'iconrole' }
  //     }
  //   ]
  // },
  {
    path: '/application',
    component: Layout,
    hidden: true,
    permissionSetting: 'apply_setting',
    meta: { title: '应用市场', icon: 'iconzhanshi' },
    children: [
      {
        path: 'market',
        name: 'market',
        permissionSetting: 'apply_setting',
        component: () => import('@/views/applicationMarket/index'/* webpackChunkName: "report-index" */),
        meta: { title: '应用市场', icon: 'iconzhanshi' }
      }
    ]
  },
  // {
  //   path: '/report',
  //   component: Layout,
  //   permissionSetting: 'apply_setting',
  //   meta: { title: '页面', icon: 'iconzhanshi' },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'list',
  //       permissionSetting: 'apply_setting',
  //       component: () => import('@/views/report/index'/* webpackChunkName: "report-index" */),
  //       meta: { title: '页面', icon: 'iconzhanshi' }
  //     }
  //   ]
  // }, {
  //   path: '/process',
  //   component: Layout,
  //   permissionSetting: 'apply_setting',
  //   meta: { title: '接口', icon: 'iconliuchengshuoming' },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'list',
  //       permissionSetting: 'apply_setting',
  //       component: () => import('@/views/process/index'/* webpackChunkName: "process-index" */),
  //       meta: { title: '接口', icon: 'iconliuchengshuoming' }
  //     }
  //   ]
  // }, {
  //   path: '/datasets',
  //   component: Layout,
  //   redirect: '/datasets/list',
  //   name: 'datasets',
  //   permissionSetting: 'apply_setting',
  //   meta: { title: '数据', icon: 'iconshujuji' },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'list',
  //       permissionSetting: 'apply_setting',
  //       component: () => import('@/views/datasets/index'/* webpackChunkName: "datasets-index" */),
  //       meta: { title: '数据', icon: 'iconshujuji' }
  //     }, {
  //       path: 'config',
  //       name: 'config',
  //       hidden: true,
  //       component: () => import('@/views/datasets/config.vue'/* webpackChunkName: "datasets-config" */),
  //       meta: { title: '配置', icon: 'iconshujuji' }
  //     }, {
  //       path: 'define',
  //       name: 'define',
  //       hidden: true,
  //       component: () => import('@/views/datasets/define'/* webpackChunkName: "datasets-define" */),
  //       meta: { title: '数据定义', icon: 'iconshujuji' }
  //     }
  //   ]
  // }, {
  //   path: '/database',
  //   component: Layout,
  //   redirect: '/database/list',
  //   permissionSetting: 'apply_setting',
  //   meta: { title: '数据源', icon: 'icondataBase' },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'list',
  //       permissionSetting: 'apply_setting',
  //       component: () => import('@/views/database/index'/* webpackChunkName: "database-index" */),
  //       meta: { title: '数据源', icon: 'icondataBase' }
  //     }
  //   ]
  // }, {
  //   path: '/databaseInfo',
  //   name: 'databaseInfo',
  //   component: () => import('@/views/database/info/index'/* webpackChunkName: "database-info-index" */),
  //   meta: { title: '数据库信息', icon: 'iconshujuji' },
  //   hidden: true
  // }, {
  //   path: '/reportDesigner/:lang',
  //   // name: 'lang',
  //   // component: Layout,
  //   permissionSetting: 'apply_setting',
  //   component: LanguageView,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '',
  //       name: 'index',
  //       permissionSetting: 'apply_setting',
  //       component: Home,
  //       hidden: true,
  //       meta: { title: '图表设计器', icon: 'iconzhanshi' }
  //     }
  //   ]
  // }, {
  //   path: '/mobileDesign/:lang',
  //   permissionSetting: 'apply_setting',
  //   component: LanguageView,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '',
  //       name: 'index',
  //       permissionSetting: 'apply_setting',
  //       component: mobileDesign,
  //       hidden: true,
  //       meta: { title: '移动端设计器', icon: 'iconzhanshi' }
  //     }
  //   ]
  // }, {
  //   path: '/tableau',
  //   name: 'tableau',
  //   component: () => import('@/views/tableau/index'/* webpackChunkName: "tableau-index" */),
  //   meta: { title: '数据整理', icon: 'iconshujuji' },
  //   hidden: true
  // }, {
  //   path: '/codeEdit',
  //   name: 'codeEdit',
  //   component: () => import('@/views/process/edit-page'/* webpackChunkName: "process-edit" */),
  //   meta: { title: '数据加工', icon: 'iconliuchengshuoming' },
  //   hidden: true
  // }, {
  //   path: '/project/index',
  //   name: '/project/index',
  //   component: Layout,
  //   permissionSetting: 'apply_setting',
  //   meta: { title: '设置', icon: 'iconxinicon_huabanfuben' },
  //   hidden: true,
  //   children: [
  //     {
  //       path: '',
  //       name: '',
  //       hidden: true,
  //       permissionSetting: 'apply_setting',
  //       component: () => import('@/views/project/index'/* webpackChunkName: "project-index" */),
  //       meta: { title: '项目信息', icon: 'iconxinicon_huabanfuben' }
  //     },
  //     {
  //       path: 'homePageSet',
  //       name: 'homePageSet',
  //       hidden: true,
  //       permissionSetting: 'apply_setting',
  //       component: () => import('@/views/project/homePageSet'/* webpackChunkName: "project-index" */),
  //       meta: { title: '首页设置', icon: 'iconxinicon_huabanfuben' }
  //     },
  //     {
  //       path: 'menuSet',
  //       name: 'menuSet',
  //       hidden: true,
  //       permissionSetting: 'apply_setting',
  //       component: () => import('@/views/project/menuSet'/* webpackChunkName: "project-index" */),
  //       meta: { title: '菜单设置', icon: 'iconxinicon_huabanfuben' }
  //     }

  //   ]
  // },
  {
    path: '/404',
    component: () => import('@/views/error/404'/* webpackChunkName: "error-404" */),
    hidden: true
  }, { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
// module.export = router
