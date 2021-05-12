
const show01 = function () {
    return {
        // 入库单表格头
        columns: [
            {
                title: "入库单编号",
                key: "No"
            },
            {
                title: "入库仓库",
                key: "WarehouseName"
            },
            {
                title: "类型",
                key: "Type"
            },
            {
                title: "收货人",
                key: "CreatedUserName"
            },
            {
                title: "入库时间",
                key: "CreatedTime"
            },
            {
                title: "描述",
                key: "Remark"
            },
            {
                title: "状态",
                key: "Status"
            },
            {
                title: "操作",
                key: "operation",
            }
        ],
        // 入库物料上架单表格头
        columns01: [
            {
                title: "上架单编号",
                key: "No"
            },
            {
                title: "类型",
                key: "Type"
            },
            {
                title: "所在仓库",
                key: "WarehouseName"
            },
            {
                title: "操作人",
                key: "CreatedUserName"
            },
            {
                title: "操作时间",
                key: "CreatedTime"
            },
            {
                title: "操作方式",
                key: "Status"
            },
            {
                title: "描述",
                key: "Remark"
            },
            {
                title: "操作",
                key: "operation",
            }
        ],
        // 申领申请单表格头
        columns02: [
            {
                title: "申领单号",
                key: "No"
            },
            {
                title: "申领人",
                key: "CreatedUserName"
            },
            {
                title: "所属部门",
                key: "Dept"
            },
            {
                title: "当前岗位",
                key: "Station"
            },
            {
                title: "申领时间",
                key: "CreatedTime"
            },
            {
                title: "申领原因",
                key: "Reason"
            },
            {
                title: "状态",
                key: "Status"
            },
            {
                title: "操作",
                key: "operation",
            }
        ],
        // 出库单表格头
        columns03: [
            {
                title: "出库单编号",
                key: "No"
            },
            {
                title: "类型",
                key: "Type"
            },
            {
                title: "出库仓库",
                key: "WarehouseName"
            },
            {
                title: "出货人",
                key: "CreatedUserName"
            },
            {
                title: "出库时间",
                key: "CreatedTime"
            },
            {
                title: "描述",
                key: "Remark"
            },
            {
                title: "状态",
                key: "Status"
            },
            {
                title: "操作",
                key: "operation",
            }
        ],
        // 入库物料上架单表格头
        columns04: [
            {
                title: "下架单编号",
                key: "No"
            },
            {
                title: "类型",
                key: "Status"
            },
            {
                title: "所在仓库",
                key: "WarehouseName"
            },
            {
                title: "操作人",
                key: "CreatedUserName"
            },
            {
                title: "操作时间",
                key: "CreatedTime"
            },
            {
                title: "操作方式",
                key: "CreatedTime"
            },
            {
                title: "描述",
                key: "Remark"
            },
            {
                title: "操作",
                key: "operation",
            }
        ],
         // 报废申请表格头
        columns05: [
            {
                title: "申请单号",
                key: "No"
            },
            {
                title: "申请人",
                key: "CreatedUserName"
            },
            {
                title: "所属部门",
                key: "Dept"
            },
            {
                title: "当前岗位",
                key: "Station"
            },
            {
                title: "申请时间",
                key: "CreatedTime"
            },
            {
                title: "报废原因",
                key: "Reason"
            },
            {
                title: "状态",
                key: "Status"
            },
            {
                title: "操作",
                key: "operation",
            }
        ],
    }
}

export default show01 