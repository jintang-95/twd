

let materia = {
    state: {
        //申领审批
        GetApplyByNo: {},
        //报废审批
        GetUselessApplyByNo: {},
        // 物料分类
        GetMaterielCategoryTree: [],// 物料分类树形结构数据
        GetMaterielCategorys: [],// 物料分类表格数据
        CancelMaterielCategory: [],// 停用
        UnCancelMaterielCategory: [],
        RemoveMaterielCategory: [],
        SaveMaterielCategory: [],
        GetMaterielCategoryById: [],
        // 物料档案
        GetMateriels: [],
        SaveMateriel: [],
        GetMaterielById: [],
        CancelMateriel: [],
        UnCancelMateriel: [],
        RemoveMateriel: [],
        GetMaterielsByKeyWord: [],
        GetUnitConvertsByMaterielId: [], //根据物料Id获取单位
        // 仓库
        GetWarehouses: [],
        GetWarehousesTree: [],
        SaveWarehouse: [],
        RemoveWarehouse: [],
        UnCancelWarehouse: [],
        CancelWarehouse: [],
        GetWarehouseById: [],
        GetStockMonitorByWarehouseId: [],
        SaveStockMonitor: [],
        // 期初
        GetBeginPeriods: [],
        SaveBeginPeriod: [],
        RemoveBeginPeriod: [],
        GetBeginPeriodById: [],
        // 库存查询
        GetStocks: [],
        GetStockById: [],
        // 盘点
        GetInventoryPlans: [],
        GetInventoryPlans: [],
        RemoveInventoryPlan: [],
        GetInventoryPlanById: [],
        SaveInventoryPlan: [],
        UnCancelInventoryPlan: [],
        CancelInventoryPlan: [],
        // 获取盘点单
        GetInventorys: [],
        SaveInventory: [],
        RemoveInventory: [],
        DraftInventory: [],
        GetInventoryById: [],
        // 盘点明细
        GetInventoryInfoById: [],
        // 盘点调整
        GetAdjustments: [],
        SaveAdjustment: [],
        RemoveAdjustment: [],
        GetAdjustmentById: [],
        // 资产
        GetAssetsDetails: [],
        SaveAssetsDetail: [],
        CancelAssetsDetail: [],
        UnCancelAssetsDetail: [],
        RemoveAssetsDetail: [],
        // 品牌
        GetBrands: [],
        SaveBrand: [],
        RemoveBrand: [],
        CancelBrand: [],
        GetBrandById: [],
        UnCancelBrand: [],
    },
    mutations: {
        // 物料分类
        SET_MATERIALCATEGORY_TREE(state, list) {
            state.GetMaterielCategoryTree = list
        },
        SET_MATERIALCATEGORY(state, list) {
            state.GetMaterielCategorys = list
        },
        SET_CANCELMATERIELCATEGORY(state, list) {
            state.CancelMaterielCategory = list
        },
        SET_UNCANCELMATERIELCATEGORY(state, list) {
            state.UnCancelMaterielCategory = list
        },
        SET_REMOVEMATERIELCATEGORY(state, list) {
            state.CancelMaterielCategory = list
        },
        SET_SAVEMATERIELCATEGORY(state, list) {
            state.SaveMaterielCategory = list
        },
        SET_GETMATERIELCATEGORYBYID(state, list) {
            state.GetMaterielCategoryById = list
        },
        // 物料档案
        SET_GETMATERIELS(state, list) {
            state.GetMateriels = list
        },
        SET_SAVEMATERIEL(state, list) {
            state.SaveMateriel = list
        },
        SET_GETMATERIELBYID(state, list) {
            state.GetMaterielById = list
        },
        SET_CANCELMATERIEL(state, list) {
            state.CancelMateriel = list
        },
        SET_UNCANCELMATERIEL(state, list) {
            state.UnCancelMateriel = list
        },
        SET_REMOVEMATERIEL(state, list) {
            state.RemoveMateriel = list
        },
        SET_GETMATERIELSBYKEYWORD(state, list) {
            state.GetMaterielsByKeyWord = list
        },
        SET_GETUNITCONVERTSBYMATERIELID(state, list) {
            state.GetUnitConvertsByMaterielId = list
        },
        // 仓库
        SET_GETWAREHOUSES(state, list) {
            state.GetWarehouses = list
        },
        SET_GETWAREHOUSESTREE(state, list) {
            state.GetWarehousesTree = list
        },
        SET_SAVEWAREHOUSE(state, list) {
            state.SaveWarehouse = list
        },
        SET_REMOVEWAREHOUSE(state, list) {
            state.RemoveWarehouse = list
        },
        SET_REMOVEWAREHOUSE(state, list) {
            state.RemoveWarehouse = list
        },
        SET_UNCANCELWAREHOUSE(state, list) {
            state.UnCancelWarehouse = list
        },
        SET_CANCELWAREHOUSE(state, list) {
            state.CancelWarehouse = list
        },
        SET_GETWAREHOUSEBYID(state, list) {
            state.GetWarehouseById = list
        },
        SET_GETSTOCKMONITORBYID(state, list) {
            state.GetStockMonitorByWarehouseId = list
        },
        setSaveStockMonitor(state, list) {
            state.SaveStockMonitor = list
        },
        // 库存查询
        SET_GETSTOCKS(state, list) {
            state.GetStocks = list
        },
        SET_GETSTOCKBYID(state, list) {
            state.GetStockById = list
        },
        // 期初
        SET_GETBEGINPERIODS(state, list) {
            state.GetBeginPeriods = list
        },
        // 盘点
        SET_GETINVENTORYPLANS(state, list) {
            state.GetInventoryPlans = list
        },
        SET_REMOVEINVENTORYPLAN(state, list) {
            state.RemoveInventoryPlan = list
        },
        SET_GETINVENTORYPLANBYID(state, list) {
            state.GetInventoryPlanById = list
        },
        SET_SAVEINVENTORYPLAN(state, list) {
            state.SaveInventoryPlan = list
        },
        // 盘点录入
        SET_GETINVENTORYS(state, list) {
            state.GetInventorys = list
        },
        SET_SAVEINVENTORY(state, list) {
            state.SaveInventory = list
        },
        SET_REMOVEINVENTORY(state, list) {
            state.RemoveInventory = list
        },
        SET_DRAFTINVENTORY(state, list) {
            state.DraftInventory = list
        },
        SET_GETINVENTORYBYID(state, list) {
            state.GetInventoryById = list
        },
        SET_GETINVENTORYINFOBYID(state, list) {
            state.GetInventoryInfoById = list
        },
        // 盘点调整单
        SET_GETADJUSTMENTS(state, list) {
            state.GetAdjustments = list
        },
        SET_GETADJUSTMENTBYID(state, list) {
            state.GetAdjustmentById = list
        },
        SET_SAVEADJUSTMENT(state, list) {
            state.GetAdjustments = list
        },
        SET_REMOVEADJUSTMENT(state, list) {
            state.RemoveAdjustment = list
        },
        // 资产
        SET_REMOVEASSETSDETAIL(state, list) {
            state.RemoveAssetsDetail = list
        },
        SET_UNCANCELASSETSDETAIL(state, list) {
            state.UnCancelAssetsDetail = list
        },
        SET_CANCELASSETSDETAIL(state, list) {
            state.CancelAssetsDetail = list
        },
        SET_SAVEASSETSDETAIL(state, list) {
            state.SaveAssetsDetail = list
        },
        SET_GETASSETSDETAILS(state, list) {
            state.GetAssetsDetails = list
        },
        // 品牌
        SET_GETBRANDS() {
            state.GetBrands = list
        },
        SET_SAVEBRANDS() {
            state.SaveBrand = list
        },
        SET_REMOVEBRANDS() {
            state.RemoveBrand = list
        },
        SET_CANCELBRANDS() {
            state.CancelBrand = list
        },
        SET_GETBRANDSBYID() {
            state.GetBrandById = list
        },
        SET_UNCANCELBRANDS() {
            state.UnCancelBrand = list
        },
    },
    actions: {
        // 物料分类
        setMaterialCategoryTree({ commit }, list) {
            commit('SET_MATERIALCATEGORY_TREE', list)
        },
        setMaterialCategory({ commit }, list) {
            commit('SET_MATERIALCATEGORY', list)
        },
        setCancelMaterielCategory({ commit }, list) {
            commit('SET_CANCELMATERIELCATEGORY', list)
        },
        setUnCancelMaterielCategory({ commit }, list) {
            commit('SET_UNCANCELMATERIELCATEGORY', list)
        },
        setRemoveMaterielCategory({ commit }, list) {
            commit('SET_REMOVEMATERIELCATEGORY', list)
        },
        setSaveMaterielCategory({ commit }, list) {
            commit('SET_SAVEMATERIELCATEGORY', list)
        },
        setGetMaterielCategoryById({ commit }, list) {
            commit('SET_GETMATERIELCATEGORYBYID', list)
        },
        // 物料档案
        setGetMateriels({ commit }, list) {
            commit('SET_GETMATERIELS', list)
        },
        setGetMaterielsByKeyWord({ commit }, list) {
            commit('SET_GETMATERIELSBYKEYWORD', list)
        },
        setSaveMateriel({ commit }, list) {
            commit('SET_SAVEMATERIEL', list)
        },
        setGetMaterielById({ commit }, list) {
            commit('SET_GETMATERIELBYID', list)
        },
        setCancelMateriel({ commit }, list) {
            commit('SET_CANCELMATERIEL', list)
        },
        setUnCancelMateriel({ commit }, list) {
            commit('SET_UNCANCELMATERIEL', list)
        },
        setRemoveMateriel({ commit }, list) {
            commit('SET_REMOVEMATERIEL', list)
        },
        setGetUnitConvertsByMaterielId({ commit }, list) {
            commit('SET_GETUNITCONVERTSBYMATERIELID', list)
        },
        // 仓库
        setGetWarehouses({ commit }, list) {
            commit('SET_GETWAREHOUSES', list)
        },
        setGetWarehousesTree({ commit }, list) {
            commit('SET_GETWAREHOUSESTREE', list)
        },
        setSaveWarehouse({ commit }, list) {
            commit('SET_SAVEWAREHOUSE', list)
        },
        setRemoveWarehouse({ commit }, list) {
            commit('SET_REMOVEWAREHOUSE', list)
        },
        setUnCancelWarehouse({ commit }, list) {
            commit('SET_UNCANCELWAREHOUSE', list)
        },
        setCancelWarehouse({ commit }, list) {
            commit('SET_CANCELWAREHOUSE', list)
        },
        setGetWarehouseById({ commit }, list) {
            commit('SET_GETWAREHOUSEBYID', list)
        },
        setGetStockMonitorByWarehouseId({ commit }, list) {
            commit('SET_GETSTOCKMONITORBYID', list)
        },
        setSaveStockMonitor({ commit }, list) {
            commit('SET_SAVETOCKMONITOR', list)
        },
        // 期初
        setGetBeginPeriods({ commit }, list) {
            commit('SET_GETBEGINPERIODS', list)
        },
        setSaveBeginPeriod({ commit }, list) {
            commit('SET_SAVEBEGINPERIOD', list)
        },
        setRemoveBeginPeriod({ commit }, list) {
            commit('SET_REMOVEBEGINPERIOD', list)
        },
        setGetBeginPeriodById({ commit }, list) {
            commit('SET_GETBEGINPERIODBYID', list)
        },
        // 库存查询
        setGetStocks({ commit }, list) {
            commit('SET_GETSTOCKS', list)
        },
        setGetStockById({ commit }, list) {
            commit('SET_GETSTOCKBYID', list)
        },
        // 盘点
        setGetInventoryPlans({ commit }, list) {
            commit('SET_GETINVENTORYPLANS', list)
        },
        setRemoveInventoryPlan({ commit }, list) {
            commit('SET_REMOVEINVENTORYPLAN', list)
        },
        setGetInventoryPlanById({ commit }, list) {
            commit('SET_GETINVENTORYPLANBYID', list)
        },
        setSaveInventoryPlan({ commit }, list) {
            commit('SET_SAVEINVENTORYPLAN', list)
        },
        // 盘点录入单
        setGetInventorys({ commit }, list) {
            commit('SET_GETINVENTORYS', list)
        },
        setSaveInventory({ commit }, list) {
            commit('SET_SAVEINVENTORYS', list)
        },
        setRemoveInventory({ commit }, list) {
            commit('SET_REMOVEINVENTORYS', list)
        },
        setDraftInventory({ commit }, list) {
            commit('SET_DRAFTINVENTORYS', list)
        },
        setGetInventoryById({ commit }, list) {
            commit('SET_GETINVENTORYBYID', list)
        },
        // 盘点明细
        setGetInventoryInfoById({ commit }, list) {
            commit('SET_GETINVENTORYINFOBYID', list)
        },
        // 盘点调整
        setGetAdjustments({ commit }, list) {
            commit('SET_GETADJUSTMENTS', list)
        },
        setGetAdjustmentById({ commit }, list) {
            commit('SET_GETADJUSTMENTBYID', list)
        },
        setSaveAdjustment({ commit }, list) {
            commit('SET_SAVEADJUSTMENT', list)
        },
        setRemoveAdjustment({ commit }, list) {
            commit('SET_REMOVEADJUSTMENT', list)
        },
        // 资产
        setGetAssetsDetails({ commit }, list) {
            commit('SET_GETASSETSDETAILS', list)
        },
        setSaveAssetsDetail({ commit }, list) {
            commit('SET_SAVEASSETSDETAIL', list)
        },
        setCancelAssetsDetail({ commit }, list) {
            commit('SET_CANCELASSETSDETAIL', list)
        },
        setUnCancelAssetsDetail({ commit }, list) {
            commit('SET_UNCANCELASSETSDETAIL', list)
        },
        setRemoveAssetsDetail({ commit }, list) {
            commit('SET_REMOVEASSETSDETAIL', list)
        },
        //品牌
        GetBrands({ commit }, list) {
            commit('SET_GETBRANDS', list)
        },
        SETSAVEBRANDS({ commit }, list) {
            commit('SET_SAVEBRANDS', list)
        },
        SETREMOVEBRANDS({ commit }, list) {
            commit('SET_REMOVEBRANDS', list)
        },
        SETCANCELBRANDS({ commit }, list) {
            commit('SET_CANCELBRANDS', list)
        },
        SETGETBRANDSBYID({ commit }, list) {
            commit('SET_GETBRANDSBYID', list)
        },
        SETUNCANCELBRANDS({ commit }, list) {
            commit('SET_UNCANCELBRANDS', list)
        },
    }
}

export default materia