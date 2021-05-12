
let Permission = {
  path: '/PermissionPages',
  name: 'PermissionPages',
  redirect: '/PermissionPages/Perpages/user',
  meta: { title: '系统管理', icon: "icon-iconxitongguanli" },
  component: () => import( /* webpackChunkName: "White" */ "../Pages/White.vue"),
  children: [
    {
      path: '/PermissionPages/Perpages',
      name: 'PermissionPages/Perpages',
      meta: { title: '用户权限', icon: "" },
      redirect: '/PermissionPages/Perpages/user',
      component: () => import( /* webpackChunkName: "PermissionPages" */ "../Pages/PermissionPages/index.vue"),
      children: [
        {
          path: '/PermissionPages/Perpages/user',
          name: 'user',
          meta: { title: '账户管理', icon: "" },
          component: () => import( /* webpackChunkName: "PermissionPages" */ "../Pages/PermissionPages/Perpages/user.vue"),
        },
        {
          path: '/PermissionPages/Perpages/role',
          name: 'role',
          meta: { title: '角色管理', icon: "" },
          component: () => import( /* webpackChunkName: "PermissionPages" */ "../Pages/PermissionPages/Perpages/role.vue")
        },
        {
          path: '/PermissionPages/Perpages/permission',
          name: 'permission',
          meta: { title: '权限维护', icon: "" },
          component: () => import( /* webpackChunkName: "PermissionPages" */ "../Pages/PermissionPages/Perpages/permission.vue"),
        }
      ]
    }, {
      path: '/PermissionPages/LogManage',
      name: 'PermissionPages/LogManage',
      redirect: '/PermissionPages/LogManage/nowlog',
      meta: { title: '日志管理', icon: "" },
      component: () => import( /* webpackChunkName: "PermissionPages" */ "../Pages/PermissionPages/index.vue"),
      children: [
        {
          path: '/PermissionPages/LogManage/nowlog',
          name: 'noelog',
          meta: { title: '操作日志', icon: "" },
          component: () => import( /* webpackChunkName: "PermissionPages" */ "../Pages/PermissionPages/LogManage/Nowlog.vue"),
        },
        {
          path: '/PermissionPages/LogManage/historylog',
          name: 'historylog',
          meta: { title: '错误日志', icon: "" },
          component: () => import( /* webpackChunkName: "PermissionPages" */ "../Pages/PermissionPages/LogManage/Historylog.vue")
        }
      ]
    },{
      path: '/PermissionPages/OrderSet',
      name: 'PermissionPages/OrderSet',
      meta: { title: '规则设置', icon: "" },
      // redirect: '/PermissionPages/Perpages/user',
      component: () => import( /* webpackChunkName: "PermissionPages" */ "../Pages/PermissionPages/index.vue"),
      children: [
        {
          path: '/PermissionPages/OrderSet/orderList',
          name: 'user',
          meta: { title: '单号规则', icon: "" },
          component: () => import( /* webpackChunkName: "PermissionPages" */ "../Pages/PermissionPages/OrderSet/orderList.vue"),
        }
      ]
    }

  ]
}

export default Permission
