
let ApprovalCenter = {
    path: '/approvalCenter',
    name: 'approvalCenter',
    redirect: '/approvalRecord/approvalByme',
    meta: { title: '审批管理', icon: "icon-iconshenpizhongxin" },
    component: () => import("../Pages/ApprovalCenter/index.vue"),
    children: [
        {
            path: '/approvalCenter/approvalByme',
            name: 'approvalCenter/approvalByme',
            meta: { title: '审批定义', icon: "" },
            component: () => import("../Pages/ApprovalCenter/ApprovalRecord/approvalByme.vue"),
        },
        {
            path: '/approvalCenter/approvalRecord',
            name: 'approvalCenter/approvalRecord',
            meta: { title: '审批记录', icon: "" },
            component: () => import("../Pages/ApprovalCenter/ApprovalRecord/ApprovalRecord.vue"),
        }
    ]
}
export default ApprovalCenter