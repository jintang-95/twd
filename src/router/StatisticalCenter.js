const StatisticalCenter = {
    path: '/AssetManage',
    name: 'AssetManage',
    redirect: '/AssetManage/index',
    meta: { title: '统计中心', icon: "icon-icontongjizhongxin" },
    component: () => import("../Pages/AssetManage/index.vue"),
    children: [
        {
            path: '/AssetManage/index',
            name: 'AssetManageIndex',
            meta: { title: '任务统计', icon: "" },
            component: () => import("../Pages/AssetManage/AssetType/index.vue"),
        },
        {
            path: '/AssetManage/list',
            name: 'AssetManageList',
            meta: { title: '考勤统计', icon: "" },
            component: () => import("../Pages/AssetManage/AssetType/list.vue"),
        }
    ]
}
export default StatisticalCenter
