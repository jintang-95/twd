<template>
  <div class="materiaType">
      <right-container 
        @selectType="selectType"
        @pageSizeToggle="pageSizeToggle"
        @pageToggle="pageToggle"
        @pagePrev="pagePrev"
        @pageNext="pageNext"
        @statusChange="statusChange"
        @inputChange="inputChange"
        @refreshPage="refreshPage"
        @addNew="addNew"
        @importEvent="importEvent"
       :page="page" 
       :pageSize="pageSize" 
       :total="total"
       :checkList="checkList" 
       :process="process"  
       :menuList="treeData" 
       title="全部仓库">
       <el-table :data="tableData" stripe header-row-class-name="headerClass" slot="table" align="center" cell-class-name="elliplise">
          <el-table-column v-for="(item, index) in columns" :width="item.width" :prop="item.prop" :label="item.label" :key="index"></el-table-column>
          <el-table-column
              label="操作"
              width="150">
              <template  slot-scope="scope">
                  <div>
                    <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-popconfirm
                    icon="el-icon-info"
                    iconColor="red"
                    title="确定删除吗？"
                    @onConfirm="del(scope.row)"
                  >
                    <el-button slot="reference" type="text" size="small">删除</el-button>
                  </el-popconfirm>
                  </div>
              </template>
          </el-table-column>
      </el-table>
      </right-container>
      <BeginMateriel :visible="showMask" :typeList="typeList" :type="formType" :formData="formData" @closeMask="closeMask" @addMateria="addMateria"></BeginMateriel>
  </div>
</template>

