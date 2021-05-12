const Technology = {
    path: '/TechMagment',
    name: 'TechMagment',
    redirect: '/TechMagment/index',
    meta: { title: '技术管理', icon: "icon-iconjishuguanli" },
    component: () => import("../Pages/MateriaManage/index.vue"),
    children: [
        {
            path: '/TechMagment/techType/index',
            name: 'TechMagmentType',
            meta: { title: '技术分类', icon: "" },
            component: () => import("../Pages/TechMagment/techType/index.vue"),
        },
        {
            path: '/TechMagment/techList/index',
            name: 'TechMagmentList',
            meta: { title: '技术列表', icon: "" },
            component: () => import("../Pages/TechMagment/techList/index.vue"),
        }
    ]
}
export default Technology
