

let AssetManage = {
    state: {
        // 资产分类
        AssetsTypeGetTree: [],// 资产分类树形结构数据
        AssetsTypeGetList: [],// 资产 分类表格数据
        AssetsTypeCancelByID: [],// 停用
        AssetsTypeUnCancelByID: [],//启用
        AssetsTypeDeleteByID: [],//删除
        AssetsTypeSave: [],//新增
        AssetsTypeGetByID:[],//查询
        //资产增加方式
        AssetsAddTypeGetList:[],//列表
        AssetsAddTypeSave:[],//新增修改
        AssetsAddTypeDeleteByID:[],//删除
        AssetsAddTypeGetByID:[],//查询
        AssetsAddTypeCancelByID:[],//禁用
        AssetsAddTypeUnCancelByID:[],//启用

        //资产档案
        AssetsTypeGetTree:[],//树
        AssetsDetailGetList:[],//列表
        AssetsDetailSave:[],//增、改
        AssetsDetailDeleteByID:[],//删
        AssetsDetailGetByID:[],//查
        AssetsAddTypeGetList:[],//增加方式
        AssetsDetailCancelByID:[],//禁用
        AssetsDetailUnCancelByID:[],//启用
        // GetMaterielCategoryTree:[],
        //折旧记录
        AssetDepreciationLogGetList:[],//列表
        AssetDepreciationLogSave:[],//新增
         //资产报废
        AssetScrapGetList:[],//列表
        AssetScrapSave:[],//新增
        AssetScrapUpdateStatus:[],//状态修改
        AssetScrapGetById:[],//报废明细
        AssetCollectionUpdateStatus:[],//
        AssetScrapGetByNo:[],//报废审核
        //资产申领
        AssetCollectionGetList:[],//列表
        AssetCollectionSave:[],//新增修改
        AssetCollectionUpdateStatus:[],//状态修改
        AssetColleInfoGetList:[],//明细
        AssetColleInfoGetByID:[],
        AssetCollectionGetByID:[]
    },
    mutations: {
       
    },
    actions: {
       
    }
}

export default AssetManage