<script>
import RightContainer from '@/components/rightContainer.vue'
import BeginMateriel from './dialog/beginMateriel.vue'
import { treeToArray } from '@/util/util.js'
import { mapGetters } from 'vuex'
export default {
  name: 'storageSet',//仓库设定
  data() {
    return {
      pageSize: 10,
      page: 1,
      currentId: 0,
      total: 0,
      showMask: false,
      showWatch: false,//监控
      watchData: {},
      typeList: [],
      formData: {
        MaterielNo: '',
        MaterielName: '',
        MaterielSpec: '',
        MaterielModel: '',
        WarehouseId: '',
        Stock: '',
        UnitId: ''
      },
      editForm: {},
      formType: '1',
      process: ['Add', 'Import','search'],
      checkData: [],
      lastData: [],
      keyWord: '',
      tableData: [],
      checkList: [],
      treeData: [],
      columns: [
        {
          label: '物料编码',
          prop: 'MaterielNo'
        },
        {
          label: '物料名称',
          prop: 'MaterielName'
        },
        {
          label: '规格',
          prop: 'MaterielSpec'
        },
        {
          label: '型号',
          prop: 'MaterielModel',
          width: '100'
        },
        {
          label: '所在仓库',
          prop: 'WarehouseName'
        },
        {
          label: '价格',
          prop: 'Price'
        },
        {
          label: '库存数量',
          prop: 'Stock'
        },
        {
          label: '单位',
          prop: 'UnitName'
        },
        {
          label: '金额',
          prop: 'Amount',
          width: '100'
        },
        {
          label: '录入时间',
          prop: 'CreatedTime',
          width: '200'
        }
      ]
    };
  },
  async created() {
    await this.getTreeData()
    await this.getTableData()
    this.getAllWareHouseData()
  },
  computed: {
    ...mapGetters([
      'GetBeginPeriods',
      'GetWarehousesTree',
      'GetWarehouses',
      'SaveBeginPeriod',
      'RemoveBeginPeriod',
      'GetBeginPeriodById',
    ])
  },
  watch: {
    GetWarehousesTree (newValue, oldValue) {
      if (newValue.Code === 0) {
        this.treeData = newValue.ReturnData
        this.lastData = newValue.ReturnData
      } else {
        // 失败
      }
    },
    GetWarehouses (newValue, oldValue) {
      if (newValue.Code === 0) {
        this.typeList = newValue.ReturnData.Data
      } else {
        // 失败
      }
    },
    GetBeginPeriods (newValue, oldValue) {
      if (newValue.Code === 0) {
        for (let i = 0; i < newValue.ReturnData.Data.length; i++) {
          newValue.ReturnData.Data[i].Amount = newValue.ReturnData.Data[i].Price * newValue.ReturnData.Data[i].Stock
        }
        this.tableData = newValue.ReturnData.Data
        this.total = newValue.ReturnData.DataCount
      } else {
        // 失败
      }
    },
    async RemoveBeginPeriod(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: 'success'
        });
        await this.getTableData()
        this.getTreeData()
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: 'fail'
        });
      }
    },
    async SaveBeginPeriod(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.$message({
          showClose: true,
          message: "保存成功",
          type: 'success'
        });
        await this.getTableData()
        this.getTreeData()
        this.showMask = false
      } else {
        // 失败
        this.$message({
          showClose: true,
          message: newValue.Message,
          type: 'fail'
        });
      }
    },
    GetBeginPeriodById(newValue, oldValue) {
      if (newValue.Code === 0) {
        this.editForm = newValue.ReturnData
        this.openEdit()
      } else {
        // 失败
      }
    }
  },
  methods: {
    selectType(data) {
      this.currentId = data
      this.treeData = []
      this.treeData = this.lastData
      this.getTableData()
    },
    // 获取树形结构数据
    getTreeData () {
      let json = {
        MN: "GetWarehousesTree",
        DataContent: {
          "IsTool": "1",
          "IsAssets": "0",
          "IsReplaceMateriel": "0",
        }
      };
      this.MIX_send(json);
    },
    // 查询所有实体仓库
    getAllWareHouseData() {
      let json = {
        MN: "GetWarehouses",
        DataContent: {
          "KeyWord":"",
          "PageSize":"100",
          "PageIndex":1,
          "Category": 1,
          "IsTool": "1",
          "IsAssets": "0",
          "IsReplaceMateriel": "0",
        }
      };
      this.MIX_send(json);
    },
    // 获取表格数据
    getTableData() {
      let json = {
        MN: "GetBeginPeriods",
        DataContent: {
          "Id": this.currentId,
          "Status":this.checkData.join(','),
          "KeyWord":this.keyWord,
          "PageSize":this.pageSize,
          "PageIndex":this.page,
          "IsTool": "1",
          "IsAssets": "0",
          "IsReplaceMateriel": "0",
        }
      };
      this.MIX_send(json);
    },
    // 删除
    removeMateria (id) {
      let json = {
        MN: "RemoveBeginPeriod",
        DataContent: {
          "Ids": id
        }
      };
      this.MIX_send(json);
    },
    // 新增
    addMateriaType (data) {
      let json = {
        MN: "SaveBeginPeriod",
        DataContent: data
      };
      this.MIX_send(json);
    },
    // 页面Size切换
    pageSizeToggle(data) {
      this.pageSize = pageSize
      this.getTableData()
    },
    // 页面切换
    pageToggle(data) {
      this.page = data
      this.getTableData()
    },
    // 上一页回调
    pagePrev(data) {
      this.page = data
      this.getTableData()
    },
    // 下一页回调
    pageNext(data) {
      this.page = data
      this.getTableData()
    },
    // 顶部复选框过滤
    statusChange (data) {
      this.checkData = data
      this.getTableData()
    },
    // 输入框回车键
    inputChange(data) {
      this.keyWord = data
      console.log(data)
      this.getTableData()
    },
    // 刷新回调
    async refreshPage() {
      await this.getTreeData()
      await this.getTableData()
    },
    /**
     * 表格处理函数
     * */
    // 编辑
    edit(row) {
      this.formType = '2'
      this.formData= {
        MaterielNo: row.MaterielNo,
        MaterielName: row.MaterielName,
        MaterielSpec: row.MaterielSpec,
        MaterielModel: row.MaterielModel,
        WarehouseId: row.WarehouseId,
        Stock: row.Stock,
        UnitId: row.UnitId,
        Price: row.Price,
        Amount: row.Amount,
        UnitName: row.UnitName,
        MaterielId: row.MaterielId,
        Id: row.Id
      }
      this.getWareHouseById(row.Id)
    },
    getWareHouseById (Id) {
      let json = {
        MN: "GetBeginPeriodById",
        DataContent: {
          Id: Id
        }
      }
      this.MIX_send(json)
    },
    openEdit () {
      console.log(this.formData)
      this.showMask = true
    },
    // 停用
    stop(row) {
      this.stopMateria(row.Id)
    },
    // 删除
    del(row) {
      this.removeMateria(row.Id)
    },
    // 回收
    reCover(row) {

    },
    // 启用
    start(row) {
      this.startMateria(row.Id)
    },
    // 清除
    clear(row) {

    },
    // 新增
    addNew() {
      this.formType = '1'
      for (let key in this.formData) {
        if (key != 'Id') {
          this.formData[key] = this.formData[key] instanceof Array ? [] : typeof this.formData[key] == 'Object' ? {} : ''
        } else {
          delete this.formData[key]
        }        
      }
      console.log(this.formData)
      this.showMask = true
    },
    importEvent() {
      // TODO 导入功能待做
    },
    // 取消新增或者取消编辑
    closeMask (data) {
      this.showMask = false
      this.showWatch = false
    },
    // 新增或者编辑
    addMateria (data) {
      this.addMateriaType(data)
    },
  },
  components: {
    RightContainer,
    BeginMateriel
  }
}
</script>

<style scoped lang="less">
.processBtn {
  display: flex;

}
</style>