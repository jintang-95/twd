let getters = {
  getPermission: state => state.Permission.Permissions,
  crums: state => state.Common.crums,
  Login: state => state.Permission.MNvalue.Login,
  QueryStaffByUId: state => state.Permission.MNvalue.QueryStaffByUId,
  //主页数据
  GetHomeData: state => state.Permission.MNvalue.GetHomeData,
  // 物料
  GetUselessApplyByNo: state => state.Materia.GetUselessApplyByNo,
  GetApplyByNo: state => state.Materia.GetApplyByNo,
  GetMaterielCategoryTree: state => state.Materia.GetMaterielCategoryTree,
  GetMaterielCategorys: state => state.Materia.GetMaterielCategorys,
  CancelMaterielCategory: state => state.Materia.CancelMaterielCategory,// 停用
  UnCancelMaterielCategory: state => state.Materia.UnCancelMaterielCategory,
  RemoveMaterielCategory: state => state.Materia.RemoveMaterielCategory,
  SaveMaterielCategory: state => state.Materia.SaveMaterielCategory,
  GetMaterielCategoryById: state => state.Materia.GetMaterielCategoryById,
  //
  RemoveStaffMoveById: state => state.Humanmanage.RemoveStaffMoveById,//表格数据
  UpdateStaffMoveStatus: state => state.Common.UpdateStaffMoveStatus,//表格数据


  // 审批管理
  GetTabledata: state => state.ApprovalCenter.ApprovalProcessGetList,//表格数据
  GetDialogData: state => state.ApprovalCenter.ApprovalProcessGetInfo,
  QueryOrganizationTree: state => state.Humanmanage.QueryOrganizationTree,
  QueryStaffByOrgId: state => state.ApprovalCenter.QueryStaffByOrgId,
  GetCardData: state => state.ApprovalCenter.ApprovalProcessGetOrderList,
  ApprovalProcessSend: state => state.ApprovalCenter.ApprovalProcessEdit,
  DeleteRecordNodes:state => state.ApprovalCenter.DeleteRecordNodes,//审核数据删除


  /*===================================仓储管理 =========================================*/
  UpdateInStockStatus: state => state.Managements.UpdateInStockStatus,
  UpdateOutStockStatus: state => state.Managements.UpdateOutStockStatus,
  CreateBillNOByBillTypeCode: state => state.Managements.CreateBillNOByBillTypeCode,
  WarehousesTree: state => state.Managements.GetWarehousesTree,
  InStocks: state => state.Managements.GetInStocks,
  GetInStockById: state => state.Managements.GetInStockById,
  Materiels: state => state.Managements.GetMateriels,
  MaterielById: state => state.Managements.GetMaterielById,
  UnitConvertsByMaterielId: state => state.Managements.GetUnitConvertsByMaterielId,
  UnitConvertById: state => state.Managements.GetUnitConvertById,
  InShelfById: state => state.Managements.GetInShelfById,
  InShelfs: state => state.Managements.GetInShelfs,
  removeInStock: state => state.Managements.RemoveInStock,
  saveInStock: state => state.Managements.SaveInStock,
  saveInShelf: state => state.Managements.SaveInShelf,
  getApplys: state => state.Managements.GetApplys,
  ApplyById: state => state.Managements.GetApplyById,
  removeApply: state => state.Managements.RemoveApply,
  saveApply: state => state.Managements.SaveApply,
  transferApplys: state => state.Managements.GetTransferApplys,
  transferApplyById: state => state.Managements.GetTransferApplyById,
  saveTransferApply: state => state.Managements.SaveTransferApply,
  removeTransferApply: state => state.Managements.RemoveTransferApply,
  OutStocks: state => state.Managements.GetOutStocks,
  OutStockById: state => state.Managements.GetOutStockById,
  removeOutStock: state => state.Managements.RemoveOutStock,
  saveOutStock: state => state.Managements.SaveOutStock,
  OutShelfs: state => state.Managements.GetOutShelfs,
  OutShelfById: state => state.Managements.GetOutShelfById,
  removeOutShelf: state => state.Managements.RemoveOutShelf,
  saveOutShelf: state => state.Managements.SaveOutShelf,
  UselessApplys: state => state.Managements.GetUselessApplys,
  UselessApplyById: state => state.Managements.GetUselessApplyById,
  saveUselessApply: state => state.Managements.SaveUselessApply,
  removeUselessApply: state => state.Managements.RemoveUselessApply,

  /*===================================仓储管理 =========================================*/
  CreateBillNOByBillTypeCode: state => state.Managements.CreateBillNOByBillTypeCode,
  WarehousesTree: state => state.Managements.GetWarehousesTree,
  UpdateTransferApplyStatusById: state => state.Managements.UpdateTransferApplyStatusById,
  UpdateApplyStatusById: state => state.Managements.UpdateApplyStatusById,
  UpdateUselessApplyStatusById: state => state.Managements.UpdateUselessApplyStatusById,
  InStocks: state => state.Managements.GetInStocks,
  GetInStockById: state => state.Managements.GetInStockById,
  Materiels: state => state.Managements.GetMateriels,
  MaterielById: state => state.Managements.GetMaterielById,
  UnitConvertsByMaterielId: state => state.Managements.GetUnitConvertsByMaterielId,
  UnitConvertById: state => state.Managements.GetUnitConvertById,
  InShelfById: state => state.Managements.GetInShelfById,
  InShelfs: state => state.Managements.GetInShelfs,
  removeInStock: state => state.Managements.RemoveInStock,
  saveInStock: state => state.Managements.SaveInStock,
  saveInShelf: state => state.Managements.SaveInShelf,
  getApplys: state => state.Managements.GetApplys,
  ApplyById: state => state.Managements.GetApplyById,
  removeApply: state => state.Managements.RemoveApply,
  saveApply: state => state.Managements.SaveApply,
  transferApplys: state => state.Managements.GetTransferApplys,
  transferApplyById: state => state.Managements.GetTransferApplyById,
  saveTransferApply: state => state.Managements.SaveTransferApply,
  removeTransferApply: state => state.Managements.RemoveTransferApply,
  OutStocks: state => state.Managements.GetOutStocks,
  OutStockById: state => state.Managements.GetOutStockById,
  removeOutStock: state => state.Managements.RemoveOutStock,
  saveOutStock: state => state.Managements.SaveOutStock,
  OutShelfs: state => state.Managements.GetOutShelfs,
  OutShelfById: state => state.Managements.GetOutShelfById,
  removeOutShelf: state => state.Managements.RemoveOutShelf,
  saveOutShelf: state => state.Managements.SaveOutShelf,
  UselessApplys: state => state.Managements.GetUselessApplys,
  UselessApplyById: state => state.Managements.GetUselessApplyById,
  saveUselessApply: state => state.Managements.SaveUselessApply,
  removeUselessApply: state => state.Managements.RemoveUselessApply,


  ULFB: state => state.Common.ULFB,
  ApprovalProcessOrderRecordLogGet: state => state.Common.ApprovalProcessOrderRecordLogGet,
  ApprovalProcessOrderRecordCreate: state => state.Common.ApprovalProcessOrderRecordCreate,
  GetLeaveByNo: state => state.Common.GetLeaveByNo,
  GetStaffMoveByNo: state => state.Common.GetStaffMoveByNo,
  ApprovedPass: state => state.Common.ApprovedPass,
  ApprovedRefused: state => state.Common.ApprovedRefused,
  ApprovedWithdraw: state => state.Common.ApprovedWithdraw,
  ApprovedCancel: state => state.Common.ApprovedCancel,
  ApprovedRefusedRedo: state => state.Common.ApprovedRefusedRedo,
  UpdateLeaveStatus: state => state.Common.UpdateLeaveStatus,
  ULFE: state => state.Common.ULFE,
  imgUrl: state => state.Common.imgUrl,
  // 物料分类
  GetMaterielCategoryTree: state => state.Materia.GetMaterielCategoryTree,
  GetMaterielCategorys: state => state.Materia.GetMaterielCategorys,
  CancelMaterielCategory: state => state.Materia.CancelMaterielCategory,// 停用
  UnCancelMaterielCategory: state => state.Materia.UnCancelMaterielCategory,
  RemoveMaterielCategory: state => state.Materia.RemoveMaterielCategory,
  SaveMaterielCategory: state => state.Materia.SaveMaterielCategory,
  GetMaterielCategoryById: state => state.Materia.GetMaterielCategoryById,
  // 物料档案
  GetMateriels: state => state.Materia.GetMateriels,
  SaveMateriel: state => state.Materia.SaveMateriel,
  GetMaterielById: state => state.Materia.GetMaterielById,
  UnCancelMateriel: state => state.Materia.UnCancelMateriel,
  CancelMateriel: state => state.Materia.CancelMateriel,
  RemoveMateriel: state => state.Materia.RemoveMateriel,
  GetMaterielsByKeyWord: state => state.Materia.GetMaterielsByKeyWord,
  GetMateriels: state => state.Managements.GetMateriels,
  SaveMateriel: state => state.Materia.SaveMateriel,
  UnCancelMateriel: state => state.Materia.UnCancelMateriel,
  CancelMateriel: state => state.Materia.CancelMateriel,
  RemoveMateriel: state => state.Materia.RemoveMateriel,
  GetMaterielsByKeyWord: state => state.Materia.GetMaterielsByKeyWord,
  GetUnitConvertsByMaterielId: state => state.Managements.GetUnitConvertsByMaterielId,
  // 仓库
  GetWarehouses: state => state.Materia.GetWarehouses,
  GetWarehousesTree: state => state.Managements.GetWarehousesTree,
  SaveWarehouse: state => state.Materia.SaveWarehouse,
  RemoveWarehouse: state => state.Materia.RemoveWarehouse,
  UnCancelWarehouse: state => state.Materia.UnCancelWarehouse,
  CancelWarehouse: state => state.Materia.CancelWarehouse,
  GetWarehouseById: state => state.Materia.GetWarehouseById,
  GetStockMonitorByWarehouseId: state => state.Materia.GetStockMonitorByWarehouseId,
  SaveStockMonitor: state => state.Materia.SaveStockMonitor,
  // 期初
  GetBeginPeriods: state => state.Materia.GetBeginPeriods,
  SaveBeginPeriod: state => state.Materia.SaveBeginPeriod,
  RemoveBeginPeriod: state => state.Materia.RemoveBeginPeriod,
  GetBeginPeriodById: state => state.Materia.GetBeginPeriodById,
  // 库存
  GetStocks: state => state.Materia.GetStocks,
  GetStockById: state => state.Materia.GetStockById,
  // 盘点计划
  GetInventoryPlans: state => state.Materia.GetInventoryPlans,
  RemoveInventoryPlan: state => state.Materia.RemoveInventoryPlan,
  GetInventoryPlanById: state => state.Materia.GetInventoryPlanById,
  SaveInventoryPlan: state => state.Materia.SaveInventoryPlan,
  UnCancelInventoryPlan: state => state.Materia.UnCancelInventoryPlan,
  CancelInventoryPlan: state => state.Materia.CancelInventoryPlan,
  // 盘点录入单
  GetInventorys: state => state.Materia.GetInventorys,
  SaveInventory: state => state.Materia.SaveInventory,
  RemoveInventory: state => state.Materia.RemoveInventory,
  DraftInventory: state => state.Materia.DraftInventory,
  GetInventoryById: state => state.Materia.GetInventoryById,
  // 盘点明细
  GetInventoryInfoById: state => state.Materia.GetInventoryInfoById,
  // 盘点调整
  GetAdjustments: state => state.Materia.GetAdjustments,
  SaveAdjustment: state => state.Materia.SaveAdjustment,
  RemoveAdjustment: state => state.Materia.RemoveAdjustment,
  GetAdjustmentById: state => state.Materia.GetAdjustmentById,
  // 资产台账
  GetAssetsDetails: state => state.Materia.GetAssetsDetails,
  SaveAssetsDetail: state => state.Materia.SaveAssetsDetail,
  CancelAssetsDetail: state => state.Materia.CancelAssetsDetail,
  UnCancelAssetsDetail: state => state.Materia.UnCancelAssetsDetail,
  RemoveAssetsDetail: state => state.Materia.RemoveAssetsDetail,
  GetAssetsDetailById: state => state.Materia.GetAssetsDetailById,
  //资产分类
  AssetsTypeGetTree: state => state.AssetManage.AssetsTypeGetTree,//树
  AssetsTypeGetList: state => state.AssetManage.AssetsTypeGetList,//列表
  AssetsTypeSave: state => state.AssetManage.AssetsTypeSave,//增、改
  AssetsTypeDeleteByID: state => state.AssetManage.AssetsTypeDeleteByID,//删
  AssetsTypeGetByID: state => state.AssetManage.AssetsTypeGetByID,//查
  AssetsTypeCancelByID: state => state.AssetManage.AssetsTypeCancelByID,//停用
  AssetsTypeUnCancelByID: state => state.AssetManage.AssetsTypeUnCancelByID,//启用

  //资产增加方式
  AssetsAddTypeGetList: state => state.AssetManage.AssetsAddTypeGetList,//列表
  AssetsAddTypeSave: state => state.AssetManage.AssetsAddTypeSave,//新增修改
  AssetsAddTypeDeleteByID: state => state.AssetManage.AssetsAddTypeDeleteByID,//删除
  AssetsAddTypeGetByID: state => state.AssetManage.AssetsAddTypeGetByID,//查询
  AssetsAddTypeCancelByID: state => state.AssetManage.AssetsAddTypeCancelByID,//禁用
  AssetsAddTypeUnCancelByID: state => state.AssetManage.AssetsAddTypeUnCancelByID,//启用
  //资产档案
  AssetsTypeGetTree: state => state.AssetManage.AssetsTypeGetTree,//树
  AssetsDetailGetList: state => state.AssetManage.AssetsDetailGetList,//列表
  AssetsDetailSave: state => state.AssetManage.AssetsDetailSave,//增、改
  AssetsDetailDeleteByID: state => state.AssetManage.AssetsDetailDeleteByID,//删
  AssetsDetailGetByID: state => state.AssetManage.AssetsDetailGetByID,//查
  AssetsAddTypeGetList: state => state.AssetManage.AssetsAddTypeGetList,//增加方式
  AssetsDetailCancelByID: state => state.AssetManage.AssetsDetailCancelByID,//禁用
  AssetsDetailUnCancelByID: state => state.AssetManage.AssetsDetailUnCancelByID,//启用
  //折旧记录
  AssetDepreciationLogGetList: state => state.AssetManage.AssetDepreciationLogGetList,//列表
  AssetDepreciationLogSave: state => state.AssetManage.AssetDepreciationLogSave,//新增
  //资产报废
  AssetScrapGetList: state => state.AssetManage.AssetScrapGetList,//列表
  AssetScrapSave: state => state.AssetManage.AssetScrapSave,//新增
  AssetScrapUpdateStatus: state => state.AssetManage.AssetScrapUpdateStatus,//状态修改
  AssetScrapGetById: state => state.AssetManage.AssetScrapGetById,//报废明细
  AssetScrapGetByNo:state => state.AssetManage.AssetScrapGetByNo,//报废审核数据获取
  //资产申领
  AssetCollectionGetList: state => state.AssetManage.AssetCollectionGetList,//列表
  AssetCollectionSave: state => state.AssetManage.AssetCollectionSave,//增、改
  AssetCollectionGetByID: state => state.AssetManage.AssetCollectionGetByID,//搜索
  AssetCollectionUpdateStatus: state => state.AssetManage.AssetCollectionUpdateStatus,//改变状态

  //设备分类
  DeviceTypeGetListByParentId: state => state.DeviceManage.DeviceTypeGetListByParentId,//列表
  DeviceTypeGetListTree: state => state.DeviceManage.DeviceTypeGetListTree,//树
  DeviceTypeEdit: state => state.DeviceManage.DeviceTypeEdit,//增、改
  DeviceTypeDelete: state => state.DeviceManage.DeviceTypeDelete,//删
  GetSingleDeviceType: state => state.DeviceManage.GetSingleDeviceType,//查

  //设备档案
  DeviceInfoGetList: state => state.DeviceManage.DeviceInfoGetList,//列表
  DeviceInfoEdit: state => state.DeviceManage.DeviceInfoEdit,//新增修改
  DeviceInfoGetbyID: state => state.DeviceManage.DeviceInfoGetbyID,//搜索
  DeviceInfoDel: state => state.DeviceManage.DeviceInfoDel,//禁用、停用
  //设备运维
  //巡检线路
  InspectionlineGetList: state => state.DeviceOperation.InspectionlineGetList,//巡检列表
  GetSingleInspectionline: state => state.DeviceOperation.GetSingleInspectionline,//单条数据
  SaveInspectionline: state => state.DeviceOperation.SaveInspectionline,//新增修改啊
  DelInspectionline: state => state.DeviceOperation.DelInspectionline,//停用启用
  //停工列表
  GetListDeviceStopLog: state => state.DeviceOperation.GetListDeviceStopLog, //巡检列表
  GetSingleDeviceStopLog: state => state.DeviceOperation.GetSingleDeviceStopLog, //单条数据
  SaveDeviceStopLog: state => state.DeviceOperation.SaveDeviceStopLog, //新增修改啊
  UpdateDeviceStopStatus: state => state.DeviceOperation.UpdateDeviceStopStatus,//状态改变
  // 品牌
  GetBrands: state => state.Materia.GetBrands,
  SaveBrand: state => state.Materia.SaveBrand,
  RemoveBrand: state => state.Materia.RemoveBrand,
  CancelBrand: state => state.Materia.CancelBrand,
  GetBrandById: state => state.Materia.GetBrandById,
  UnCancelBrand: state => state.Materia.UnCancelBrand,
  // 员工
  QueryStaff: state => state.Humanmanage.QueryStaff,
  QuerySupplier: state => state.Common.QuerySupplier,

  // 岗位
  QueryJobs: state => state.Humanmanage.QueryJobs,
  QueryOrganization: state => state.Humanmanage.QueryOrganization,
  QueryDuty: state => state.Humanmanage.QueryDuty,

  //采购管理
  //供应商
  GetListSupplierGroupTree: state => state.Purchasingmanagement.GetListSupplierGroupTree,//获取供应商分类
  GetListSupplierGroupByParentId: state => state.Purchasingmanagement.GetListSupplierGroupByParentId,//获取供应商分类ID获取分类列表
  DelSupplierGroup: state => state.Purchasingmanagement.DelSupplierGroup,//起停用/删除供应商分类
  SaveSupplierGroup: state => state.Purchasingmanagement.SaveSupplierGroup,//保存供应商分类
  GetSingleSupplierGroup: state => state.Purchasingmanagement.GetSingleSupplierGroup,//根据ID获取单个供应商分类信息
  GetListSupplier: state => state.Purchasingmanagement.GetListSupplier,//供应商列表
  DelSupplier: state => state.Purchasingmanagement.DelSupplier,//起停用/删除供应商
  SaveSupplierBatch: state => state.Purchasingmanagement.SaveSupplierBatch,//保存供应商
  GetSingleSupplier: state => state.Purchasingmanagement.GetSingleSupplier,//根据ID获取单个供应商信息
  GetListSupplierContacts: state => state.Purchasingmanagement.GetListSupplierContacts,//获取供应商联系人
  GetListSupplierExtend: state => state.Purchasingmanagement.GetListSupplierExtend,//获取供应商扩展
  GetListSupplierProduct: state => state.Purchasingmanagement.GetListSupplierProduct,//获取供应商产品
  //qinggou
  GetListPleaseBuy: state => state.Purchasingmanagement.GetListPleaseBuy,//获取请购单
  SavePleaseBuy: state => state.Purchasingmanagement.SavePleaseBuy,//新增请购单
  CreateBillNOByBillTypeCode: state => state.Purchasingmanagement.CreateBillNOByBillTypeCode,
  SavePleaseBuyAndInfo: state => state.Purchasingmanagement.SavePleaseBuyAndInfo,
  GetSinglePleaseBuy: state => state.Purchasingmanagement.GetSinglePleaseBuy,
  DelPleaseBuy: state => state.Purchasingmanagement.DelPleaseBuy,
  //采购
  GetListPurchase: state => state.Purchasingmanagement.GetListPurchase,
  SavePurchaseAndDetail: state => state.Purchasingmanagement.SavePurchaseAndDetail,
  GetSinglePurchase: state => state.Purchasingmanagement.GetSinglePurchase,
  DelPurchase: state => state.Purchasingmanagement.DelPurchase,
  GetListPleaseBuyInfo: state => state.Purchasingmanagement.GetListPleaseBuyInfo,
  GetListPurchaseDetail: state => state.Purchasingmanagement.GetListPurchaseDetail,
  UpdatePurchaseStatus: state => state.Purchasingmanagement.UpdatePurchaseStatus,


  //技术管理
  //技术分类
  GetListTechnologyTypeTree: state => state.Technology.GetListTechnologyTypeTree,//获取技术分类
  GetListTechnologyTypeByParentId: state => state.Technology.GetListTechnologyTypeByParentId,//获取技术分类ID获取分类列表
  DelTechnologyType: state => state.Technology.DelTechnologyType,//起停用/删除技术分类
  SaveTechnologyType: state => state.Technology.SaveTechnologyType,//保存技术分类
  GetSingleTechnologyType: state => state.Technology.GetSingleTechnologyType,//根据ID获取单个技术分类信息

  GetListTechnologyInfo: state => state.Technology.GetListTechnologyInfo,//根据分类ID获取技术列表信息
  DelTechnologyInfo: state => state.Technology.DelTechnologyInfo,//起停用/删除技术
  SaveTechnologyInfo: state => state.Technology.SaveTechnologyInfo,//保存技术
  GetSingleTechnologyInfo: state => state.Technology.GetSingleTechnologyInfo,//根据ID获取单个技术信息
}
export default getters
