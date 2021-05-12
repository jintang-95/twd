const WorkOrder = {
    path: '/WorkManage',
    name: 'WorkManage',
    redirect: '/WorkManage/index',
    meta: { title: '工单中心', icon: "icon-icongongdanzhongxin" },
    component: () => import("../Pages/WorkManage/index.vue"),
    children: [
        {
            path: '/WorkManage/index',
            name: 'WorkManagemanage',
            meta: { title: '工单管理', icon: "" },
            component: () => import("../Pages/WorkManage/WorkOrder/index.vue"),
        },
        {
            path: '/WorkManage/list',
            name: 'WorkManageassign',
            meta: { title: '工单指派', icon: "" },
            component: () => import("../Pages/WorkManage/WorkOrder/list.vue"),
        },
        {
            path: '/WorkManage/order',
            name: 'WorkManageassign',
            meta: { title: '工单日志', icon: "" },
            component: () => import("../Pages/WorkManage/WorkOrder/order.vue"),
        }
    ]
}
export default WorkOrder
