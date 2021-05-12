const ToolManage = {
    path: '/ToolManage',
    name: 'ToolManage',
    redirect: '/ToolManage/index',
    meta: { title: '工具管理', icon: "icon-icongongjuguanli" },
    component: () => import("../Pages/ToolManage/index.vue"),
    children: [
        {
            path: '/ToolManage/index',
            name: 'ToolManageIndex',
            meta: { title: '工具分类', },
            component: () => import("../Pages/ToolManage/ToolList/index.vue"),
        },
        {
            path: '/ToolManage/list',
            name: 'ToolManageList',
            meta: { title: '工具清单', },
            component: () => import("../Pages/ToolManage/ToolList/list.vue"),
        },
        // {
        //     path: '/ToolManage/list',
        //     name: 'ToolStockManage',
        //     meta: { title: '工具仓储管理', icon: "icon-yonghuguanli" },
        //     component: () => import("../Pages/ReplaceManage/index.vue"),
        //     children: [
        //         {
        //             path: '/ToolStockManage/stockset',
        //             name: 'ToolStockSet',
        //             meta: { title: '工具仓库设定', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ToolManage/ToolStockManage/StorageSet/index.vue"),
        //         },
        //         {
        //             path: '/ToolStockManage/monthBegin',
        //             name: 'ToolStockSet',
        //             meta: { title: '工具期初设置', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ToolManage/ToolStockManage/StorageSet/monthBegin.vue"),
        //         }
        //     ]
        // },
        // {
        //     path: '/ToolManage/list',
        //     name: 'ReplaceInventoryManage',
        //     meta: { title: '工具盘点管理', icon: "icon-yonghuguanli" },
        //     component: () => import("../Pages/ToolManage/index.vue"),
        //     children: [
        //         {
        //             path: '/ToolInventoryManage/plan',
        //             name: 'ToolInventory',
        //             meta: { title: '工具盘点计划', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ToolManage/InventoryManage/InventoryPlan.vue"),
        //         },
        //         {
        //             path: '/ToolInventoryManage/Write',
        //             name: 'ToolInventory',
        //             meta: { title: '工具盘点录入单', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ToolManage/InventoryManage/InventoryWrite.vue"),
        //         },
        //         {
        //             path: '/ToolInventoryManage/detail',
        //             name: 'ToolInventory',
        //             meta: { title: '工具盘点明细', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ToolManage/InventoryManage/InventoryDetail.vue"),
        //         },
        //         {
        //             path: '/ToolInventoryManage/adapter',
        //             name: 'ToolInventory',
        //             meta: { title: '工具盘盈盘亏调整单', icon: "icon-yonghuguanli" },
        //             component: () => import("../Pages/ToolManage/InventoryManage/InventoryAdapter.vue"),
        //         },
        //     ]
        // }
    ]
}

export default ToolManage