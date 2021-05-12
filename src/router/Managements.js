

let Managements = {
    path: '/managewhite',
    name: 'managewhite',
    redirect: '/managewhite/input',
    meta: { title: '仓储管理', icon: "icon-iconcangkuguanli" },
    component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/index.vue"),
    children: [
        {path: '/StockManage',
        name: 'StockManage',
        redirect: '/StockManage/index',
        meta: { title: '仓库档案',  },
        component: () => import("../Pages/StockManage/index.vue"),
        children: [
            {
                path: '/StockManage/index',
                name: 'StockManageIndex',
                meta: { title: '仓库设定', },
                component: () => import("../Pages/StockManage/StorageSet/index.vue"),
            },
            {
                path: '/StockManage/list',
                name: 'StockManageMonthBegin',
                meta: { title: '期初设置', },
                component: () => import("../Pages/StockManage/StorageSet/monthBegin.vue"),
            },
            {
                path: '/StockManage/stockWatch',
                name: 'StockManageStockWatch',
                meta: { title: '库存查询',  },
                component: () => import("../Pages/StockManage/StorageSet/stockQuery.vue"),
            },]},
        {
            path: '/managewhite/input',
            name: 'managewhite/input',
            redirect: "/managewhite/input/receivingnot",
            meta: { title: '入库管理',  },
            component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/input/index.vue"),
            children: [{
                path: '/managewhite/input/receivingnot',
                name: 'managewhite/input/receivingnot',
                meta: { title: '入库收货单',  },
                component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/input/receivingnot.vue"),
            },
            // {
            //     path: '/managewhite/input/putawaynot',
            //     name: 'managewhite/input/putawaynot',
            //     meta: { title: '入库物料上架单', },
            //     component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/input/putawaynot.vue"),
            // },
            ]
        },
        {
            path: '/managewhite/output',
            name: 'managewhite/output',
            redirect: "/managewhite/output/receivingnot",
            meta: { title: '出库管理',  },
            component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/output/index.vue"),
            children: [{
                path: '/managewhite/output/receivingnot',
                name: 'managewhite/output/receivingnot',
                meta: { title: '出库单',  },
                component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/output/receivingnot.vue"),
            },
            // {
            //     path: '/managewhite/output/putawaynot',
            //     name: 'managewhite/output/putawaynot',
            //     meta: { title: '出库下架单',  },
            //     component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/output/putawaynot.vue"),
            // },
            ]
        },
        {
            path: '/managewhite/scrap',
            name: 'managewhite/scrap',
            redirect: "/managewhite/scrap/apply",
            meta: { title: '报废管理', },
            component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/scrap/index.vue"),
            children: [{
                path: '/managewhite/scrap/apply',
                name: 'managewhite/scrap/apply',
                meta: { title: '报废申请', },
                component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/scrap/apply.vue"),
            },
            // {
            //     path: '/managewhite/scrap/audit',
            //     name: 'managewhite/scrap/audit',
            //     meta: { title: '报废审核',  },
            //     component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/scrap/audit.vue"),
            // },
            ]
        },
        {
            path: '/managewhite/apply',
            name: 'managewhite/apply',
            redirect: "/managewhite/apply/apply",
            meta: { title: '申领管理', },
            component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/apply/index.vue"),
            children: [{
                path: '/managewhite/apply/apply',
                name: 'managewhite/apply/apply',
                meta: { title: '物料申领管理',  },
                component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/apply/apply.vue"),
            },
            // {
            //     path: '/managewhite/apply/audit',
            //     name: 'managewhite/apply/audit',
            //     meta: { title: '物料审核管理',  },
            //     component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/apply/audit.vue"),
            // },
            ]
        },
        {
            path: '/managewhite/allot',
            name: 'managewhite/allot',
            redirect: "/managewhite/allot/apply",
            meta: { title: '调拨管理',  },
            component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/allot/index.vue"),
            children: [{
                path: '/managewhite/allot/apply',
                name: 'managewhite/allot/apply',
                meta: { title: '调拨申请单', },
                component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/allot/apply.vue"),
            },
            // {
            //     path: '/managewhite/allot/audit',
            //     name: 'managewhite/allot/audit',
            //     meta: { title: '调拨审核单',},
            //     component: () => import( /* webpackChunkName: "manage" */ "../Pages/Managements/allot/audit.vue"),
            // },
            ]
        },
        
        // {
        //     path: '/StockManage/StorageSet',
        //     name: 'StockManageStorageSet',
        //     meta: { title: '仓库档案',  },
        //     component: () => import("../Pages/StockManage/StorageSet/index.vue"),
        //     children: [
        //         {
        //             path: '/StockManage/index',
        //             name: 'StockManageIndex',
        //             meta: { title: '仓库设定',  },
        //             component: () => import("../Pages/StockManage/StorageSet/index.vue"),
        //         },
        //         {
        //             path: '/StockManage/list',
        //             name: 'StockManageMonthBegin',
        //             meta: { title: '期初设置',  },
        //             component: () => import("../Pages/StockManage/StorageSet/monthBegin.vue"),
        //         },
        //         {
        //             path: '/StockManage/stockWatch',
        //             name: 'StockManageStockWatch',
        //             meta: { title: '库存查询',  },
        //             component: () => import("../Pages/StockManage/StorageSet/stockQuery.vue"),
        //         },
        //     ]
        // },
        // {
        //     path: '/StockManage/Inventory',
        //     name: 'StockManageInventory',
        //     meta: { title: '盘点管理',  },
        //     component: () => import("../Pages/StockManage/index.vue"),
        //     children: [
        //         {
        //             path: '/StockManage/InventoryManage/plan',
        //             name: 'stockInventoryPlan',
        //             meta: { title: '盘点计划',  },
        //             component: () => import("../Pages/StockManage/InventoryManage/InventoryPlan.vue"),
        //         },
        //         {
        //             path: '/StockManage/InventoryManage/write',
        //             name: 'stockInventoryWrite',
        //             meta: { title: '盘点录入单', },
        //             component: () => import("../Pages/StockManage/InventoryManage/InventoryWrite.vue"),
        //         },
        //         {
        //             path: '/StockManage/InventoryManage/detail',
        //             name: 'stockInventoryDetail',
        //             meta: { title: '盘点明细',},
        //             component: () => import("../Pages/StockManage/InventoryManage/InventoryDetail.vue"),
        //         },
        //         {
        //             path: '/StockManage/InventoryManage/adapter',
        //             name: 'stockInventoryAdapter',
        //             meta: { title: '盘盈盘亏调整单',  },
        //             component: () => import("../Pages/StockManage/InventoryManage/InventoryAdapter.vue"),
        //         }
        //     ]
        // }
    ]
}
export default Managements