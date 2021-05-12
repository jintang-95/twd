const PlanningTasks = {
    path: '/AssetManage',
    name: 'AssetManage',
    redirect: '/AssetManage/index',
    meta: { title: '计划任务', icon: "icon-iconjihuarenwu" },
    component: () => import("../Pages/AssetManage/index.vue"),
    children: [
        {
            path: '/PlaningTask/PlassClass/Assetplan',
            name: 'AssetInventoryManage',
            meta: { title: '计划分类', icon: "" },
            component: () => import("../Pages/PlaningTask/PlanClass/Assetplan.vue")
        },
        {
            path: '/PlaningTask/PlanWork/Program',
            name: 'AssetManageIndex',
            meta: { title: '工作计划', icon: "" },
            component: () => import("../Pages/PlaningTask/PlanWork/Program.vue"),
        },
        {
            path: '/PlaningTask/PlanTask/center',
            name: 'AssetManageIndex',
            meta: { title: '工作任务', icon: "" },
            component: () => import("../Pages/PlaningTask/PlanTask/center.vue"),
        },
        // {
        //     path: '/PlaningTask/PlanRecord/record',
        //     name: 'AssetManageIndex',
        //     meta: { title: '任务执行记录', icon: "" },
        //     component: () => import("../Pages/PlaningTask/PlanRecord/record.vue"),
        // }
    ]
}
export default PlanningTasks
