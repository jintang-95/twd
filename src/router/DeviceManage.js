const DeviceManage = {
    path: '/DeviceManage',
    name: 'DeviceManage',
    redirect: '/DeviceManage/index',
    meta: { title: '设备管理', icon: "icon-iconbeijianguanli1" },
    component: () => import("../Pages/DeviceManage/index.vue"),
    children: [
        {
            path: '/DeviceManage/Index',
            name: 'Index',
            meta: { title: '设备分类'},
            component: () => import("../Pages/DeviceManage/DeviceType/index.vue"),
        },
        {
            path: '/DeviceManage/list',
            name: 'list',
            meta: { title: '设备档案' },
            component: () => import("../Pages/DeviceManage/DeviceType/list.vue"),
        },
        // {
        //     path: '/DeviceManage/InventoryPlan',
        //     name: 'InventoryPlan',
        //     meta: { title: '设备盘点' },u
        //     component: () => import("../Pages/DeviceManage/DeviceType/InventoryPlan.vue"),
        // },

        // {
        //     path: '/DeviceManage/DeviceInventoryManage',
        //     name: 'DeviceInventoryManage',
        //     meta: { title: '设备盘点管理', icon: "icon-yonghuguanli" },
        //     component: () => import("../Pages/DeviceManage/index.vue"),
        //     children: [
        //         {
        //             path: '/DeviceManage/InventoryManage/DeviceInventoryPlan',
        //             name: 'DeviceInventoryPlan',
        //             meta: { title: '设备盘点计划', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/DeviceManage/InventoryManage/InventoryPlan.vue"),
        //         },
        //         {
        //             path: '/DeviceManage/InventoryManage/DeviceInventoryWrite',
        //             name: 'DeviceInventoryWrite',
        //             meta: { title: '设备盘点录入单', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/DeviceManage/InventoryManage/InventoryWrite.vue"),
        //         },
        //         {
        //             path: '/DeviceManage/InventoryManage/DeviceInventoryDetail',
        //             name: 'DeviceInventoryDetail',
        //             meta: { title: '设备盘点明细', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/DeviceManage/InventoryManage/InventoryDetail.vue"),
        //         },
        //         {
        //             path: '/DeviceManage/InventoryManage/DeviceInventoryAdapter',
        //             name: 'DeviceInventoryAdapter',
        //             meta: { title: '设备盘亏调整单', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/DeviceManage/InventoryManage/InventoryAdapter.vue"),
        //         }
        //     ]
        // },
        //  {
        //     path: '/DeviceManage/DeviceStatistics',
        //     name: 'DeviceStatistics',
        //     meta: { title: '统计分析', icon: "icon-yonghuguanli" },
        //     component: () => import("../Pages/DeviceManage/DeviceType/DeviceStatistics.vue"),
        // },        
    ]
}
export default DeviceManage