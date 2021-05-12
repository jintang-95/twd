

let homePage = {
  path: '/homePage',
  name: 'homePage',
  meta: { title: '系统主页', icon: "icon-iconcangkuguanli" },
  component: () => import("../Pages/homePage/index.vue"),
  children: []
}
export default homePage
