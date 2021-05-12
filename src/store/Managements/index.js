

let man = {
    state: {
        //Apply申领状态
        UpdateApplyStatusById:{},
        //报废状态
        UpdateUselessApplyStatusById :{},
        //调拨状态
        UpdateTransferApplyStatusById:{},
        //入库
        UpdateInStockStatus:{},
        //出库
        UpdateOutStockStatus:{},
        //表格单号
        CreateBillNOByBillTypeCode:{},
        // 仓储树
        GetWarehousesTree: {},
        // 仓储表格数据
        GetInStocks: {},
        // 获取入库单明细
        GetInStockById: {},
        // 删除入库单
        RemoveInStock: {},
        // 获取所有物料表格数据
        GetMateriels: {},
        // 根据Id获取物料数据
        GetMaterielById: {},
        // 保存/提交入库单
        SaveInStock: {},
        // 保存/提交入库物料上架单
        SaveInShelf: {},
        // 根据物料id获取单位
        GetUnitConvertsByMaterielId: {},
        //根据id获取单位
        GetUnitConvertById: {},
        // 根据id获取上架单
        GetInShelfById: {},
        // 获取上架单列表
        GetInShelfs: {},
        // 获取申领单表格数据
        GetApplys: {},
        // 获取物料明细
        GetApplyById:{},
        // 删除申领单
        RemoveApply: {},
        // 保存/提交申领单
        SaveApply: {},
        // 获取调拨表格数据
        GetTransferApplys: {},
        // 获取调拨物料明细
        GetTransferApplyById:{},
        // 保存/提交调拨单
        SaveTransferApply: {},
        // 删除调拨单
        RemoveTransferApply: {},
        // 获取出库单表格数据
        GetOutStocks: {},
        // 根据Id获取物料数据
        GetOutStockById: {},
        // 删除出库单
        RemoveOutStock: {},
        // 保存/提交出库单
        SaveOutStock: {},
        // 获取出库下架单
        GetOutShelfs: {},
        // 获取出库下架单明细
        GetOutShelfById:{},
        // 删除出库下架单
        RemoveOutShelf: {},
        // 保存/提交出库下架单
        SaveOutShelf: {},
        // 获取报废表格数据
        GetUselessApplys: {},
        // 获取物料明细
        GetUselessApplyById:{},
        // 保存/提交报废申请单
        SaveUselessApply: {},
        // 删除报废申请调拨单
        RemoveUselessApply: {},
        // 获取报废表格数据

    },
    mutations: {
    },
    actions: {

    }
}

export default man