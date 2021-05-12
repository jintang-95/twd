const DeviceOperation = {
    path: '/DeviceOperation',
    name: 'DeviceOperation',
    redirect: '/DeviceOperation/index',
    meta: { title: '设备运维', icon: "icon-gangweiweihu" },
    component: () => import("../Pages/DeviceOperation/index.vue"),
    children: [
      
        {
            path: '/DeviceOperation/OperationType/searchindex',
            name: 'OperationType/searchindex',
            meta: { title: '巡检线路'},
            component: () => import("../Pages/DeviceOperation/OperationType/searchindex.vue"),
        },
        {
            path: '/DeviceOperation/OperationType/workindex',
            name: 'OperationType/workindex',
            meta: { title: '停工列表'},
            component: () => import("../Pages/DeviceOperation/OperationType/workindex.vue"),
        }
        
    ]
}
export default DeviceOperation