import Vue from "vue"
import Vuex from "vuex"
import ApprovalCenter from "./ApprovalCenter/index"
import Common from "./common/index"
import Managements from "./Managements/index"
import Permission from "./Permission/index"
import Purchasingmanagement from "./Purchasingmanagement/index"
import Humanmanage from "./Humanmanage/index"
import Materia from "./MateriaManage/index"
import getters from "./getters"
import DeviceManage from './DeviceManage/index'
import AssetManage from './AssetManage/index'
import Attendance from './Attendance/index'
import DeviceOperation from './DeviceOperation/index'
import Technology from './Technology/index.js'
import Kaoqin from './Kaoqin/index.js'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        ApprovalCenter,
        Common,
        Managements,
        Permission,
        Attendance,
        Purchasingmanagement,
        Humanmanage,
        Materia,
        DeviceManage,
        AssetManage,
        DeviceOperation,
        Technology,
        Kaoqin
    },
    getters
})
