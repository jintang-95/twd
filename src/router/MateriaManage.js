

let MateriaManage = {
    path: '/materiawhite',
    name: 'materiawhite',
    redirect: '/materiaType/index',
    meta: { title: '物料管理', icon: "icon-iconwuliaoguanli" },
    component: () => import("../Pages/MateriaManage/index.vue"),
    children: [
        {
            path: '/materiaType/brand',
            name: 'materiaType/brand',
            meta: { title: '品牌列表', },
            component: () => import("../Pages/MateriaManage/materiaType/brand.vue"),
        },
        {
            path: '/materiaType/index',
            name: 'materiaType/index',
            meta: { title: '物料分类', },
            component: () => import("../Pages/MateriaManage/materiaType/index.vue"),
        },
        {
            path: '/materiaType/archives',
            name: 'materiaType/archives',
            meta: { title: '物料档案', },
            component: () => import("../Pages/MateriaManage/materiaType/archives.vue"),
        }
    ]
}
export default MateriaManage