

let Humanmanage = {
  path: '/Humanmanage',
  name: 'Humanmanage',
  redirect: '/Humanmanage/OrganizationalStructure/Organizationmaintenance',
  meta: { title: '人资管理', icon: "icon-iconrenziguanli" },
  component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/White.vue"),
  children: [
      {
          path: '/Humanmanage/OrganizationalStructure',
          name: 'Humanmanage/OrganizationalStructure',
          redirect: '/Humanmanage/OrganizationalStructure/Organizationmaintenance',
          meta: { title: '组织架构', icon: "" },
          component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/index.vue"),
          children:[
            {
                path: '/Humanmanage/OrganizationalStructure/Organizationmaintenance',
                name: 'Organizationmaintenance',
                meta: { title: '部门管理', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/OrganizationalStructure/Organizationmaintenance.vue"),
            },
            // {
            //     path: '/Humanmanage/OrganizationalStructure/Organizationmaintenancess',
            //     name: 'Organizationmaintenance',
            //     meta: { title: '组织维护', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/OrganizationalStructure/Organizationmaintenancess.vue"),
            // },
            {
                path: '/Humanmanage/OrganizationalStructure/Postmaintenance',
                name: 'Postmaintenance',
                meta: { title: '岗位管理', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/OrganizationalStructure/Postmaintenance.vue"),
            },
            // {
            //     path: '/Humanmanage/OrganizationalStructure/Postmaintenancess',
            //     name: 'Postmaintenance',
            //     meta: { title: '岗位维护', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/OrganizationalStructure/Postmaintenancess.vue"),
            // },
            {
                path: '/Humanmanage/OrganizationalStructure/Employeemaintenance',
                name: 'Employeemaintenance',
                meta: { title: '职员档案', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/OrganizationalStructure/Employeemaintenance.vue"),
            },
            // {
            //     path: '/Humanmanage/OrganizationalStructure/Employeemaintenancess',
            //     name: 'Employeemaintenance',
            //     meta: { title: '职员维护', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/OrganizationalStructure/Employeemaintenancess.vue"),
            // },
          ]
      },
      {
          path: '/Humanmanage/Personneltransfer',
          name: 'Personneltransfer',
          alwaysShow: true,
          meta: { title: '人事调动', icon: "" },
          redirect: '/Humanmanage/Personneltransfer/Transferapplication',
          component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/index.vue"),
          children:[
            {
                path: '/Humanmanage/Personneltransfer/Transferapplication',
                name: 'Transferapplication',
                meta: { title: '调动申请', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/Personneltransfer/Transferapplication.vue"),
            },
            // {
            //     path: '/Humanmanage/Personneltransfer/Transferapproval',
            //     name: 'Transferapproval',
            //     hide:true,
            //     meta: { title: '调动审批', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/Personneltransfer/Transferapproval.vue"),
            // },
          ]
      },
      {
          path: '/Humanmanage/WorkforceManagement',
          name: 'WorkforceManagement',
          redirect: '/Humanmanage/WorkforceManagement/Shiftdefinition',
          meta: { title: '排班管理', icon: "" },
          component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/index.vue"),
          children:[
            {
                path: '/Humanmanage/WorkforceManagement/Shiftdefinition',
                name: 'Shiftdefinition',
                meta: { title: '班次定义', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/WorkforceManagement/Shiftdefinition.vue"),
            },
            {
                path: '/Humanmanage/WorkforceManagement/holidaydefin',
                name: 'holidaydefin',
                meta: { title: '假日定义', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/WorkforceManagement/holidaydefin.vue"),
            },
            // {
            //     path: '/Humanmanage/WorkforceManagement/Makeupclass',
            //     name: 'Makeupclass',
            //     meta: { title: '补班规则', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/WorkforceManagement/Makeupclass.vue"),
            // },
             // {
             //     path: '/Humanmanage/WorkforceManagement/Staffrostering',
             //     name: 'Staffrostering',
             //     meta: { title: '职员排班', icon: "" },
             //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/WorkforceManagement/Staffrostering.vue"),
             // },
            {
                path: '/Humanmanage/WorkforceManagement/Rosterrecord',
                name: 'Rosterrecord',
                meta: { title: '排班管理', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/WorkforceManagement/Rosterrecord.vue"),
            },
          ]
        },
        {
          path: '/Humanmanage/Attendancemanagement',
          name: 'Attendancemanagement',
          redirect:'/Humanmanage/Attendancemanagement/Staffattendance',
          meta: { title: '考勤管理', icon: "" },
          component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/index.vue"),
          children:[
            // {
            //     path: '/Humanmanage/Attendancemanagement/Staffattendance',
            //     name: 'Staffattendance',
            //     meta: { title: '职员考勤', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/Attendancemanagement/Staffattendance.vue"),
            // },
            {
                path: '/Humanmanage/Attendancemanagement/Attendancelist',
                name: 'Attendancelist',
                meta: { title: '考勤记录', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/Attendancemanagement/Attendancelist.vue"),
            },
            {
                path: '/Humanmanage/Attendancemanagement/Leaveapplication',
                name: 'Leaveapplication',
                meta: { title: "请假记录", icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/Attendancemanagement/Leaveapplication.vue"),
            },
            // {
            //     path: '/Humanmanage/Attendancemanagement/Leaveapproval',
            //     name: 'Leaveapproval',  
            //     hide:true,
            //     meta: { title: '请假审批', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/Attendancemanagement/Leaveapproval.vue"),
            // },
            // {
            //     path: '/Humanmanage/Attendancemanagement/Attendance',
            //     name: 'Attendance',  
            //     // hide:true,
            //     meta: { title: '考勤列表', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/Attendancemanagement/Attendance.vue"),
            // },
          ]
        },
        // {
        //   path: '/Humanmanage/statisticalanalysis',
        //   name: 'statisticalanalysis',
        //   redirect:'/Humanmanage/statisticalanalysis/statisticalanalysisq',
        //   meta: { title: '统计分析', icon: "icon-yonghuguanli" },
        //   component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/index.vue"),
        //   children:[
        //     {
        //       path: '/Humanmanage/statisticalanalysis/statisticalanalysisq',
        //       name: 'statisticalanalysisq',
        //       meta: { title: '统计分析', icon: "icon-yonghuguanli" },
        //       component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/statisticalanalysis/statisticalanalysis.vue"),
        //   },
        //     {
        //       path: '/Humanmanage/statisticalanalysis/Attendancestatistics',
        //       name: 'Attendancestatistics',
        //       meta: { title: '考勤率统计', icon: "icon-yonghuguanli" },
        //       component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Humanmanage/statisticalanalysis/Attendancestatistics.vue"),
        //   },
        //   ]
        // },
  ]
}
export default Humanmanage
