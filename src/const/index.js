

/**
 * 
 * @param {*} 
 * fromComponent:表单控件
 * rules：表单校验规则
 * tabPane：标签页  content：标签页所对应的组件（动态）
 */
// 入库收货单   
let data = {
    fromdata: {
        fromComponent: [
            { key: 'No', type: "No", lable: "入库单号" },
            { key: 'InStockDate', type: "date", lable: "入库日期" },
            // {
            //     key: 'SourceTable', type: "select", lable: "源单类型",
            //     options: [{ label: "采购单", value: 0 }, { label: "调拨入库", value: 1 }, { label: "盘点入库", value: 2 }, { label: "退仓入库", value: 3 }, { label: "工具归还", value: 4 }, { label: "其他入库", value: 5 }]
            // },
            // { key: 'SourceTableNo', type: "string", lable: "源单编号" },
            //{ key: 'SupplierId', type: "string", lable: "送货单位" },
            //{ key: 'DeliveryPersonId', type: "string", lable: "送货人" },
            { key: 'DeliveryType', type: "select", lable: "送货方式", options: [{ label: "物流", value: "0" }] },
            { key: 'WarehouseId', type: "cascader", lable: "入库仓库", options: [{ label: "标准虚拟仓1", value: 1 }] },
            { key: 'CreatedUserName', type: "staff", lable: "收货人" },
            { key: 'CreatedTime', type: "time", lable: "收货时间" },
            { key: 'Remark', type: "remark", lable: "备注" },
        ],
        rules: {
            //'No': [{ required: true, message: '请输入入库单号', trigger: 'change' }],
            'InStockDate': [{ required: true, message: '请选择入库日期', trigger: 'change' }],
            'SourceTable': [{ required: true, message: '请选择源单类型', trigger: 'change' }],
            'SourceTableNo': [{ required: true, message: '请输入源单编号', trigger: 'change' }],
            //'SupplierId': [{ required: true, message: '请输入送货单位', trigger: 'change' }],
            //'DeliveryPersonId': [{ required: true, message: '请输入送货人', trigger: 'change' }],
            'DeliveryType': [{ required: true, message: '请选择送货方式', trigger: 'change' }],
            'WarehouseId': [{ required: true, message: '请选择入库仓库', trigger: 'change' }],
            //'CreatedUserName': [{ required: true, message: '请输入收货人', trigger: 'change' }],
            'CreatedTime': [{ required: true, message: '请输入收货时间', trigger: 'change' }],
            'Remark': []
        },
        tabPane: [{
            label: "| 入库明细", columns: [
                { title: "物料编码", key: "No" },
                { title: "物料名称", key: "Name" },
                { title: "规格", key: "Spec" },
                { title: "型号", key: "Model" },
                { title: "生产批次", key: "Batch" },
                { title: "数量", key: "Number" },
                { title: "单位", key: "UnitName" },
                { title: "单价", key: "Price" },
                { title: "金额", key: "Amount" },
                { title: "备注", key: "Remark" },
                { title: "操作", key: "asas" },
            ]
        }],
    },
    fromdataCG: {
        fromComponent: [
            { key: 'No', type: "No", lable: "入库单号" },
            { key: 'InStockDate', type: "date", lable: "入库日期" },
            {
                key: 'SourceTable', type: "select", lable: "源单类型",
                options: [{ label: "采购单", value: 0 }]
            },
            { key: 'SourceTableNo', type: "string", lable: "源单编号" },
            //{ key: 'SupplierId', type: "string", lable: "送货单位" },
            //{ key: 'DeliveryPersonId', type: "string", lable: "送货人" },
            { key: 'DeliveryType', type: "select", lable: "送货方式", options: [{ label: "物流", value: "0" }] },
            { key: 'WarehouseId', type: "cascader", lable: "入库仓库", options: [{ label: "标准虚拟仓1", value: 1 }] },
            // { key: 'CreatedUserName', type: "staff", lable: "收货人" },
            { key: 'CreatedTime', type: "time", lable: "收货时间" },
            { key: 'Remark', type: "remark", lable: "备注" },
        ],
        rules: {
            //'No': [{ required: true, message: '请输入入库单号', trigger: 'change' }],
            'InStockDate': [{ required: true, message: '请选择入库日期', trigger: 'change' }],
            'SourceTable': [{ required: true, message: '请选择源单类型', trigger: 'change' }],
            'SourceTableNo': [{ required: true, message: '请输入源单编号', trigger: 'change' }],
            //'SupplierId': [{ required: true, message: '请输入送货单位', trigger: 'change' }],
            //'DeliveryPersonId': [{ required: true, message: '请输入送货人', trigger: 'change' }],
            'DeliveryType': [{ required: true, message: '请选择送货方式', trigger: 'change' }],
            'WarehouseId': [{ required: true, message: '请选择入库仓库', trigger: 'change' }],
            //'CreatedUserName': [{ required: true, message: '请输入收货人', trigger: 'change' }],
            'CreatedTime': [{ required: true, message: '请输入收货时间', trigger: 'change' }],
            'Remark': []
        },
        tabPane: [{
            label: "| 入库明细", columns: [
                { title: "物料编码", key: "No" },
                { title: "物料名称", key: "Name" },
                { title: "规格", key: "Spec" },
                { title: "型号", key: "Model" },
                { title: "生产批次", key: "Batch" },
                { title: "数量", key: "Number" },
                { title: "单位", key: "UnitName" },
                { title: "单价", key: "Price" },
                { title: "金额", key: "Amount" },
                { title: "备注", key: "Remark" },
                { title: "操作", key: "asas" },
            ]
        }],
    },
    // 入库物料新增
    fromdata01: {
        fromComponent: [
            { key: 'MaterielId', type: "selectremote", lable: "物料名称", options: [] },
            { key: 'Batch', type: "string", lable: "生产批次" },
            { key: 'Number', type: "string", lable: "数量", inputType: 'number' },
            { key: 'UnitId', type: "select", lable: "单位", options: [] },
            { key: 'Price', type: "string", lable: "单价", inputType: 'number' },
            { key: 'Amount', type: "string", lable: "金额", readonly: true },
            { key: 'Remark', type: "remark", lable: "备注" },
        ],
        rules: {},
        tabPane: [],
    },
    // 入库物料上架单
    fromdata02: {
        fromComponent: [
            { key: 'No', type: "No", lable: "上架单号" },
            { key: 'InShelfDate', type: "date", lable: "上架日期" },
            { key: 'CreatedUser', type: "staff", lable: "上架人" },
            { key: 'CreatedTime', type: "time", lable: "上架时间" },
            { key: 'WarehouseId', type: "cascader", lable: "所属仓库", options: [{ label: "标准虚拟仓1", value: 1 }] },
            { key: 'Remark', type: "remark", lable: "备注" },
        ],
        rules: {
            //'No': [{ required: true, message: '请输入上架单号', trigger: 'change' }],
            'InShelfDate': [{ required: true, message: '请选择上架日期', trigger: 'change' }],
            'CreatedUser': [{ required: true, message: '请输入上架人', trigger: 'change' }],
            'CreatedTime': [{ required: true, message: '请选择上架时间', trigger: 'change' }],
            'WarehouseId': [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
            'Remark': []
        },
        tabPane: [{
            label: "| 上架明细", columns: [
                { title: "物料编码", key: "No" },
                { title: "物料名称", key: "Name" },
                { title: "规格", key: "Spec" },
                { title: "型号", key: "Model" },
                { title: "生产批次", key: "Batch" },
                { title: "数量", key: "Number", inputType: 'number' },
                { title: "单位", key: "StandardUnitId" },
                { title: "货架", key: "WarehouseId" },
                { title: "备注", key: "Remark" },
                { title: "操作", key: "asas" },
            ]
        }]
    },
    // 物料申领/审核
    fromdata03: {
        fromComponent: [
            { key: 'No', type: "No", lable: "单据编号" },
            { key: 'Dept', type: "Dept", lable: "申请部门" },
            { key: 'CreatedUser', type: "staff", lable: "申请人" },
            //{ key: 'Station', type: "select", lable: "当前岗位", options: [{ label: '普通职工', value: 0 }] },
            { key: 'Reason', type: "remark", lable: "申请原因" },
        ],
        rules: {
            //'No': [{ required: true, message: '请输入单据编号', trigger: 'change' }],
            'CreatedTime': [{ required: true, message: '请选择申请时间', trigger: 'change' }],
            'Dept': [{ required: true, message: '请选择申请部门', trigger: 'change' }],
           // 'CreatedUser': [{ required: true, message: '请输入申请人', trigger: 'change' }],
            'Station': [{ required: true, message: '请选择当前岗位', trigger: 'change' }],
            'Reason': [{ required: true, message: '请输入申请原因', trigger: 'change' }],
        },
        tabPane: [{
            label: "| 申领明细", columns: [
                { title: "物料编码", key: "No" },
                { title: "物料名称", key: "Name" },
                { title: "规格", key: "Spec" },
                { title: "型号", key: "Model" },
                { title: "数量", key: "Number" },
                { title: "单位", key: "StandardUnitId" },
                { title: "操作", key: "asas" },
            ]
        }]
    },
    // 出库
    fromdata04: {
        fromComponent: [
            { key: 'No', type: "No", lable: "出库单号" },
            { key: 'OutStockDate', type: "date", lable: "出库日期" },
            // {
            //     key: 'SourceTable', type: "select", lable: "源单类型",
            //     options: [{ label: "申领出库", value: 0 }, { label: "调拨出库", value: 1 }, { label: "盘点出库", value: 2 }, { label: "退货出库", value: 3 }, { label: "报废出库", value: 4 }, { label: "其他出库", value: 5 }]
            // },
            //{ key: 'SourceTableNo', type: "string", lable: "源单编号" },
            //{ key: 'SupplierId', type: "string", lable: "送货单位" },
            //{ key: 'DeliveryPersonId', type: "string", lable: "送货人" },
            { key: 'DeliveryType', type: "select", lable: "送货方式", options: [{ label: "物流", value: "0" }] },
            { key: 'WarehouseId', type: "cascader", lable: "出库仓库", options: [{ label: "标准虚拟仓1", value: 1 }] },
            { key: 'CreatedUserName', type: "staff", lable: "出库人" },
            { key: 'CreatedTime', type: "time", lable: "出库时间" },
            { key: 'Remark', type: "remark", lable: "备注" },
        ],
        rules: {
            //'No': [{ required: true, message: '请输入出库单号', trigger: 'change' }],
            'OutStockDate': [{ required: true, message: '请选择入库日期', trigger: 'change' }],
            'SourceTable': [{ required: true, message: '请选择源单类型', trigger: 'change' }],
            'SourceTableNo': [{ required: true, message: '请输入源单编号', trigger: 'change' }],
            //'SupplierId': [{ required: true, message: '请输入送货单位', trigger: 'change' }],
            //'DeliveryPersonId': [{ required: true, message: '请输入送货人', trigger: 'change' }],
            'DeliveryType': [{ required: true, message: '请选择送货方式', trigger: 'change' }],
            'WarehouseId': [{ required: true, message: '请选择出库仓库', trigger: 'change' }],
            //'CreatedUserName': [{ required: true, message: '请输入出库人', trigger: 'change' }],
            'CreatedTime': [{ required: true, message: '请输入出库时间', trigger: 'change' }],
            'Remark': []
        },
        tabPane: [{
            label: "| 出库明细", columns: [
                { title: "物料编码", key: "No" },
                { title: "物料名称", key: "Name" },
                { title: "规格", key: "Spec" },
                { title: "型号", key: "Model" },
                { title: "生产批次", key: "Batch" },
                { title: "数量", key: "Number" },
                { title: "单位", key: "StandardUnitId" },
                { title: "货架", key: "WarehouseId" },
                { title: "备注", key: "Remark" },
                { title: "操作", key: "asas" },
            ]
        }]
    },
    //出库源码
    fromdata4: {
        fromComponent: [
            { key: 'No', type: "No", lable: "出库单号" },
            { key: 'OutStockDate', type: "date", lable: "出库日期" },
            {
                key: 'SourceTable', type: "select", lable: "源单类型",
                options: [{ label: "申领出库", value: "0" }, { label: "调拨出库", value: "1" }, { label: "盘点出库", value: "2" }, { label: "退货出库", value: "3" }, { label: "报废出库", value: "4" }, { label: "其他出库", value: 5 }]
            },
            { key: 'SourceTableNo', type: "string", lable: "源单编号" },
            //{ key: 'SupplierId', type: "string", lable: "送货单位" },
            //{ key: 'DeliveryPersonId', type: "string", lable: "送货人" },
            { key: 'DeliveryType', type: "select", lable: "送货方式", options: [{ label: "物流", value: "0" }] },
            { key: 'WarehouseId', type: "cascader", lable: "出库仓库", options: [{ label: "标准虚拟仓1", value: 1 }] },
            { key: 'CreatedUserName', type: "staff", lable: "出库人" },
            { key: 'CreatedTime', type: "time", lable: "出库时间" },
            { key: 'Remark', type: "remark", lable: "备注" },
        ],
        rules: {
            //'No': [{ required: true, message: '请输入出库单号', trigger: 'change' }],
            'OutStockDate': [{ required: true, message: '请选择入库日期', trigger: 'change' }],
            'SourceTable': [{ required: true, message: '请选择源单类型', trigger: 'change' }],
            'SourceTableNo': [{ required: true, message: '请输入源单编号', trigger: 'change' }],
            //'SupplierId': [{ required: true, message: '请输入送货单位', trigger: 'change' }],
            //'DeliveryPersonId': [{ required: true, message: '请输入送货人', trigger: 'change' }],
            'DeliveryType': [{ required: true, message: '请选择送货方式', trigger: 'change' }],
            'WarehouseId': [{ required: true, message: '请选择出库仓库', trigger: 'change' }],
            //'CreatedUserName': [{ required: true, message: '请输入出库人', trigger: 'change' }],
            'CreatedTime': [{ required: true, message: '请输入出库时间', trigger: 'change' }],
            'Remark': []
        },
        tabPane: [{
            label: "| 出库明细", columns: [
                { title: "物料编码", key: "No" },
                { title: "物料名称", key: "Name" },
                { title: "规格", key: "Spec" },
                { title: "型号", key: "Model" },
                { title: "生产批次", key: "Batch" },
                { title: "数量", key: "Number" },
                { title: "单位", key: "StandardUnitId" },
                { title: "货架", key: "WarehouseId" },
                { title: "备注", key: "Remark" },
                { title: "操作", key: "asas" },
            ]
        }]
    },
    // 出库物料上架单
    fromdata05: {
        fromComponent: [
            { key: 'No', type: "No", lable: "下架单号" },
            { key: 'OutShelfDate', type: "date", lable: "下架日期" },
            { key: 'CreatedUser', type: "staff", lable: "下架人" },
            { key: 'CreatedTime', type: "time", lable: "下架时间" },
            { key: 'WarehouseId', type: "cascader", lable: "所属仓库", options: [{ label: "标准虚拟仓1", value: 1 }] },
            { key: 'Remark', type: "remark", lable: "备注" },
        ],
        rules: {
            //'No': [{ required: true, message: '请输入下架单号', trigger: 'change' }],
            'OutShelfDate': [{ required: true, message: '请选择下架日期', trigger: 'change' }],
            //'CreatedUser': [{ required: true, message: '请输入下架人', trigger: 'change' }],
            'CreatedTime': [{ required: true, message: '请选择下架时间', trigger: 'change' }],
            'WarehouseId': [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
            'Remark': []
        },
        tabPane: [{
            label: "| 下架明细", columns: [
                { title: "物料编码", key: "No" },
                { title: "物料名称", key: "Name" },
                { title: "规格", key: "Spec" },
                { title: "型号", key: "Model" },
                { title: "生产批次", key: "Batch" },
                { title: "数量", key: "Number", inputType: "number" },
                { title: "单位", key: "StandardUnitId" },
                { title: "货架", key: "WarehouseId" },
                { title: "备注", key: "Remark" },
                { title: "操作", key: "asas" },
            ]
        }]
    },
    // 报废申领/审核
    fromdata06: {
        fromComponent: [
            { key: 'No', type: "No", lable: "单据编号" },
            { key: 'CreatedTime', type: "date", lable: "申请时间" },
            { key: 'Mode', type: "select", lable: "报废方式", options: [{ label: '报废入仓', value: "0" }] },
            { key: 'Dept', type: "Dept", lable: "申请部门" },
            { key: 'CreatedUser', type: "staff", lable: "申请人" },
            //{ key: 'Station', type: "select", lable: "当前岗位", options: [{ label: '普通职工', value: 0 }] },
            { key: 'Reason', type: "remark", lable: "报废原因" },
        ],
        rules: {
            //'No': [{ required: true, message: '请输入单据编号', trigger: 'change' }],
            'CreatedTime': [{ required: true, message: '请选择申请时间', trigger: 'change' }],
            'Mode': [{ required: true, message: '请选择报废方式', trigger: 'change' }],
            'Dept': [{ required: true, message: '请选择申请部门', trigger: 'change' }],
            //'CreatedUser': [{ required: true, message: '请输入申请人', trigger: 'change' }],
            'Station': [{ required: true, message: '请选择当前岗位', trigger: 'change' }],
            'Reason': [],
        },
        tabPane: [{
            label: "| 物料明细", columns: [
                { title: "物料编码", key: "No" },
                { title: "物料名称", key: "Name" },
                { title: "规格", key: "Spec" },
                { title: "型号", key: "Model" },
                { title: "报废数量", key: "Number" },
                { title: "单位", key: "StandardUnitId" },
                { title: "操作", key: "asas" },
            ]
        }]
    },
    // 报废物料新增
    fromdata07: {
        fromComponent: [
            { key: 'MaterielId', type: "selectremote", lable: "物料名称", options: [] },
            { key: 'Number', type: "string", lable: "数量", inputType: 'number' },
            { key: 'UnitId', type: "select", lable: "单位", options: [] },
        ],
        rules: {},
        tabPane: [],
    },
    // 调拨申领/审核
    fromdata08: {
        fromComponent: [
            { key: 'No', type: "No", lable: "单据编号" },
            { key: 'Dept', type: "Dept", lable: "申请部门", options: [{ label: '采购部', value: 0 }] },
            { key: 'CreatedUser', type: "staff", lable: "申请人" },
            { key: 'InWarehouseId', type: "cascader", lable: "调入仓库", options: [{ label: '标准虚拟仓1', value: 0 }] },
            { key: 'OutWarehouseId', type: "cascader", lable: "调出仓库", options: [{ label: '整机产品仓', value: 1 }] },
            //{ key: 'Station', type: "select", lable: "当前岗位", options: [{ label: '普通职工', value: 0 }] },
            { key: 'Reason', type: "remark", lable: "申请原因" },
        ],
        rules: {
            //'No': [{ required: true, message: '请输入单据编号', trigger: 'change' }],
            'CreatedTime': [{ required: true, message: '请选择申请时间', trigger: 'change' }],
            'Dept': [{ required: true, message: '请选择申请部门', trigger: 'change' }],
            'InWarehouseId': [{ required: true, message: '请选择调入仓库', trigger: 'change' }],
            'OutWarehouseId': [{ required: true, message: '请选择调出仓库', trigger: 'change' }],
            //'CreatedUser': [{ required: true, message: '请输入申请人', trigger: 'change' }],
            'Station': [{ required: true, message: '请选择当前岗位', trigger: 'change' }],
            'Reason': [{ required: true, message: '请输入申请原因', trigger: 'change' }],
        },
        tabPane: [{
            label: "| 调拨明细", columns: [
                { title: "物料编码", key: "No" },
                { title: "物料名称", key: "Name" },
                { title: "规格", key: "Spec" },
                { title: "型号", key: "Model" },
                { title: "数量", key: "Number" },
                { title: "单位", key: "StandardUnitId" },
                { title: "操作", key: "asas" },
            ]
        }]
    },
}

export default data