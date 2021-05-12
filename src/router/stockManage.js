const stockManage = {
    path: '/StockManage',
    name: 'StockManage',
    redirect: '/StockManage/index',
    meta: { title: '仓储管理', icon: "icon-yonghuguanli" },
    component: () => import("../Pages/StockManage/index.vue"),
    children: [
        {
            path: '/StockManage/index',
            name: 'StockManageIndex',
            meta: { title: '仓库设定', icon: "icon-yonghuguanli" },
            component: () => import("../Pages/StockManage/StorageSet/index.vue"),
        },
        {
            path: '/StockManage/list',
            name: 'StockManageMonthBegin',
            meta: { title: '期初设置', icon: "icon-yonghuguanli" },
            component: () => import("../Pages/StockManage/StorageSet/monthBegin.vue"),
        },
        {
            path: '/StockManage/stockWatch',
            name: 'StockManageStockWatch',
            meta: { title: '库存查询', icon: "icon-yonghuguanli" },
            component: () => import("../Pages/StockManage/StorageSet/stockQuery.vue"),
        },
        {
            path: '/StockManage/Inventory',
            name: 'StockManageInventory',
            meta: { title: '盘点管理', icon: "icon-yonghuguanli" },
            component: () => import("../Pages/StockManage/index.vue"),
            children: [
                {
                    path: '/StockManage/InventoryManage/plan',
                    name: 'stockInventoryPlan',
                    meta: { title: '盘点计划', icon: "icon-yonghuguanli" },
                    component: () => import("../Pages/StockManage/InventoryManage/InventoryPlan.vue"),
                },
                {
                    path: '/StockManage/InventoryManage/write',
                    name: 'stockInventoryWrite',
                    meta: { title: '盘点录入单', icon: "icon-yonghuguanli" },
                    component: () => import("../Pages/StockManage/InventoryManage/InventoryWrite.vue"),
                },
                {
                    path: '/StockManage/InventoryManage/detail',
                    name: 'stockInventoryDetail',
                    meta: { title: '盘点明细', icon: "icon-yonghuguanli" },
                    component: () => import("../Pages/StockManage/InventoryManage/InventoryDetail.vue"),
                },
                {
                    path: '/StockManage/InventoryManage/adapter',
                    name: 'stockInventoryAdapter',
                    meta: { title: '盘盈盘亏调整单', icon: "icon-yonghuguanli" },
                    component: () => import("../Pages/StockManage/InventoryManage/InventoryAdapter.vue"),
                }
            ]
        }
    ]
}
export default stockManage