const AssetManage = {
    path: '/AssetManage',
    name: 'AssetManage',
    redirect: '/AssetManage/index',
    meta: { title: '资产管理', icon: "icon-iconzichanguanli1" },
    component: () => import("../Pages/AssetManage/index.vue"),
    children: [
        {
            path: '/AssetManage/Index',
            name: 'Index',
            meta: { title: '资产分类' },
            component: () => import("../Pages/AssetManage/AssetType/index.vue"),
        },
       
        {
            path: '/AssetManage/list',
            name: 'list',
            meta: { title: '资产档案' },
            component: () => import("../Pages/AssetManage/AssetType/list.vue"),
        },
        {
            path: '/AssetManage/apply',
            name: 'apply',
            meta: { title: '资产申领' },
            component: () => import("../Pages/AssetManage/AssetType/apply.vue"),
        },
        {
            path: '/AssetManage/retire',
            name: 'retire',
            meta: { title: '资产报废' },
            component: () => import("../Pages/AssetManage/AssetType/retire.vue"),
        },
        // {
        //     path: '/AssetManage/retireexamine',
        //     name: 'retireexamine',
        //     meta: { title: '资产报废审核' },
        //     component: () => import("../Pages/AssetManage/AssetType/retireexamine.vue"),
        // },
       
        {
            path: '/AssetManage/addtype',
            name: 'addtype',
            meta: { title: '资产增加方式' },
            component: () => import("../Pages/AssetManage/AssetType/addtype.vue"),
        },
        {
            path: '/AssetManage/depreciation',
            name: 'depreciation',
            meta: { title: '资产折旧记录' },
            component: () => import("../Pages/AssetManage/AssetType/depreciation.vue"),
        },
        // {
        //     path: '/AssetManage/applyexamine',
        //     name: 'applyexamine',
        //     meta: { title: '资产申领审核' },
        //     component: () => import("../Pages/AssetManage/AssetType/applyexamine.vue"),
        // },
    ]
}
export default AssetManage