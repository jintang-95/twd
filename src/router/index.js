import Vue from 'vue'
import Router from 'vue-router'
import homePage from "./homePage.js"
import Permission from "./Permission"
import Humanmanage from "./Humanmanage"
import PlanningTasks from "./PlanningTasks"
import ApprovalCenter from "./ApprovalCenter"
import Managements from "./Managements"
import MateriaManage from "./MateriaManage"
import Purchasingmanagement from "./Purchasingmanagement"
import ReplaceList from "./ReplaceList"
// import StockManage from "./stockManage"
import ToolManage from "./ToolManage"
import AssetManage from "./AssetManage"
import DeviceManage from './DeviceManage'
import DeviceOperation from './DeviceOperation'
import WorkOrder from "./WorkOrder"
import Technology from "./Technology"
import StatisticalCenter from "./StatisticalCenter"
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'login',
    component: () => import( /* webpackChunkName: "login" */ "../Pages/login.vue")
  },
  {
    path: '/register',
    name: 'register',
    component: () => import( /* webpackChunkName: "login" */ "../Pages/register.vue")
  },
  {
    path: '/home',
    name: 'home',
    component: () => import( /* webpackChunkName: "" */ "../Pages/home.vue"),
    children: [
    ]
  }
];
// //系统管理
 routes[2].children.push(homePage);
// //系统管理
 routes[2].children.push(Permission);
// //人资管理
routes[2].children.push(Humanmanage);
// //计划任务
 routes[2].children.push(PlanningTasks);
// //工单管理
 routes[2].children.push(WorkOrder);
// //审批中心
 routes[2].children.push(ApprovalCenter);
// //物料管理
 routes[2].children.push(MateriaManage);
// //备件管理
 routes[2].children.push(ReplaceList);
// //工具管理
 routes[2].children.push(ToolManage);
// //仓储管理
 routes[2].children.push(Managements);
//采购管理
 routes[2].children.push(Purchasingmanagement);
//资产管理
routes[2].children.push(AssetManage);
//设备管理
routes[2].children.push(DeviceManage);
//设备运维
routes[2].children.push(DeviceOperation);
// //技术管理
 routes[2].children.push(Technology);
// //统计中心
// routes[2].children.push(StatisticalCenter);
 
// routes[2].children.push(StockManage);

export default new Router({
  routes
})
