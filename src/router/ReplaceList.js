const ReplaceList = {
    path: '/ReplaceManage',
    name: 'ReplaceManage',
    redirect: '/ReplaceManage/index',
    meta: { title: '备件管理', icon: "icon-iconbeijianguanli" },
    component: () => import("../Pages/ReplaceManage/index.vue"),
    children: [
        {
            path: '/ReplaceManage/index',
            name: 'ReplaceManageIndex',
            meta: { title: '备件分类', },
            component: () => import("../Pages/ReplaceManage/ReplaceList/index.vue"),
        },
        {
            path: '/ReplaceManage/list',
            name: 'ReplaceManageList',
            meta: { title: '备件清单' },
            component: () => import("../Pages/ReplaceManage/ReplaceList/list.vue"),
        },
        // {
        //     path: '/ReplaceManage/list',
        //     name: 'ReplaceStockManage',
        //     meta: { title: '备件仓储管理', icon: "icon-yonghuguanli" },
        //     component: () => import("../Pages/ReplaceManage/index.vue"),
        //     children: [
        //         {
        //             path: '/ReplaceStockManage/stockset',
        //             name: 'ReplaceStockSet',
        //             meta: { title: '备件仓库设定', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ReplaceManage/ReplaceStockManage/StorageSet/index.vue"),
        //         },
        //         {
        //             path: '/ReplaceStockManage/monthBegin',
        //             name: 'ReplaceStockSet',
        //             meta: { title: '备件期初设置', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ReplaceManage/ReplaceStockManage/StorageSet/monthBegin.vue"),
        //         }
        //     ]
        // },
        // {
        //     path: '/ReplaceManage/list',
        //     name: 'ReplaceInventoryManage',
        //     meta: { title: '备件盘点管理', icon: "icon-yonghuguanli" },
        //     component: () => import("../Pages/ReplaceManage/index.vue"),
        //     children: [
        //         {
        //             path: '/ReplaceInventoryManage/plan',
        //             name: 'ReplaceInventory',
        //             meta: { title: '备件盘点计划', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ReplaceManage/InventoryManage/InventoryPlan.vue"),
        //         },
        //         {
        //             path: '/ReplaceInventoryManage/Write',
        //             name: 'ReplaceInventory',
        //             meta: { title: '备件盘点录入单', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ReplaceManage/InventoryManage/InventoryWrite.vue"),
        //         },
        //         {
        //             path: '/ReplaceInventoryManage/detail',
        //             name: 'ReplaceInventory',
        //             meta: { title: '备件盘点明细', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ReplaceManage/InventoryManage/InventoryDetail.vue"),
        //         },
        //         {
        //             path: '/ReplaceInventoryManage/adapter',
        //             name: 'ReplaceInventory',
        //             meta: { title: '备件盘盈盘亏调整单', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ReplaceManage/InventoryManage/InventoryAdapter.vue"),
        //         },
        //     ]
        // }
    ]
}

export default ReplaceList